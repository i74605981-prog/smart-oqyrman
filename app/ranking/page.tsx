"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "../../utils/supabase/client";

type RankingRow = {
  student_id: string;
  display_name: string;
  grade: number | null;
  school: string;
  books_read: number;
  total_points: number;
  perfect_books: number;
};

type ProfileRow = {
  id: string;
  login: string;
  full_name: string;
  grade: number | null;
  school: string;
  role: string;
};

type BookRow = {
  id: number;
  title: string;
  author: string;
};

type ReadingRow = {
  student_id: string;
  book_id: number;
  status: string;
  reading_score: number;
};

type TestRow = {
  student_id: string;
  book_id: number;
  score: number;
};

type CreativeRow = {
  student_id: string;
  book_id: number;
  task_type: string;
  answer: string | null;
  file_path: string | null;
  score: number;
};

type ReviewRow = {
  student_id: string;
  book_id: number;
  review: string;
  score: number;
};

export default function RankingPage() {
  const [ranking, setRanking] =
    useState<RankingRow[]>([]);

  const [currentUserId, setCurrentUserId] =
    useState("");

  const [currentProfile, setCurrentProfile] =
    useState<ProfileRow | null>(null);

  const [students, setStudents] =
    useState<ProfileRow[]>([]);

  const [books, setBooks] =
    useState<BookRow[]>([]);

  const [reading, setReading] =
    useState<ReadingRow[]>([]);

  const [tests, setTests] =
    useState<TestRow[]>([]);

  const [creative, setCreative] =
    useState<CreativeRow[]>([]);

  const [reviews, setReviews] =
    useState<ReviewRow[]>([]);

  const [
    selectedStudentId,
    setSelectedStudentId,
  ] = useState("");

  const [loading, setLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {
    loadRanking();
  }, []);

  async function loadRanking() {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    setCurrentUserId(user.id);

    const {
      data: profileData,
      error: profileError,
    } = await supabase
      .from("profiles")
      .select(
        "id, login, full_name, grade, school, role"
      )
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error(profileError);
    }

    if (profileData) {
      setCurrentProfile(
        profileData as ProfileRow
      );
    }

    const { data, error } =
      await supabase.rpc(
        "get_public_ranking"
      );

    if (error) {
      console.error(error);

      setErrorMessage(
        "Рейтингті жүктеу кезінде қате шықты."
      );

      setLoading(false);
      return;
    }

    const normalized: RankingRow[] =
      (data ?? []).map(
        (row: {
          student_id: string;
          display_name: string;
          grade: number | null;
          school: string;
          books_read:
            | number
            | string
            | null;
          total_points:
            | number
            | string
            | null;
          perfect_books:
            | number
            | string
            | null;
        }) => ({
          student_id:
            row.student_id,

          display_name:
            row.display_name,

          grade:
            row.grade,

          school:
            row.school,

          books_read:
            Number(
              row.books_read ?? 0
            ),

          total_points:
            Number(
              row.total_points ?? 0
            ),

          perfect_books:
            Number(
              row.perfect_books ?? 0
            ),
        })
      );

    setRanking(normalized);

    const role =
      profileData?.role;

    if (
      role === "admin" ||
      role === "teacher"
    ) {
      await loadAdminResults();
    }

    setLoading(false);
  }

  async function loadAdminResults() {
    const supabase = createClient();

    const [
      profilesResult,
      booksResult,
      readingResult,
      testsResult,
      creativeResult,
      reviewsResult,
    ] = await Promise.all([
      supabase
        .from("profiles")
        .select(
          "id, login, full_name, grade, school, role"
        )
        .eq("role", "student")
        .order("full_name"),

      supabase
        .from("books")
        .select(
          "id, title, author"
        )
        .eq("active", true)
        .order("id"),

      supabase
        .from(
          "reading_progress"
        )
        .select(
          "student_id, book_id, status, reading_score"
        ),

      supabase
        .from(
          "test_results"
        )
        .select(
          "student_id, book_id, score"
        ),

      supabase
        .from(
          "creative_submissions"
        )
        .select(
          "student_id, book_id, task_type, answer, file_path, score"
        ),

      supabase
        .from("reviews")
        .select(
          "student_id, book_id, review, score"
        ),
    ]);

    if (
      profilesResult.error ||
      booksResult.error ||
      readingResult.error ||
      testsResult.error ||
      creativeResult.error ||
      reviewsResult.error
    ) {
      console.error({
        profiles:
          profilesResult.error,

        books:
          booksResult.error,

        reading:
          readingResult.error,

        tests:
          testsResult.error,

        creative:
          creativeResult.error,

        reviews:
          reviewsResult.error,
      });

      return;
    }

    const studentData =
      (profilesResult.data ??
        []) as ProfileRow[];

    setStudents(studentData);

    setBooks(
      (booksResult.data ??
        []) as BookRow[]
    );

    setReading(
      (readingResult.data ??
        []) as ReadingRow[]
    );

    setTests(
      (testsResult.data ??
        []) as TestRow[]
    );

    setCreative(
      (creativeResult.data ??
        []) as CreativeRow[]
    );

    setReviews(
      (reviewsResult.data ??
        []) as ReviewRow[]
    );

    if (
      studentData.length > 0
    ) {
      setSelectedStudentId(
        studentData[0].id
      );
    }
  }

  const currentStudent =
    useMemo(() => {
      return ranking.find(
        (student) =>
          student.student_id ===
          currentUserId
      );
    }, [
      ranking,
      currentUserId,
    ]);

  const currentPosition =
    useMemo(() => {
      const index =
        ranking.findIndex(
          (student) =>
            student.student_id ===
            currentUserId
        );

      return index >= 0
        ? index + 1
        : null;
    }, [
      ranking,
      currentUserId,
    ]);

  const isAdmin =
    currentProfile?.role ===
      "admin" ||
    currentProfile?.role ===
      "teacher";

  const selectedStudent =
    students.find(
      (student) =>
        student.id ===
        selectedStudentId
    ) ?? null;

  const selectedStudentResults =
    useMemo(() => {
      if (!selectedStudent) {
        return [];
      }

      return reading
        .filter(
          (item) =>
            item.student_id ===
            selectedStudent.id
        )
        .map(
          (readingItem) => {
            const book =
              books.find(
                (item) =>
                  item.id ===
                  readingItem.book_id
              );

            if (!book) {
              return null;
            }

            const testResult =
              tests.find(
                (item) =>
                  item.student_id ===
                    selectedStudent.id &&
                  item.book_id ===
                    book.id
              ) ?? null;

            const creativeResult =
              creative.find(
                (item) =>
                  item.student_id ===
                    selectedStudent.id &&
                  item.book_id ===
                    book.id
              ) ?? null;

            const reviewResult =
              reviews.find(
                (item) =>
                  item.student_id ===
                    selectedStudent.id &&
                  item.book_id ===
                    book.id
              ) ?? null;

            const total =
              readingItem.reading_score +
              (
                testResult?.score ??
                0
              ) +
              (
                creativeResult?.score ??
                0
              ) +
              (
                reviewResult?.score ??
                0
              );

            return {
              book,

              reading:
                readingItem,

              test:
                testResult,

              creative:
                creativeResult,

              review:
                reviewResult,

              total,
            };
          }
        )
        .filter(
          (
            item
          ): item is NonNullable<
            typeof item
          > =>
            item !== null
        );
    }, [
      selectedStudent,
      reading,
      books,
      tests,
      creative,
      reviews,
    ]);

  function getMedal(
    position: number
  ) {
    if (position === 1)
      return "🥇";

    if (position === 2)
      return "🥈";

    if (position === 3)
      return "🥉";

    return `${position}`;
  }

  function getAchievements(
    student: RankingRow
  ) {
    const achievements:
      string[] = [];

    if (
      student.books_read >= 1
    ) {
      achievements.push(
        "📖 Алғашқы кітап"
      );
    }

    if (
      student.books_read >= 3
    ) {
      achievements.push(
        "📚 3 кітап"
      );
    }

    if (
      student.books_read >= 5
    ) {
      achievements.push(
        "🌟 5 кітап"
      );
    }

    if (
      student.perfect_books >=
      1
    ) {
      achievements.push(
        "💯 100 ұпай"
      );
    }

    if (
      student.total_points >=
      300
    ) {
      achievements.push(
        "🏅 300 ұпай"
      );
    }

    if (
      student.total_points >=
      500
    ) {
      achievements.push(
        "🏆 500 ұпай"
      );
    }

    return achievements;
  }

  function getCreativeFileUrl(
    filePath: string
  ) {
    if (
      filePath.startsWith(
        "http://"
      ) ||
      filePath.startsWith(
        "https://"
      )
    ) {
      return filePath;
    }

    if (
      !filePath.includes("/")
    ) {
      return null;
    }

    const supabase =
      createClient();

    const { data } =
      supabase.storage
        .from(
          "creative-files"
        )
        .getPublicUrl(
          filePath
        );

    return (
      data.publicUrl ||
      null
    );
  }

  function isImageFile(
    path: string
  ) {
    return /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(
      path
    );
  }

  function isVideoFile(
    path: string
  ) {
    return /\.(mp4|webm|ogg|mov|m4v)$/i.test(
      path
    );
  }

  function isAudioFile(
    path: string
  ) {
    return /\.(mp3|wav|ogg|m4a|aac)$/i.test(
      path
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-5 py-20">

        <p className="text-center text-lg font-bold text-slate-500">
          Рейтинг жүктелуде...
        </p>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8">

      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <header className="rounded-3xl bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <a
                href="/"
                className="text-3xl font-extrabold text-indigo-700"
              >
                SMART OQYRMAN
              </a>

              <p className="mt-2 text-slate-500">
                Кітап оқы. Ойлан. Талда. Дамы.
              </p>

            </div>

            <a
              href={
                isAdmin
                  ? "/admin"
                  : "/profile"
              }
              className="rounded-xl bg-indigo-50 px-5 py-3 text-center font-bold text-indigo-700"
            >
              ← Артқа
            </a>

          </div>

        </header>

        {/* HERO */}
        <section className="mt-6 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-500 p-8 text-white shadow-lg">

          <p className="text-sm font-bold uppercase tracking-widest text-amber-100">
            2026–2027 оқу жылы
          </p>

          <h1 className="mt-2 text-4xl font-extrabold">
            🏆 Оқырмандар рейтингі
          </h1>

          <p className="mt-3 max-w-2xl text-amber-50">
            Оқушылардың кітап оқу белсенділігі мен жинаған ұпайлары бойынша ортақ рейтинг.
          </p>

        </section>

        {/* ОҚУШЫНЫҢ ӨЗ НӘТИЖЕСІ */}
        {!isAdmin &&
          currentStudent && (
            <section className="mt-6 rounded-3xl bg-indigo-600 p-7 text-white shadow-lg">

              <p className="text-sm font-bold text-indigo-200">
                МЕНІҢ НӘТИЖЕМ
              </p>

              <div className="mt-4 grid gap-4 sm:grid-cols-4">

                <div className="rounded-2xl bg-white/10 p-4">

                  <p className="text-sm text-indigo-100">
                    Орным
                  </p>

                  <p className="mt-1 text-3xl font-extrabold">
                    {currentPosition
                      ? `${currentPosition}-орын`
                      : "—"}
                  </p>

                </div>

                <div className="rounded-2xl bg-white/10 p-4">

                  <p className="text-sm text-indigo-100">
                    Жалпы ұпай
                  </p>

                  <p className="mt-1 text-3xl font-extrabold">
                    {
                      currentStudent.total_points
                    }
                  </p>

                </div>

                <div className="rounded-2xl bg-white/10 p-4">

                  <p className="text-sm text-indigo-100">
                    Оқылған кітап
                  </p>

                  <p className="mt-1 text-3xl font-extrabold">
                    {
                      currentStudent.books_read
                    }
                  </p>

                </div>

                <div className="rounded-2xl bg-white/10 p-4">

                  <p className="text-sm text-indigo-100">
                    100 ұпайлық кітап
                  </p>

                  <p className="mt-1 text-3xl font-extrabold">
                    {
                      currentStudent.perfect_books
                    }
                  </p>

                </div>

              </div>

              <div className="mt-5 flex flex-wrap gap-2">

                {getAchievements(
                  currentStudent
                ).map(
                  (
                    achievement
                  ) => (
                    <span
                      key={
                        achievement
                      }
                      className="rounded-full bg-white/15 px-4 py-2 text-sm font-bold"
                    >
                      {
                        achievement
                      }
                    </span>
                  )
                )}

              </div>

            </section>
          )}

        {errorMessage && (
          <div className="mt-6 rounded-2xl bg-red-50 p-5 font-bold text-red-600">
            {errorMessage}
          </div>
        )}

        {/* ЖАЛПЫ РЕЙТИНГ */}
        {ranking.length > 0 && (
          <section className="mt-6 overflow-hidden rounded-3xl bg-white shadow-sm">

            <div className="border-b border-slate-100 p-6">

              <h2 className="text-2xl font-extrabold text-slate-900">
                🏆 Жалпы рейтинг
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Барлығы:{" "}
                {ranking.length} оқушы
              </p>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full min-w-[750px]">

                <thead className="bg-slate-50 text-left text-sm text-slate-500">

                  <tr>

                    <th className="px-6 py-4">
                      Орын
                    </th>

                    <th className="px-6 py-4">
                      Оқушы
                    </th>

                    <th className="px-6 py-4">
                      Сынып
                    </th>

                    <th className="px-6 py-4">
                      Кітап
                    </th>

                    <th className="px-6 py-4">
                      100 ұпай
                    </th>

                    <th className="px-6 py-4">
                      Жалпы ұпай
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {ranking.map(
                    (
                      student,
                      index
                    ) => {
                      const isCurrent =
                        student.student_id ===
                        currentUserId;

                      return (
                        <tr
                          key={
                            student.student_id
                          }
                          className={`border-t border-slate-100 ${
                            isCurrent
                              ? "bg-indigo-50"
                              : "bg-white"
                          }`}
                        >

                          <td className="px-6 py-5 text-xl font-extrabold">
                            {getMedal(
                              index +
                                1
                            )}
                          </td>

                          <td className="px-6 py-5">

                            <p className="font-extrabold text-slate-900">
                              {
                                student.display_name
                              }
                            </p>

                            <p className="mt-1 text-sm text-slate-400">
                              {
                                student.school
                              }
                            </p>

                          </td>

                          <td className="px-6 py-5 font-semibold text-slate-700">

                            {student.grade
                              ? `${student.grade}-сынып`
                              : "—"}

                          </td>

                          <td className="px-6 py-5 font-bold text-slate-700">

                            {
                              student.books_read
                            }

                          </td>

                          <td className="px-6 py-5 font-bold text-amber-600">

                            {
                              student.perfect_books
                            }

                          </td>

                          <td className="px-6 py-5">

                            <span className="rounded-xl bg-indigo-50 px-4 py-2 text-lg font-extrabold text-indigo-700">

                              {
                                student.total_points
                              }

                            </span>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          </section>
        )}

        {/* АДМИН НӘТИЖЕЛЕРІ */}
        {isAdmin && (
          <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm">

            <div className="border-b border-slate-100 pb-5">

              <p className="text-sm font-bold uppercase tracking-widest text-violet-600">
                АДМИН БӨЛІМІ
              </p>

              <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
                📊 Оқушылар нәтижелері
              </h2>

              <p className="mt-2 text-slate-500">
                Оқушыны таңдап, оқу, тест, шығармашылық тапсырма және пікір нәтижелерін қараңыз.
              </p>

            </div>

            {students.length ===
            0 ? (
              <p className="py-8 text-center text-slate-500">
                Оқушылар табылмады.
              </p>
            ) : (
              <>
                <div className="mt-6">

                  <label className="mb-2 block text-sm font-bold text-slate-600">
                    Оқушыны таңдаңыз
                  </label>

                  <select
                    value={
                      selectedStudentId
                    }
                    onChange={(
                      event
                    ) =>
                      setSelectedStudentId(
                        event.target
                          .value
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-5 py-4 font-bold text-slate-800 outline-none focus:border-violet-500"
                  >

                    {students.map(
                      (
                        student
                      ) => (
                        <option
                          key={
                            student.id
                          }
                          value={
                            student.id
                          }
                        >

                          {
                            student.full_name
                          }

                          {student.grade
                            ? ` — ${student.grade}-сынып`
                            : ""}

                        </option>
                      )
                    )}

                  </select>

                </div>

                {selectedStudent && (
                  <div className="mt-6">

                    <div className="rounded-2xl bg-violet-50 p-5">

                      <p className="text-sm font-bold text-violet-600">
                        ТАҢДАЛҒАН ОҚУШЫ
                      </p>

                      <h3 className="mt-1 text-2xl font-extrabold text-slate-900">
                        {
                          selectedStudent.full_name
                        }
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">

                        {selectedStudent.grade
                          ? `${selectedStudent.grade}-сынып`
                          : ""}

                        {selectedStudent.school
                          ? ` · ${selectedStudent.school}`
                          : ""}

                      </p>

                    </div>

                    {selectedStudentResults.length ===
                    0 ? (
                      <p className="py-8 text-center text-slate-500">
                        Бұл оқушының нәтижесі әзірге жоқ.
                      </p>
                    ) : (
                      <div className="mt-5 space-y-5">

                        {selectedStudentResults.map(
                          (
                            result
                          ) => (
                            <article
                              key={
                                result
                                  .book
                                  .id
                              }
                              className="rounded-3xl border border-slate-100 p-5 shadow-sm"
                            >

                              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                                <div>

                                  <h3 className="text-xl font-extrabold text-slate-900">
                                    {
                                      result
                                        .book
                                        .title
                                    }
                                  </h3>

                                  <p className="mt-1 text-slate-500">
                                    {
                                      result
                                        .book
                                        .author
                                    }
                                  </p>

                                </div>

                                <span className="rounded-xl bg-indigo-50 px-4 py-2 text-xl font-extrabold text-indigo-700">

                                  {
                                    result.total
                                  }
                                  /100

                                </span>

                              </div>

                              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">

                                <div className="rounded-xl bg-slate-50 p-4">

                                  <p className="text-sm text-slate-500">
                                    📖 Оқу
                                  </p>

                                  <p className="mt-1 text-xl font-extrabold">
                                    {
                                      result
                                        .reading
                                        .reading_score
                                    }
                                    /20
                                  </p>

                                </div>

                                <div className="rounded-xl bg-slate-50 p-4">

                                  <p className="text-sm text-slate-500">
                                    📝 Тест
                                  </p>

                                  <p className="mt-1 text-xl font-extrabold">
                                    {
                                      result
                                        .test
                                        ?.score ??
                                      0
                                    }
                                    /50
                                  </p>

                                </div>

                                <div className="rounded-xl bg-violet-50 p-4">

                                  <p className="text-sm text-violet-600">
                                    🎨 Шығармашылық
                                  </p>

                                  <p className="mt-1 text-xl font-extrabold">
                                    {
                                      result
                                        .creative
                                        ?.score ??
                                      0
                                    }
                                    /10
                                  </p>

                                </div>

                                <div className="rounded-xl bg-amber-50 p-4">

                                  <p className="text-sm text-amber-600">
                                    💬 Пікір
                                  </p>

                                  <p className="mt-1 text-xl font-extrabold">
                                    {
                                      result
                                        .review
                                        ?.score ??
                                      0
                                    }
                                    /20
                                  </p>

                                </div>

                              </div>

                              {result.creative && (
                                <div className="mt-5 rounded-2xl bg-violet-50 p-5">

                                  <p className="font-extrabold text-violet-700">
                                    🎨 Шығармашылық тапсырма
                                  </p>

                                  <p className="mt-2 text-sm font-bold text-slate-600">
                                    {
                                      result
                                        .creative
                                        .task_type
                                    }
                                  </p>

                                  {result.creative.answer && (
                                    <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-700">
                                      {
                                        result
                                          .creative
                                          .answer
                                      }
                                    </p>
                                  )}

                                  {result.creative.file_path &&
                                    (() => {
                                      const filePath =
                                        result
                                          .creative
                                          ?.file_path;

                                      if (
                                        !filePath
                                      ) {
                                        return null;
                                      }

                                      const fileUrl =
                                        getCreativeFileUrl(
                                          filePath
                                        );

                                      if (
                                        !fileUrl
                                      ) {
                                        return (
                                          <p className="mt-3 text-sm text-slate-500">
                                            📎{" "}
                                            {
                                              filePath
                                            }
                                          </p>
                                        );
                                      }

                                      if (
                                        isImageFile(
                                          filePath
                                        )
                                      ) {
                                        return (
                                          <img
                                            src={
                                              fileUrl
                                            }
                                            alt="Шығармашылық жұмыс"
                                            className="mt-4 max-h-[500px] w-full rounded-2xl bg-white object-contain"
                                          />
                                        );
                                      }

                                      if (
                                        isVideoFile(
                                          filePath
                                        )
                                      ) {
                                        return (
                                          <video
                                            src={
                                              fileUrl
                                            }
                                            controls
                                            playsInline
                                            preload="metadata"
                                            className="mt-4 max-h-[500px] w-full rounded-2xl bg-black"
                                          />
                                        );
                                      }

                                      if (
                                        isAudioFile(
                                          filePath
                                        )
                                      ) {
                                        return (
                                          <audio
                                            src={
                                              fileUrl
                                            }
                                            controls
                                            className="mt-4 w-full"
                                          />
                                        );
                                      }

                                      return (
                                        <a
                                          href={
                                            fileUrl
                                          }
                                          target="_blank"
                                          rel="noreferrer"
                                          className="mt-4 inline-block rounded-xl bg-violet-600 px-5 py-3 font-bold text-white"
                                        >
                                          📎 Файлды ашу
                                        </a>
                                      );
                                    })()}

                                </div>
                              )}

                              {result.review && (
                                <div className="mt-4 rounded-2xl bg-amber-50 p-5">

                                  <p className="font-extrabold text-amber-700">
                                    💬 Оқушы пікірі
                                  </p>

                                  <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-700">

                                    {
                                      result
                                        .review
                                        .review
                                    }

                                  </p>

                                </div>
                              )}

                            </article>
                          )
                        )}

                      </div>
                    )}

                  </div>
                )}

              </>
            )}

          </section>
        )}

        <div className="mt-8 text-center">

          <a
            href={
              isAdmin
                ? "/admin"
                : "/profile"
            }
            className="inline-block rounded-xl bg-indigo-600 px-7 py-4 font-extrabold text-white"
          >
            ← Артқа қайту
          </a>

        </div>

      </div>

    </main>
  );
}