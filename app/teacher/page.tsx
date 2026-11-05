"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import { createClient } from "../../utils/supabase/client";

type Profile = {
  id: string;
  login: string;
  full_name: string;
  school: string;
  school_id: string | null;
  region: string | null;
  district: string | null;
  role: string;
};

type StudentRow = {
  student_id: string;
  full_name: string;
  grade: string | null;
  school: string | null;
  books_selected: number;
  books_finished: number;
  total_score: number;
};

type Classroom = {
  id: string;
  name: string;
  grade: number | null;
  class_code: string;
  academic_year: string;
  active: boolean;
  created_at: string;
  students: StudentRow[];
};

export default function TeacherPage() {
  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [classrooms, setClassrooms] =
    useState<Classroom[]>([]);

  const [className, setClassName] =
    useState("");

  const [grade, setGrade] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [creating, setCreating] =
    useState(false);

  useEffect(() => {
    loadTeacher();
  }, []);

  async function loadTeacher() {
    const supabase =
      createClient();

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      window.location.href =
        "/login";
      return;
    }

    const {
      data: teacherProfile,
      error: profileError,
    } = await supabase
      .from("profiles")
      .select(
        `
        id,
        login,
        full_name,
        school,
        school_id,
        region,
        district,
        role
        `
      )
      .eq("id", user.id)
      .single();

    if (
      profileError ||
      !teacherProfile
    ) {
      console.error(
        profileError
      );

      alert(
        "Мұғалім профилін жүктеу кезінде қате шықты."
      );

      setLoading(false);
      return;
    }

    if (
      teacherProfile.role !==
        "teacher" &&
      teacherProfile.role !==
        "admin"
    ) {
      alert(
        "Бұл бөлім мұғалімдерге арналған."
      );

      window.location.href =
        "/profile";

      return;
    }

    setProfile(
      teacherProfile
    );

    const {
      data: classRows,
      error: classesError,
    } = await supabase
      .from("classrooms")
      .select(
        `
        id,
        name,
        grade,
        class_code,
        academic_year,
        active,
        created_at
        `
      )
      .eq(
        "teacher_id",
        user.id
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

    if (classesError) {
      console.error(
        classesError
      );

      setLoading(false);
      return;
    }

    const rawClasses =
      classRows ?? [];

    /*
      Әр сыныптың оқушыларын
      бөлек жүктейміз.
    */
    const classesWithStudents =
      await Promise.all(
        rawClasses.map(
          async (
            classroom
          ) => {
            const {
              data:
                studentRows,
              error:
                studentsError,
            } =
              await supabase.rpc(
                "get_teacher_class_students",
                {
                  p_classroom_id:
                    classroom.id,
                }
              );

            if (
              studentsError
            ) {
              console.error(
                studentsError
              );

              return {
                ...classroom,
                students: [],
              };
            }

            return {
              ...classroom,

              students:
                (studentRows ??
                  []) as StudentRow[],
            };
          }
        )
      );

    setClassrooms(
      classesWithStudents
    );

    setLoading(false);
  }

  /*
    БАРЛЫҚ СЫНЫПТАРДАҒЫ
    БІРЕГЕЙ ОҚУШЫ САНЫ
  */
  const totalStudents =
    new Set(
      classrooms.flatMap(
        (classroom) =>
          classroom.students.map(
            (student) =>
              student.student_id
          )
      )
    ).size;

  /*
    БАРЛЫҚ ОҚЫЛҒАН КІТАП
  */
  const totalFinishedBooks =
    classrooms.reduce(
      (
        classSum,
        classroom
      ) =>
        classSum +
        classroom.students.reduce(
          (
            studentSum,
            student
          ) =>
            studentSum +
            Number(
              student.books_finished ??
                0
            ),
          0
        ),
      0
    );

  /*
    ЖАЛПЫ ҰПАЙ
  */
  const totalPoints =
    classrooms.reduce(
      (
        classSum,
        classroom
      ) =>
        classSum +
        classroom.students.reduce(
          (
            studentSum,
            student
          ) =>
            studentSum +
            Number(
              student.total_score ??
                0
            ),
          0
        ),
      0
    );

  async function createClass(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!profile) {
      return;
    }

    const cleanClassName =
      className.trim();

    const cleanGrade =
      grade.trim();

    if (
      !cleanClassName ||
      !cleanGrade
    ) {
      alert(
        "Сынып атауы мен сынып деңгейін толтырыңыз."
      );

      return;
    }

    if (
      !profile.school ||
      !profile.region ||
      !profile.district
    ) {
      alert(
        "Мектеп, облыс және аудан/қала деректері толық емес."
      );

      return;
    }

    setCreating(true);

    const supabase =
      createClient();

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      setCreating(false);

      window.location.href =
        "/login";

      return;
    }

    let schoolId =
      profile.school_id;

    /*
      Мектеп бұрын базаға
      қосылған ба — тексереміз.
    */
    if (!schoolId) {
      const {
        data:
          existingSchool,
        error:
          schoolSearchError,
      } = await supabase
        .from("schools")
        .select(
          `
          id,
          name,
          region,
          district
          `
        )
        .ilike(
          "name",
          profile.school.trim()
        )
        .ilike(
          "region",
          profile.region.trim()
        )
        .ilike(
          "district",
          profile.district.trim()
        )
        .limit(1)
        .maybeSingle();

      if (
        schoolSearchError
      ) {
        console.error(
          schoolSearchError
        );
      }

      if (
        existingSchool
      ) {
        schoolId =
          existingSchool.id;
      } else {
        /*
          Мектеп жаңа болса,
          автоматты түрде қосылады.
        */
        const {
          data:
            newSchool,
          error:
            schoolInsertError,
        } = await supabase
          .from("schools")
          .insert({
            name:
              profile.school.trim(),

            region:
              profile.region.trim(),

            district:
              profile.district.trim(),

            created_by:
              user.id,
          })
          .select("id")
          .single();

        if (
          schoolInsertError ||
          !newSchool
        ) {
          console.error(
            schoolInsertError
          );

          setCreating(false);

          alert(
            "Мектепті базаға қосу кезінде қате шықты."
          );

          return;
        }

        schoolId =
          newSchool.id;
      }

      const {
        error:
          profileUpdateError,
      } = await supabase
        .from("profiles")
        .update({
          school_id:
            schoolId,
        })
        .eq(
          "id",
          user.id
        );

      if (
        profileUpdateError
      ) {
        console.error(
          profileUpdateError
        );
      }
    }

    if (!schoolId) {
      setCreating(false);

      alert(
        "Мектеп анықталмады."
      );

      return;
    }

    /*
      ЖАҢА СЫНЫП
    */
    const {
      data: newClass,
      error: classError,
    } = await supabase
      .from("classrooms")
      .insert({
        school_id:
          schoolId,

        teacher_id:
          user.id,

        name:
          cleanClassName,

        grade:
          Number(
            cleanGrade
          ),

        academic_year:
          "2026-2027",

        active: true,
      })
      .select(
        `
        id,
        name,
        grade,
        class_code,
        academic_year,
        active,
        created_at
        `
      )
      .single();

    if (
      classError ||
      !newClass
    ) {
      console.error(
        classError
      );

      setCreating(false);

      alert(
        "Сынып ашу кезінде қате шықты."
      );

      return;
    }

    setClassrooms(
      (
        previousClasses
      ) => [
        {
          ...newClass,
          students: [],
        },
        ...previousClasses,
      ]
    );

    setProfile({
      ...profile,
      school_id:
        schoolId,
    });

    setClassName("");
    setGrade("");

    setCreating(false);

    alert(
      `Сынып сәтті ашылды!\n\nСынып коды: ${newClass.class_code}`
    );
  }

  async function copyCode(
    code: string
  ) {
    try {
      await navigator.clipboard.writeText(
        code
      );

      alert(
        `Сынып коды көшірілді: ${code}`
      );
    } catch {
      alert(
        `Сынып коды: ${code}`
      );
    }
  }

  async function logout() {
    const supabase =
      createClient();

    await supabase.auth.signOut();

    localStorage.removeItem(
      "smartOqyrmanCurrentUser"
    );

    window.location.href =
      "/login";
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-5 py-20">

        <p className="text-center text-lg font-bold text-slate-500">
          Мұғалім кабинеті жүктелуде...
        </p>

      </main>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-violet-50 via-slate-50 to-indigo-50 px-4 py-8 sm:px-6">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <header className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">

          <div>

            <a
              href="/"
              className="text-2xl font-extrabold text-indigo-700"
            >
              SMART OQYRMAN
            </a>

            <p className="mt-1 text-sm text-slate-500">
              Мұғалімнің басқару кабинеті
            </p>

          </div>

          <button
            type="button"
            onClick={logout}
            className="rounded-xl bg-slate-100 px-5 py-3 font-bold text-slate-700"
          >
            Шығу
          </button>

        </header>

        {/* TEACHER PROFILE */}
        <section className="mt-6 overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 p-7 text-white shadow-xl">

          <p className="text-sm font-bold uppercase tracking-widest text-indigo-100">
            👩‍🏫 МҰҒАЛІМ КАБИНЕТІ
          </p>

          <h1 className="mt-3 text-3xl font-extrabold">
            {profile.full_name}
          </h1>

          <p className="mt-2 text-indigo-100">
            @{profile.login}
          </p>

          <div className="mt-6 grid gap-3 lg:grid-cols-3">

            <div className="rounded-2xl bg-white/10 p-4">

              <p className="text-xs font-bold uppercase tracking-wider text-indigo-100">
                📍 Облыс
              </p>

              <p className="mt-2 font-bold">
                {profile.region ||
                  "Көрсетілмеген"}
              </p>

            </div>

            <div className="rounded-2xl bg-white/10 p-4">

              <p className="text-xs font-bold uppercase tracking-wider text-indigo-100">
                🏘️ Аудан / қала
              </p>

              <p className="mt-2 font-bold">
                {profile.district ||
                  "Көрсетілмеген"}
              </p>

            </div>

            <div className="rounded-2xl bg-white/10 p-4">

              <p className="text-xs font-bold uppercase tracking-wider text-indigo-100">
                🏫 Мектеп
              </p>

              <p className="mt-2 font-bold">
                {profile.school ||
                  "Көрсетілмеген"}
              </p>

            </div>

          </div>

        </section>

        {/* GENERAL STATS */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-3xl bg-white p-6 shadow-sm">

            <p className="text-sm text-slate-500">
              Ашылған сынып
            </p>

            <p className="mt-2 text-4xl font-extrabold text-indigo-700">
              {classrooms.length}
            </p>

          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">

            <p className="text-sm text-slate-500">
              Қосылған оқушы
            </p>

            <p className="mt-2 text-4xl font-extrabold text-violet-700">
              {totalStudents}
            </p>

          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">

            <p className="text-sm text-slate-500">
              Оқылған кітап
            </p>

            <p className="mt-2 text-4xl font-extrabold text-emerald-600">
              {totalFinishedBooks}
            </p>

          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">

            <p className="text-sm text-slate-500">
              Жалпы ұпай
            </p>

            <p className="mt-2 text-4xl font-extrabold text-amber-500">
              {totalPoints}
            </p>

          </div>

        </section>

        {/* CREATE CLASS */}
        <section className="mt-6 rounded-3xl bg-white p-7 shadow-sm">

          <p className="text-sm font-bold uppercase tracking-widest text-violet-600">
            ЖАҢА СЫНЫП
          </p>

          <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
            ➕ Сынып ашу
          </h2>

          <p className="mt-2 max-w-3xl leading-7 text-slate-500">
            Өз мектебіңізде SMART OQYRMAN сыныбын ашыңыз.
            Жүйе автоматты түрде арнайы сынып кодын береді.
            Сол код арқылы оқушылар сіздің сыныбыңызға қосылады.
          </p>

          <form
            onSubmit={createClass}
            className="mt-7 grid gap-4 md:grid-cols-[1fr_220px_auto]"
          >

            <input
              type="text"
              value={className}
              onChange={(event) =>
                setClassName(
                  event.target.value
                )
              }
              placeholder="Мысалы: 7А SMART OQYRMAN"
              className="rounded-xl border border-slate-200 px-4 py-4 outline-none focus:border-violet-500"
            />

            <select
              value={grade}
              onChange={(event) =>
                setGrade(
                  event.target.value
                )
              }
              className="rounded-xl border border-slate-200 bg-white px-4 py-4 outline-none focus:border-violet-500"
            >

              <option value="">
                Сыныпты таңдаңыз
              </option>

              <option value="5">
                5-сынып
              </option>

              <option value="6">
                6-сынып
              </option>

              <option value="7">
                7-сынып
              </option>

              <option value="8">
                8-сынып
              </option>

              <option value="9">
                9-сынып
              </option>

            </select>

            <button
              type="submit"
              disabled={creating}
              className="rounded-xl bg-violet-600 px-7 py-4 font-extrabold text-white hover:bg-violet-700 disabled:opacity-60"
            >
              {creating
                ? "Ашылуда..."
                : "Сынып ашу"}
            </button>

          </form>

        </section>

        {/* CLASSROOMS */}
        <section className="mt-8">

          <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">
            SMART OQYRMAN
          </p>

          <h2 className="mt-1 text-2xl font-extrabold text-slate-900">
            📚 Менің сыныптарым
          </h2>

          {classrooms.length === 0 ? (
            <div className="mt-4 rounded-3xl bg-white p-10 text-center shadow-sm">

              <div className="text-5xl">
                🏫
              </div>

              <p className="mt-4 text-xl font-extrabold text-slate-800">
                Әзірге сынып ашылмаған
              </p>

              <p className="mt-2 text-slate-500">
                Жоғарыдағы бөлімнен алғашқы сыныбыңызды ашыңыз.
              </p>

            </div>
          ) : (
            <div className="mt-5 space-y-6">

              {classrooms.map(
                (classroom) => (
                  <article
                    key={classroom.id}
                    className="overflow-hidden rounded-3xl bg-white shadow-sm"
                  >

                    {/* CLASS HEADER */}
                    <div className="border-b border-slate-100 p-6">

                      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                        <div>

                          <p className="text-sm font-bold text-violet-600">
                            {classroom.grade
                              ? `${classroom.grade}-сынып`
                              : "SMART OQYRMAN"}
                          </p>

                          <h3 className="mt-1 text-2xl font-extrabold text-slate-900">
                            {classroom.name}
                          </h3>

                          <p className="mt-2 text-sm text-slate-500">
                            👥{" "}
                            {
                              classroom
                                .students
                                .length
                            }{" "}
                            оқушы
                          </p>

                        </div>

                        <div className="rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50 px-6 py-4 text-center">

                          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                            Сынып коды
                          </p>

                          <p className="mt-1 text-2xl font-black tracking-wider text-indigo-700">
                            {
                              classroom.class_code
                            }
                          </p>

                          <button
                            type="button"
                            onClick={() =>
                              copyCode(
                                classroom.class_code
                              )
                            }
                            className="mt-2 text-sm font-bold text-indigo-600"
                          >
                            📋 Кодты көшіру
                          </button>

                        </div>

                      </div>

                    </div>

                    {/* STUDENTS */}
                    {classroom.students
                      .length === 0 ? (
                      <div className="p-8 text-center">

                        <div className="text-4xl">
                          👥
                        </div>

                        <p className="mt-3 font-extrabold text-slate-800">
                          Әзірге оқушы қосылмаған
                        </p>

                        <p className="mt-2 text-sm text-slate-500">
                          Сынып кодын оқушыларға беріңіз.
                        </p>

                      </div>
                    ) : (
                      <div className="overflow-x-auto">

                        <table className="w-full min-w-[800px] text-left">

                          <thead className="bg-slate-50">

                            <tr>

                              <th className="px-6 py-4 text-sm font-bold text-slate-500">
                                №
                              </th>

                              <th className="px-6 py-4 text-sm font-bold text-slate-500">
                                Оқушы
                              </th>

                              <th className="px-6 py-4 text-sm font-bold text-slate-500">
                                Сыныбы
                              </th>

                              <th className="px-6 py-4 text-center text-sm font-bold text-slate-500">
                                Таңдалған кітап
                              </th>

                              <th className="px-6 py-4 text-center text-sm font-bold text-slate-500">
                                Оқылған кітап
                              </th>

                              <th className="px-6 py-4 text-right text-sm font-bold text-slate-500">
                                Жалпы ұпай
                              </th>

                            </tr>

                          </thead>

                          <tbody>

                            {classroom.students.map(
                              (
                                student,
                                index
                              ) => (
                                <tr
                                  key={
                                    student.student_id
                                  }
                                  className="border-t border-slate-100"
                                >

                                  <td className="px-6 py-5 text-sm text-slate-400">
                                    {index +
                                      1}
                                  </td>

                                  <td className="px-6 py-5">

                                    <p className="font-extrabold text-slate-900">
                                      {
                                        student.full_name
                                      }
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400">
                                      {
                                        student.school
                                      }
                                    </p>

                                  </td>

                                  <td className="px-6 py-5 font-bold text-slate-700">

                                    {student.grade
                                      ? `${student.grade}-сынып`
                                      : "—"}

                                  </td>

                                  <td className="px-6 py-5 text-center">

                                    <span className="rounded-full bg-indigo-50 px-4 py-2 font-extrabold text-indigo-700">

                                      {Number(
                                        student.books_selected ??
                                          0
                                      )}

                                    </span>

                                  </td>

                                  <td className="px-6 py-5 text-center">

                                    <span className="rounded-full bg-emerald-50 px-4 py-2 font-extrabold text-emerald-700">

                                      {Number(
                                        student.books_finished ??
                                          0
                                      )}

                                    </span>

                                  </td>

                                  <td className="px-6 py-5 text-right">

                                    <span className="text-xl font-extrabold text-amber-500">

                                      {Number(
                                        student.total_score ??
                                          0
                                      )}

                                    </span>

                                    <span className="ml-1 text-xs text-slate-400">
                                      ұпай
                                    </span>

                                  </td>

                                </tr>
                              )
                            )}

                          </tbody>

                        </table>

                      </div>
                    )}

                  </article>
                )
              )}

            </div>
          )}

        </section>

      </div>

    </main>
  );
}