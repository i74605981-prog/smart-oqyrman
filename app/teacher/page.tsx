"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../utils/supabase/client";

type Profile = {
  id: string;
  full_name: string | null;
  school: string | null;
  role: string | null;
};

type Classroom = {
  id: string;
  teacher_id: string;
  name: string;
  grade: string | null;
  class_code: string;
  academic_year: string | null;
  created_at: string | null;
};

type StudentRow = {
  student_id: string;
  full_name: string | null;
  grade: string | null;
  school: string | null;
  books_selected: number | null;
  books_finished: number | null;
  total_score: number | null;
};

type ReadingRow = {
  book_id: string;
  status: string | null;
  reading_score: number | null;
  started_at: string | null;
  finished_at: string | null;
  updated_at: string | null;
};

type TestRow = {
  book_id: string;
  score: number | null;
};

type CreativeRow = {
  book_id: string;
  task_type: string | null;
  answer: string | null;
  file_path: string | null;
  score: number | null;
  completed: boolean | null;
  submitted_at: string | null;
};

type ReviewRow = {
  book_id: string;
  review: string | null;
  score: number | null;
  completed: boolean | null;
  submitted_at: string | null;
};

type BookRow = {
  id: string;
  title: string;
  author: string | null;
};

type BookResult = {
  bookId: string;
  title: string;
  author: string | null;
  readingStatus: string | null;
  readingScore: number;
  testScore: number;
  creativeScore: number;
  reviewScore: number;
  totalScore: number;
  creativeTaskType: string | null;
  creativeAnswer: string | null;
  creativeFile: string | null;
  reviewText: string | null;
};

export default function TeacherPage() {
  const supabase = createClient();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [studentsByClass, setStudentsByClass] = useState<
    Record<string, StudentRow[]>
  >({});

  const [className, setClassName] = useState("");
  const [grade, setGrade] = useState("");

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [selectedStudent, setSelectedStudent] =
    useState<StudentRow | null>(null);
  const [studentResults, setStudentResults] = useState<BookResult[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    loadTeacher();
  }, []);

  async function loadTeacher() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("id, full_name, school, role")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error(profileError);
    }

    if (profileData) {
      setProfile(profileData as Profile);
    }

    const { data: classroomData, error: classroomError } = await supabase
      .from("classrooms")
      .select(
        "id, teacher_id, name, grade, class_code, academic_year, created_at"
      )
      .eq("teacher_id", user.id)
      .order("created_at", { ascending: false });

    if (classroomError) {
      console.error(classroomError);
      setLoading(false);
      return;
    }

    const classList = (classroomData || []) as Classroom[];
    setClassrooms(classList);

    const resultMap: Record<string, StudentRow[]> = {};

    for (const classroom of classList) {
      const { data, error } = await supabase.rpc(
        "get_teacher_class_students",
        {
          p_classroom_id: classroom.id,
        }
      );

      if (error) {
        console.error(error);
        resultMap[classroom.id] = [];
      } else {
        resultMap[classroom.id] = (data || []) as StudentRow[];
      }
    }

    setStudentsByClass(resultMap);
    setLoading(false);
  }

  async function createClass() {
    if (!profile) return;

    if (!className.trim() || !grade.trim()) {
      alert("Сынып атауы мен сынып деңгейін толтырыңыз.");
      return;
    }

    setCreating(true);

    const randomCode = Math.random()
      .toString(36)
      .slice(2, 8)
      .toUpperCase();

    const classCode = `SO-${randomCode}`;

    const { error } = await supabase.from("classrooms").insert({
      teacher_id: profile.id,
      name: className.trim(),
      grade: grade.trim(),
      class_code: classCode,
      academic_year: "2026-2027",
    });

    if (error) {
      console.error(error);
      alert("Сынып құру кезінде қате шықты.");
      setCreating(false);
      return;
    }

    setClassName("");
    setGrade("");
    setCreating(false);

    await loadTeacher();
  }

  async function openStudentResult(student: StudentRow) {
    setSelectedStudent(student);
    setDetailOpen(true);
    setDetailLoading(true);
    setStudentResults([]);

    try {
      const [
        readingResponse,
        testResponse,
        creativeResponse,
        reviewResponse,
      ] = await Promise.all([
        supabase
          .from("reading_progress")
          .select(
            "book_id, status, reading_score, started_at, finished_at, updated_at"
          )
          .eq("student_id", student.student_id),

        supabase
          .from("test_results")
          .select("book_id, score")
          .eq("student_id", student.student_id),

        supabase
          .from("creative_submissions")
          .select(
            "book_id, task_type, answer, file_path, score, completed, submitted_at"
          )
          .eq("student_id", student.student_id),

        supabase
          .from("reviews")
          .select("book_id, review, score, completed, submitted_at")
          .eq("student_id", student.student_id),
      ]);

      if (readingResponse.error) throw readingResponse.error;
      if (testResponse.error) throw testResponse.error;
      if (creativeResponse.error) throw creativeResponse.error;
      if (reviewResponse.error) throw reviewResponse.error;

      const readings = (readingResponse.data || []) as ReadingRow[];
      const tests = (testResponse.data || []) as TestRow[];
      const creatives = (creativeResponse.data || []) as CreativeRow[];
      const reviews = (reviewResponse.data || []) as ReviewRow[];

      const bookIds = Array.from(
        new Set([
          ...readings.map((x) => x.book_id),
          ...tests.map((x) => x.book_id),
          ...creatives.map((x) => x.book_id),
          ...reviews.map((x) => x.book_id),
        ])
      );

      let books: BookRow[] = [];

      if (bookIds.length > 0) {
        const { data: booksData, error: booksError } = await supabase
          .from("books")
          .select("id, title, author")
          .in("id", bookIds);

        if (booksError) throw booksError;

        books = (booksData || []) as BookRow[];
      }

      const results: BookResult[] = bookIds.map((bookId) => {
        const book = books.find((x) => x.id === bookId);
        const reading = readings.find((x) => x.book_id === bookId);
        const test = tests.find((x) => x.book_id === bookId);
        const creative = creatives.find((x) => x.book_id === bookId);
        const review = reviews.find((x) => x.book_id === bookId);

        const readingScore = Number(reading?.reading_score || 0);
        const testScore = Number(test?.score || 0);
        const creativeScore = Number(creative?.score || 0);
        const reviewScore = Number(review?.score || 0);

        return {
          bookId,
          title: book?.title || "Кітап атауы",
          author: book?.author || null,
          readingStatus: reading?.status || null,
          readingScore,
          testScore,
          creativeScore,
          reviewScore,
          totalScore:
            readingScore + testScore + creativeScore + reviewScore,
          creativeTaskType: creative?.task_type || null,
          creativeAnswer: creative?.answer || null,
          creativeFile: creative?.file_path || null,
          reviewText: review?.review || null,
        };
      });

      setStudentResults(results);
    } catch (error) {
      console.error(error);
      alert("Оқушы нәтижесін жүктеу кезінде қате шықты.");
    }

    setDetailLoading(false);
  }

  async function copyCode(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      alert("Сынып коды көшірілді: " + code);
    } catch {
      alert("Сынып коды: " + code);
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-xl font-semibold text-purple-800">
          Мұғалім кабинеті жүктелуде...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f4fb]">
      <header className="bg-gradient-to-r from-purple-950 via-purple-900 to-purple-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black">SMART OQYRMAN</h1>
            <p className="text-purple-200 mt-1">
              Мұғалім кабинеті
            </p>
          </div>

          <button
            onClick={logout}
            className="rounded-xl bg-white/10 border border-white/20 px-5 py-2 font-semibold hover:bg-white/20"
          >
            Шығу
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <section className="rounded-3xl bg-white shadow-sm border border-purple-100 p-7 mb-7">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <p className="text-sm font-bold text-purple-600">
                МҰҒАЛІМ
              </p>

              <h2 className="text-3xl font-black text-slate-900 mt-1">
                {profile?.full_name || "Мұғалім"}
              </h2>

              {profile?.school && (
                <p className="text-slate-600 mt-2">
                  {profile.school}
                </p>
              )}
            </div>

            <div className="rounded-2xl bg-purple-50 px-6 py-4">
              <p className="text-sm text-purple-700 font-semibold">
                Сынып саны
              </p>
              <p className="text-4xl font-black text-purple-950">
                {classrooms.length}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-white shadow-sm border border-purple-100 p-7 mb-8">
          <h3 className="text-2xl font-black text-slate-900 mb-5">
            Жаңа сынып ашу
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder='Мысалы: 7 "А" сынып'
              className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
            />

            <input
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              placeholder="Сынып деңгейі: 7"
              className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
            />

            <button
              onClick={createClass}
              disabled={creating}
              className="rounded-xl bg-purple-800 text-white font-bold px-5 py-3 hover:bg-purple-900 disabled:opacity-50"
            >
              {creating ? "Құрылуда..." : "+ Жаңа сынып"}
            </button>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-3xl font-black text-slate-900">
              Менің сыныптарым
            </h3>
          </div>

          {classrooms.length === 0 ? (
            <div className="rounded-3xl bg-white border border-purple-100 p-10 text-center">
              <p className="text-slate-600 text-lg">
                Әзірге сынып ашылмаған.
              </p>
            </div>
          ) : (
            <div className="space-y-7">
              {classrooms.map((classroom) => {
                const students =
                  studentsByClass[classroom.id] || [];

                return (
                  <div
                    key={classroom.id}
                    className="rounded-3xl bg-white border border-purple-100 shadow-sm overflow-hidden"
                  >
                    <div className="bg-gradient-to-r from-purple-900 to-purple-700 text-white p-6">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <h4 className="text-2xl font-black">
                            {classroom.name}
                          </h4>

                          <p className="text-purple-200 mt-1">
                            {classroom.grade
                              ? `${classroom.grade}-сынып`
                              : ""}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="rounded-xl bg-white/10 px-4 py-3">
                            <p className="text-xs text-purple-200">
                              Сынып коды
                            </p>
                            <p className="text-xl font-black tracking-wider">
                              {classroom.class_code}
                            </p>
                          </div>

                          <button
                            onClick={() =>
                              copyCode(classroom.class_code)
                            }
                            className="rounded-xl bg-amber-400 text-purple-950 font-black px-4 py-3 hover:bg-amber-300"
                          >
                            Көшіру
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="mb-5">
                        <p className="text-slate-500">
                          Оқушы саны:
                          <span className="ml-2 font-black text-slate-900">
                            {students.length}
                          </span>
                        </p>
                      </div>

                      {students.length === 0 ? (
                        <div className="rounded-2xl bg-slate-50 p-6 text-center text-slate-500">
                          Бұл сыныпқа оқушылар әлі қосылмаған.
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full min-w-[950px]">
                            <thead>
                              <tr className="border-b border-slate-200 text-left">
                                <th className="py-3 pr-4 text-sm text-slate-500">
                                  Оқушы
                                </th>
                                <th className="py-3 px-4 text-sm text-slate-500">
                                  Сынып
                                </th>
                                <th className="py-3 px-4 text-sm text-slate-500">
                                  Таңдаған кітап
                                </th>
                                <th className="py-3 px-4 text-sm text-slate-500">
                                  Аяқтаған
                                </th>
                                <th className="py-3 px-4 text-sm text-slate-500">
                                  Жалпы ұпай
                                </th>
                                <th className="py-3 pl-4 text-sm text-slate-500">
                                  Нәтиже
                                </th>
                              </tr>
                            </thead>

                            <tbody>
                              {students.map((student) => (
                                <tr
                                  key={student.student_id}
                                  className="border-b border-slate-100"
                                >
                                  <td className="py-4 pr-4">
                                    <p className="font-bold text-slate-900">
                                      {student.full_name ||
                                        "Оқушы"}
                                    </p>

                                    {student.school && (
                                      <p className="text-xs text-slate-500 mt-1">
                                        {student.school}
                                      </p>
                                    )}
                                  </td>

                                  <td className="py-4 px-4 font-semibold text-slate-700">
                                    {student.grade || "—"}
                                  </td>

                                  <td className="py-4 px-4 font-bold text-purple-800">
                                    {student.books_selected || 0}
                                  </td>

                                  <td className="py-4 px-4 font-bold text-emerald-700">
                                    {student.books_finished || 0}
                                  </td>

                                  <td className="py-4 px-4">
                                    <span className="inline-flex rounded-xl bg-amber-100 px-4 py-2 font-black text-amber-900">
                                      {student.total_score || 0}
                                    </span>
                                  </td>

                                  <td className="py-4 pl-4">
                                    <button
                                      onClick={() =>
                                        openStudentResult(student)
                                      }
                                      className="rounded-xl bg-purple-800 px-5 py-3 text-white font-bold hover:bg-purple-900"
                                    >
                                      Нәтижесін қарау
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {detailOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-5">
          <div className="w-full max-w-6xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#f8f6fb] shadow-2xl">
            <div className="sticky top-0 z-10 bg-purple-950 text-white px-7 py-5 flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm font-bold">
                  ОҚУШЫ НӘТИЖЕСІ
                </p>

                <h2 className="text-2xl font-black">
                  {selectedStudent?.full_name || "Оқушы"}
                </h2>
              </div>

              <button
                onClick={() => setDetailOpen(false)}
                className="rounded-xl bg-white/10 px-4 py-2 font-bold hover:bg-white/20"
              >
                ✕ Жабу
              </button>
            </div>

            <div className="p-7">
              {detailLoading ? (
                <div className="py-16 text-center text-xl font-bold text-purple-800">
                  Нәтиже жүктелуде...
                </div>
              ) : studentResults.length === 0 ? (
                <div className="rounded-3xl bg-white p-10 text-center border border-purple-100">
                  <p className="text-xl font-bold text-slate-800">
                    Бұл оқушы бойынша әзірге нәтиже жоқ.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-7">
                    <div className="rounded-2xl bg-white border border-purple-100 p-5">
                      <p className="text-sm text-slate-500">
                        Оқыған кітап саны
                      </p>
                      <p className="text-4xl font-black text-purple-900 mt-1">
                        {studentResults.length}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white border border-purple-100 p-5">
                      <p className="text-sm text-slate-500">
                        Жиналған жалпы ұпай
                      </p>
                      <p className="text-4xl font-black text-amber-600 mt-1">
                        {studentResults.reduce(
                          (sum, item) =>
                            sum + item.totalScore,
                          0
                        )}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white border border-purple-100 p-5">
                      <p className="text-sm text-slate-500">
                        Бағалау жүйесі
                      </p>
                      <p className="text-xl font-black text-slate-900 mt-2">
                        20 + 50 + 10 + 20
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {studentResults.map((result, index) => (
                      <article
                        key={`${result.bookId}-${index}`}
                        className="rounded-3xl bg-white border border-purple-100 shadow-sm overflow-hidden"
                      >
                        <div className="bg-gradient-to-r from-purple-800 to-purple-600 text-white p-6">
                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                              <p className="text-purple-200 text-sm font-bold">
                                КІТАП
                              </p>

                              <h3 className="text-2xl font-black">
                                {result.title}
                              </h3>

                              {result.author && (
                                <p className="text-purple-100 mt-1">
                                  {result.author}
                                </p>
                              )}
                            </div>

                            <div className="rounded-2xl bg-amber-400 text-purple-950 px-5 py-3">
                              <p className="text-xs font-bold">
                                ЖАЛПЫ ҰПАЙ
                              </p>
                              <p className="text-3xl font-black">
                                {result.totalScore}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-6">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7">
                            <div className="rounded-2xl bg-purple-50 p-4">
                              <p className="text-xs text-purple-700 font-bold">
                                ОҚУ
                              </p>
                              <p className="text-3xl font-black text-purple-950">
                                {result.readingScore}
                                <span className="text-sm text-slate-400">
                                  /20
                                </span>
                              </p>
                            </div>

                            <div className="rounded-2xl bg-blue-50 p-4">
                              <p className="text-xs text-blue-700 font-bold">
                                ТЕСТ
                              </p>
                              <p className="text-3xl font-black text-blue-900">
                                {result.testScore}
                                <span className="text-sm text-slate-400">
                                  /50
                                </span>
                              </p>
                            </div>

                            <div className="rounded-2xl bg-orange-50 p-4">
                              <p className="text-xs text-orange-700 font-bold">
                                ШЫҒАРМАШЫЛЫҚ
                              </p>
                              <p className="text-3xl font-black text-orange-900">
                                {result.creativeScore}
                                <span className="text-sm text-slate-400">
                                  /10
                                </span>
                              </p>
                            </div>

                            <div className="rounded-2xl bg-emerald-50 p-4">
                              <p className="text-xs text-emerald-700 font-bold">
                                ПІКІР
                              </p>
                              <p className="text-3xl font-black text-emerald-900">
                                {result.reviewScore}
                                <span className="text-sm text-slate-400">
                                  /20
                                </span>
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            <section className="rounded-2xl border border-orange-200 bg-orange-50/50 p-5">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center text-xl">
                                  ✍️
                                </div>

                                <div>
                                  <h4 className="font-black text-lg text-slate-900">
                                    Шығармашылық тапсырмасы
                                  </h4>

                                  {result.creativeTaskType && (
                                    <p className="text-sm text-orange-700">
                                      {result.creativeTaskType}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {result.creativeAnswer ? (
                                <div className="rounded-xl bg-white p-4 text-slate-800 whitespace-pre-wrap leading-7 border border-orange-100">
                                  {result.creativeAnswer}
                                </div>
                              ) : (
                                <p className="text-slate-500">
                                  Мәтіндік шығармашылық жауап жоқ.
                                </p>
                              )}

                              {result.creativeFile && (
                                <div className="mt-4 rounded-xl bg-white p-4 border border-orange-100">
                                  <p className="text-xs font-bold text-orange-700 mb-1">
                                    ҚОСЫМША ФАЙЛ
                                  </p>

                                  {result.creativeFile.startsWith(
                                    "http"
                                  ) ? (
                                    <a
                                      href={result.creativeFile}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="font-bold text-purple-800 underline"
                                    >
                                      Файлды ашу
                                    </a>
                                  ) : (
                                    <p className="font-semibold text-slate-800 break-all">
                                      {result.creativeFile}
                                    </p>
                                  )}
                                </div>
                              )}
                            </section>

                            <section className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xl">
                                  💬
                                </div>

                                <div>
                                  <h4 className="font-black text-lg text-slate-900">
                                    Оқушының пікірі
                                  </h4>
                                  <p className="text-sm text-emerald-700">
                                    Кітап туралы жеке ойы
                                  </p>
                                </div>
                              </div>

                              {result.reviewText ? (
                                <div className="rounded-xl bg-white p-4 text-slate-800 whitespace-pre-wrap leading-7 border border-emerald-100">
                                  {result.reviewText}
                                </div>
                              ) : (
                                <p className="text-slate-500">
                                  Бұл кітап бойынша пікір жазылмаған.
                                </p>
                              )}
                            </section>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}