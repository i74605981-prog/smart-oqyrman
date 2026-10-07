"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "../../utils/supabase/client";

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

type StudentSummary = {
  id: string;
  name: string;
  login: string;
  grade: number | null;
  school: string;
  booksRead: number;
  selectedBooks: number;
  totalPoints: number;
  perfectBooks: number;
};

export default function AdminPage() {
  const [author, setAuthor] =
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

  const [selectedStudentId, setSelectedStudentId] =
    useState("");

  const [loading, setLoading] = useState(true);

  const [accessDenied, setAccessDenied] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const {
      data: myProfile,
      error: profileError,
    } = await supabase
      .from("profiles")
      .select(
        "id, login, full_name, grade, school, role"
      )
      .eq("id", user.id)
      .single();

    if (profileError || !myProfile) {
      console.error(profileError);

      setErrorMessage(
        "Профильді жүктеу кезінде қате шықты."
      );

      setLoading(false);
      return;
    }

    if (
      myProfile.role !== "teacher" &&
      myProfile.role !== "admin"
    ) {
      setAccessDenied(true);
      setLoading(false);
      return;
    }

    setAuthor(myProfile);

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
        .select("id, title, author")
        .eq("active", true)
        .order("id"),

      supabase
        .from("reading_progress")
        .select(
          "student_id, book_id, status, reading_score"
        ),

      supabase
        .from("test_results")
        .select(
          "student_id, book_id, score"
        ),

      supabase
        .from("creative_submissions")
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
        profiles: profilesResult.error,
        books: booksResult.error,
        reading: readingResult.error,
        tests: testsResult.error,
        creative: creativeResult.error,
        reviews: reviewsResult.error,
      });

      setErrorMessage(
        "Оқушылардың нәтижелерін жүктеу кезінде қате шықты."
      );

      setLoading(false);
      return;
    }

    const studentData =
      (profilesResult.data ?? []) as ProfileRow[];

    setStudents(studentData);

    setBooks(
      (booksResult.data ?? []) as BookRow[]
    );

    setReading(
      (readingResult.data ?? []) as ReadingRow[]
    );

    setTests(
      (testsResult.data ?? []) as TestRow[]
    );

    setCreative(
      (creativeResult.data ?? []) as CreativeRow[]
    );

    setReviews(
      (reviewsResult.data ?? []) as ReviewRow[]
    );

    if (studentData.length > 0) {
      setSelectedStudentId(
        studentData[0].id
      );
    }

    setLoading(false);
  }

  function getBookTotal(
    studentId: string,
    bookId: number
  ) {
    const readingScore =
      reading.find(
        (item) =>
          item.student_id === studentId &&
          item.book_id === bookId
      )?.reading_score ?? 0;

    const testScore =
      tests.find(
        (item) =>
          item.student_id === studentId &&
          item.book_id === bookId
      )?.score ?? 0;

    const creativeScore =
      creative.find(
        (item) =>
          item.student_id === studentId &&
          item.book_id === bookId
      )?.score ?? 0;

    const reviewScore =
      reviews.find(
        (item) =>
          item.student_id === studentId &&
          item.book_id === bookId
      )?.score ?? 0;

    return (
      readingScore +
      testScore +
      creativeScore +
      reviewScore
    );
  }

  const summaries =
    useMemo<StudentSummary[]>(() => {
      return students
        .map((student) => {
          const studentReading =
            reading.filter(
              (item) =>
                item.student_id === student.id
            );

          const totalPoints =
            studentReading.reduce(
              (sum, item) =>
                sum +
                getBookTotal(
                  student.id,
                  item.book_id
                ),
              0
            );

          const perfectBooks =
            studentReading.filter(
              (item) =>
                getBookTotal(
                  student.id,
                  item.book_id
                ) === 100
            ).length;

          return {
            id: student.id,
            name: student.full_name,
            login: student.login,
            grade: student.grade,
            school: student.school,

            booksRead:
              studentReading.filter(
                (item) =>
                  item.status === "finished"
              ).length,

            selectedBooks:
              studentReading.length,

            totalPoints,
            perfectBooks,
          };
        })
        .sort(
          (a, b) =>
            b.totalPoints - a.totalPoints ||
            b.booksRead - a.booksRead
        );
    }, [
      students,
      reading,
      tests,
      creative,
      reviews,
    ]);

  const totalBooksRead =
    summaries.reduce(
      (sum, student) =>
        sum + student.booksRead,
      0
    );

  const allPoints =
    summaries.reduce(
      (sum, student) =>
        sum + student.totalPoints,
      0
    );

  const allPerfectBooks =
    summaries.reduce(
      (sum, student) =>
        sum + student.perfectBooks,
      0
    );

  const leader =
    summaries.length > 0
      ? summaries[0]
      : null;

  const selectedStudent =
    students.find(
      (student) =>
        student.id === selectedStudentId
    ) ?? null;

  const selectedBookResults =
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
        .map((readingItem) => {
          const book = books.find(
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
                item.book_id === book.id
            ) ?? null;

          const creativeResult =
            creative.find(
              (item) =>
                item.student_id ===
                  selectedStudent.id &&
                item.book_id === book.id
            ) ?? null;

          const reviewResult =
            reviews.find(
              (item) =>
                item.student_id ===
                  selectedStudent.id &&
                item.book_id === book.id
            ) ?? null;

          const total =
            readingItem.reading_score +
            (testResult?.score ?? 0) +
            (creativeResult?.score ?? 0) +
            (reviewResult?.score ?? 0);

          return {
            book,
            reading: readingItem,
            test: testResult,
            creative: creativeResult,
            review: reviewResult,
            total,
          };
        })
        .filter(
          (
            item
          ): item is NonNullable<
            typeof item
          > => item !== null
        );
    }, [
      selectedStudent,
      reading,
      books,
      tests,
      creative,
      reviews,
    ]);

  async function logout() {
    const supabase = createClient();

    await supabase.auth.signOut();

    localStorage.removeItem(
      "smartOqyrmanStudent"
    );

    localStorage.removeItem(
      "smartOqyrmanActiveStudentId"
    );

    window.location.href = "/login";
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-5 py-20">
        <p className="text-center text-lg font-bold text-slate-500">
          Жоба авторының кабинеті жүктелуде...
        </p>
      </main>
    );
  }

  if (accessDenied) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5">

        <section className="max-w-lg rounded-3xl bg-white p-9 text-center shadow-lg">

          <div className="text-6xl">
            🔒
          </div>

          <h1 className="mt-5 text-3xl font-extrabold text-slate-900">
            Қолжетімділік шектеулі
          </h1>

          <p className="mt-3 leading-7 text-slate-500">
            Бұл бөлім тек SMART OQYRMAN
            жобасының авторына арналған.
          </p>

          <a
            href="/profile"
            className="mt-7 inline-block rounded-xl bg-indigo-600 px-7 py-4 font-bold text-white"
          >
            ← Жеке кабинетке қайту
          </a>

        </section>

      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className="min-h-screen bg-slate-50 px-5 py-20">

        <div className="mx-auto max-w-xl rounded-3xl bg-red-50 p-8 text-center">

          <h1 className="text-2xl font-extrabold text-red-700">
            Қате шықты
          </h1>

          <p className="mt-3 text-red-600">
            {errorMessage}
          </p>

        </div>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8">

      <div className="mx-auto max-w-7xl">

        <header className="rounded-3xl bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <a
                href="/"
                className="text-3xl font-extrabold text-indigo-700"
              >
                SMART OQYRMAN
              </a>

              <p className="mt-1 text-slate-500">
                💡 Жоба авторының басқару панелі
              </p>

            </div>

            <div className="flex flex-wrap gap-3">

              <a
                href="/"
                className="rounded-xl bg-slate-100 px-5 py-3 font-bold text-slate-700"
              >
                Басты бет
              </a>

              <button
                onClick={logout}
                className="rounded-xl bg-red-50 px-5 py-3 font-bold text-red-600"
              >
                Шығу
              </button>

            </div>

          </div>

        </header>

        {author && (
          <section className="mt-6 rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 p-7 text-white shadow-lg">

            <p className="text-sm font-bold text-indigo-200">
              SMART OQYRMAN ЖОБАСЫНЫҢ АВТОРЫ
            </p>

            <h1 className="mt-2 text-3xl font-extrabold">
              {author.full_name}
            </h1>

            <p className="mt-2 text-indigo-100">
              Оқушылардың кітап оқу белсенділігі мен
              нәтижелерін басқару панелі
            </p>

          </section>
        )}

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">

          <div className="rounded-3xl bg-white p-6 shadow-sm">

            <p className="text-sm text-slate-500">
              Қатысушы саны
            </p>

            <p className="mt-2 text-3xl font-extrabold text-indigo-700">
              {summaries.length}
            </p>

          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">

            <p className="text-sm text-slate-500">
              Оқылған кітап
            </p>

            <p className="mt-2 text-3xl font-extrabold text-emerald-600">
              {totalBooksRead}
            </p>

          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">

            <p className="text-sm text-slate-500">
              Жалпы ұпай
            </p>

            <p className="mt-2 text-3xl font-extrabold text-violet-600">
              {allPoints}
            </p>

          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">

            <p className="text-sm text-slate-500">
              100 ұпайлық нәтиже
            </p>

            <p className="mt-2 text-3xl font-extrabold text-amber-500">
              {allPerfectBooks}
            </p>

          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">

            <p className="text-sm text-slate-500">
              Көшбасшы
            </p>

            <p className="mt-2 font-extrabold text-slate-900">
              {leader
                ? leader.name
                : "Әзірге жоқ"}
            </p>

            {leader && (
              <p className="mt-1 text-sm text-slate-500">
                {leader.totalPoints} ұпай
              </p>
            )}

          </div>

        </section>

        <section className="mt-6 overflow-hidden rounded-3xl bg-white shadow-sm">

          <div className="border-b border-slate-100 p-6">

            <h2 className="text-2xl font-extrabold text-slate-900">
              👥 Оқушылар нәтижесі
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              SMART OQYRMAN қатысушыларының
              нақты нәтижелері
            </p>

          </div>

          {summaries.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              Әзірге тіркелген оқушы жоқ.
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[850px]">

                <thead className="bg-slate-50 text-left text-sm text-slate-500">

                  <tr>

                    <th className="px-6 py-4">
                      Оқушы
                    </th>

                    <th className="px-6 py-4">
                      Сынып
                    </th>

                    <th className="px-6 py-4">
                      Оқылған кітап
                    </th>

                    <th className="px-6 py-4">
                      100 ұпай
                    </th>

                    <th className="px-6 py-4">
                      Жалпы ұпай
                    </th>

                    <th className="px-6 py-4">
                      Қарау
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {summaries.map(
                    (student, index) => (
                      <tr
                        key={student.id}
                        className="border-t border-slate-100"
                      >

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-3">

                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 font-extrabold text-indigo-700">
                              {index + 1}
                            </span>

                            <div>

                              <p className="font-extrabold text-slate-900">
                                {student.name}
                              </p>

                              <p className="mt-1 text-sm text-slate-400">
                                @{student.login}
                              </p>

                            </div>

                          </div>

                        </td>

                        <td className="px-6 py-5 font-semibold">
                          {student.grade
                            ? `${student.grade}-сынып`
                            : "—"}
                        </td>

                        <td className="px-6 py-5 font-bold">
                          {student.booksRead}
                        </td>

                        <td className="px-6 py-5 font-bold text-amber-600">
                          {student.perfectBooks}
                        </td>

                        <td className="px-6 py-5">

                          <span className="rounded-xl bg-indigo-50 px-4 py-2 font-extrabold text-indigo-700">
                            {student.totalPoints}
                          </span>

                        </td>

                        <td className="px-6 py-5">

                          <button
                            type="button"
                            onClick={() =>
                              setSelectedStudentId(
                                student.id
                              )
                            }
                            className="rounded-xl bg-slate-900 px-4 py-2 font-bold text-white"
                          >
                            Нәтижесін көру
                          </button>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

        </section>

        {selectedStudent && (
          <section className="mt-6 rounded-3xl bg-white p-7 shadow-sm">

            <div className="border-b border-slate-100 pb-5">

              <p className="text-sm font-bold text-indigo-600">
                ОҚУШЫ НӘТИЖЕСІ
              </p>

              <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
                {selectedStudent.full_name}
              </h2>

              <p className="mt-1 text-slate-500">

                {selectedStudent.grade
                  ? `${selectedStudent.grade}-сынып`
                  : ""}

                {selectedStudent.school
                  ? ` · ${selectedStudent.school}`
                  : ""}

              </p>

            </div>

            {selectedBookResults.length === 0 ? (
              <p className="py-8 text-center text-slate-500">
                Бұл оқушы әлі кітап таңдамаған.
              </p>
            ) : (
              <div className="mt-6 space-y-5">

                {selectedBookResults.map(
                  (result) => (
                    <article
                      key={result.book.id}
                      className="rounded-2xl border border-slate-100 p-6"
                    >

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                        <div>

                          <h3 className="text-xl font-extrabold text-slate-900">
                            {result.book.title}
                          </h3>

                          <p className="mt-1 text-slate-500">
                            {result.book.author}
                          </p>

                        </div>

                        <span className="rounded-xl bg-indigo-50 px-4 py-2 text-xl font-extrabold text-indigo-700">
                          {result.total}/100
                        </span>

                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-4">

                        <div className="rounded-xl bg-slate-50 p-4">

                          <p className="text-sm text-slate-500">
                            📖 Оқу
                          </p>

                          <p className="mt-1 text-xl font-extrabold">
                            {result.reading.reading_score}/20
                          </p>

                        </div>

                        <div className="rounded-xl bg-slate-50 p-4">

                          <p className="text-sm text-slate-500">
                            📝 Тест
                          </p>

                          <p className="mt-1 text-xl font-extrabold">
                            {result.test?.score ?? 0}/50
                          </p>

                        </div>

                        <div className="rounded-xl bg-slate-50 p-4">

                          <p className="text-sm text-slate-500">
                            🎨 Шығармашылық
                          </p>

                          <p className="mt-1 text-xl font-extrabold">
                            {result.creative?.score ?? 0}/10
                          </p>

                        </div>

                        <div className="rounded-xl bg-slate-50 p-4">

                          <p className="text-sm text-slate-500">
                            💬 Пікір
                          </p>

                          <p className="mt-1 text-xl font-extrabold">
                            {result.review?.score ?? 0}/20
                          </p>

                        </div>

                      </div>

                      {result.creative && (
                        <div className="mt-5 rounded-2xl bg-violet-50 p-5">

                          <p className="font-extrabold text-violet-700">
                            🎨 Шығармашылық тапсырма
                          </p>

                          <p className="mt-2 text-sm font-bold text-slate-600">
                            {result.creative.task_type}
                          </p>

                          {result.creative.answer && (
                            <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-700">
                              {result.creative.answer}
                            </p>
                          )}

                          {result.creative.file_path && (
                            <p className="mt-3 text-sm text-slate-500">
                              📎 {result.creative.file_path}
                            </p>
                          )}

                        </div>
                      )}

                      {result.review && (
                        <div className="mt-4 rounded-2xl bg-amber-50 p-5">

                          <p className="font-extrabold text-amber-700">
                            💬 Оқушы пікірі
                          </p>

                          <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-700">
                            {result.review.review}
                          </p>

                        </div>
                      )}

                    </article>
                  )
                )}

              </div>
            )}

          </section>
        )}

      </div>
    </main>
  );
}