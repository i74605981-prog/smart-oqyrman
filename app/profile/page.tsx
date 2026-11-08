"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import { createClient } from "../../utils/supabase/client";

type Profile = {
  id: string;
  login: string;
  full_name: string;
  grade: number | null;
  school: string;
  role: string;
};

type Book = {
  id: number;
  title: string;
  author: string;
  academic_year: string;
};

type ReadingProgress = {
  book_id: number;
  status: string;
  reading_score: number;
  started_at: string | null;
  finished_at: string | null;
  updated_at: string | null;
};

type ScoreRow = {
  book_id: number;
  score: number;
};

type CreativeRow = {
  book_id: number;
  task_type: string;
  answer: string | null;
  file_path: string | null;
  score: number;
};

type ReviewRow = {
  book_id: number;
  review: string;
  score: number;
};

type BookResult = {
  book: Book;
  status: string;
  readingScore: number;
  testScore: number;
  creativeScore: number;
  reviewScore: number;
  totalScore: number;
  creative: CreativeRow | null;
  review: ReviewRow | null;
};

type Classroom = {
  id: string;
  name: string;
  grade: number | null;
  class_code: string;
  academic_year: string;
};

type ClassMember = {
  classroom_id: string;
};

export default function ProfilePage() {
  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [books, setBooks] =
    useState<Book[]>([]);

  const [reading, setReading] =
    useState<ReadingProgress[]>([]);

  const [tests, setTests] =
    useState<ScoreRow[]>([]);

  const [creative, setCreative] =
    useState<CreativeRow[]>([]);

  const [reviews, setReviews] =
    useState<ReviewRow[]>([]);

  const [classrooms, setClassrooms] =
    useState<Classroom[]>([]);

  const [classCode, setClassCode] =
    useState("");

  const [joiningClass, setJoiningClass] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [finishingBook, setFinishingBook] =
    useState<number | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const [
      profileResult,
      booksResult,
      readingResult,
      testResult,
      creativeResult,
      reviewResult,
      memberResult,
    ] = await Promise.all([
      supabase
        .from("profiles")
        .select(
          "id, login, full_name, grade, school, role"
        )
        .eq("id", user.id)
        .single(),

      supabase
        .from("books")
        .select(
          "id, title, author, academic_year"
        )
        .eq("active", true)
        .order("id", {
          ascending: true,
        }),

      supabase
        .from("reading_progress")
        .select(
          "book_id, status, reading_score, started_at, finished_at, updated_at"
        )
        .eq("student_id", user.id)
        .order("updated_at", {
          ascending: false,
        }),

      supabase
        .from("test_results")
        .select(
          "book_id, score"
        )
        .eq("student_id", user.id),

      supabase
        .from("creative_submissions")
        .select(
          "book_id, task_type, answer, file_path, score"
        )
        .eq("student_id", user.id),

      supabase
        .from("reviews")
        .select(
          "book_id, review, score"
        )
        .eq("student_id", user.id),

      supabase
        .from("class_members")
        .select("classroom_id")
        .eq("student_id", user.id),
    ]);

    if (profileResult.error) {
      console.error(
        profileResult.error
      );

      alert(
        "Оқушы профилін жүктеу кезінде қате шықты."
      );

      setLoading(false);
      return;
    }

    setProfile(
      profileResult.data
    );

    setBooks(
      booksResult.data ?? []
    );

    setReading(
      readingResult.data ?? []
    );

    setTests(
      testResult.data ?? []
    );

    setCreative(
      creativeResult.data ?? []
    );

    setReviews(
      reviewResult.data ?? []
    );

    const membershipRows =
      (memberResult.data ??
        []) as ClassMember[];

    if (
      membershipRows.length > 0
    ) {
      const classIds =
        membershipRows.map(
          (item) =>
            item.classroom_id
        );

      const {
        data: classRows,
        error: classError,
      } = await supabase
        .from("classrooms")
        .select(
          "id, name, grade, class_code, academic_year"
        )
        .in(
          "id",
          classIds
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

      if (classError) {
        console.error(
          classError
        );

        setClassrooms([]);
      } else {
        setClassrooms(
          classRows ?? []
        );
      }
    } else {
      setClassrooms([]);
    }

    const savedBooks =
      booksResult.data ?? [];

    const savedReading =
      readingResult.data ?? [];

    if (
      savedReading.length > 0
    ) {
      const currentProgress =
        savedReading[0];

      const currentBook =
        savedBooks.find(
          (book) =>
            book.id ===
            currentProgress.book_id
        );

      if (currentBook) {
        localStorage.setItem(
          "smartOqyrmanCurrentBook",
          JSON.stringify(
            currentBook
          )
        );
      }

      const history =
        savedReading
          .map((item) =>
            savedBooks.find(
              (book) =>
                book.id ===
                item.book_id
            )
          )
          .filter(Boolean);

      localStorage.setItem(
        "smartOqyrmanBookHistory",
        JSON.stringify(
          history
        )
      );

      const readingResults: Record<
        string,
        {
          status: string;
          score: number;
        }
      > = {};

      savedReading.forEach(
        (item) => {
          const book =
            savedBooks.find(
              (savedBook) =>
                savedBook.id ===
                item.book_id
            );

          if (book) {
            readingResults[
              book.title
            ] = {
              status:
                item.status,

              score:
                item.reading_score,
            };
          }
        }
      );

      localStorage.setItem(
        "smartOqyrmanReadingResults",
        JSON.stringify(
          readingResults
        )
      );
    }

    setLoading(false);
  }

  const results =
    useMemo<BookResult[]>(
      () => {
        return reading
          .map(
            (
              readingItem
            ) => {
              const book =
                books.find(
                  (item) =>
                    item.id ===
                    readingItem.book_id
                );

              if (!book) {
                return null;
              }

              const testScore =
                tests.find(
                  (item) =>
                    item.book_id ===
                    readingItem.book_id
                )?.score ?? 0;

              const creativeResult =
                creative.find(
                  (item) =>
                    item.book_id ===
                    readingItem.book_id
                ) ?? null;

              const reviewResult =
                reviews.find(
                  (item) =>
                    item.book_id ===
                    readingItem.book_id
                ) ?? null;

              const creativeScore =
                creativeResult?.score ?? 0;

              const reviewScore =
                reviewResult?.score ?? 0;

              const totalScore =
                readingItem.reading_score +
                testScore +
                creativeScore +
                reviewScore;

              return {
                book,

                status:
                  readingItem.status,

                readingScore:
                  readingItem.reading_score,

                testScore,
                creativeScore,
                reviewScore,
                totalScore,

                creative:
                  creativeResult,

                review:
                  reviewResult,
              };
            }
          )
          .filter(
            (
              item
            ): item is BookResult =>
              item !== null
          );
      },
      [
        books,
        reading,
        tests,
        creative,
        reviews,
      ]
    );

  const totalPoints =
    results.reduce(
      (sum, item) =>
        sum +
        item.totalScore,
      0
    );

  const booksRead =
    results.filter(
      (item) =>
        item.status ===
        "finished"
    ).length;

  const perfectBooks =
    results.filter(
      (item) =>
        item.totalScore ===
        100
    ).length;

  const currentResult =
    results.length > 0
      ? results[0]
      : null;

  function getCreativeFileUrl(
    filePath: string
  ) {
    if (
      filePath.startsWith("http://") ||
      filePath.startsWith("https://")
    ) {
      return filePath;
    }

    if (!filePath.includes("/")) {
      return null;
    }

    const supabase =
      createClient();

    const { data } =
      supabase.storage
        .from("creative-files")
        .getPublicUrl(filePath);

    return data.publicUrl || null;
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

  async function joinClass(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const cleanCode =
      classCode
        .trim()
        .toUpperCase();

    if (!cleanCode) {
      alert(
        "Мұғалім берген сынып кодын енгізіңіз."
      );
      return;
    }

    setJoiningClass(true);

    const supabase =
      createClient();

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      setJoiningClass(false);

      window.location.href =
        "/login";

      return;
    }

    const {
      data,
      error,
    } = await supabase.rpc(
      "join_class_by_code",
      {
        p_class_code:
          cleanCode,
      }
    );

    if (error) {
      console.error(error);

      setJoiningClass(false);

      alert(
        "Сыныпқа қосылу мүмкін болмады. Кодты қайта тексеріңіз."
      );

      return;
    }

    if (!data) {
      setJoiningClass(false);

      alert(
        "Сынып табылмады."
      );

      return;
    }

    setClassCode("");

    setJoiningClass(false);

    alert(
      "Сыныпқа сәтті қосылдыңыз!"
    );

    await loadProfile();
  }

  async function finishReading(
    bookId: number
  ) {
    setFinishingBook(
      bookId
    );

    const supabase =
      createClient();

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      setFinishingBook(
        null
      );

      window.location.href =
        "/login";

      return;
    }

    const now =
      new Date().toISOString();

    const { error } =
      await supabase
        .from(
          "reading_progress"
        )
        .update({
          status: "finished",
          reading_score: 20,
          finished_at: now,
          updated_at: now,
        })
        .eq(
          "student_id",
          user.id
        )
        .eq(
          "book_id",
          bookId
        );

    if (error) {
      console.error(error);

      setFinishingBook(
        null
      );

      alert(
        "Оқу нәтижесін сақтау кезінде қате шықты."
      );

      return;
    }

    setFinishingBook(
      null
    );

    await loadProfile();
  }

  async function logout() {
    const supabase =
      createClient();

    await supabase.auth.signOut();

    localStorage.removeItem(
      "smartOqyrmanStudent"
    );

    localStorage.removeItem(
      "smartOqyrmanActiveStudentId"
    );

    localStorage.removeItem(
      "smartOqyrmanCurrentUser"
    );

    window.location.href =
      "/login";
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-5 py-20">

        <div className="text-center text-lg font-bold text-slate-500">
          Жеке кабинет жүктелуде...
        </div>

      </main>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8">

      <div className="mx-auto max-w-6xl">

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
              Кітап оқы. Ойлан. Талда. Дамы.
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

        {/* PROFILE */}
        <section className="mt-6 rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 p-7 text-white shadow-lg">

          <p className="text-sm font-bold text-indigo-100">
            👤 ОҚУШЫНЫҢ ЖЕКЕ КАБИНЕТІ
          </p>

          <h1 className="mt-2 text-3xl font-extrabold">
            {profile.full_name}
          </h1>

          <div className="mt-4 flex flex-wrap gap-3 text-sm">

            {profile.grade && (
              <span className="rounded-full bg-white/15 px-4 py-2">
                {profile.grade}-сынып
              </span>
            )}

            <span className="rounded-full bg-white/15 px-4 py-2">
              🏫 {profile.school}
            </span>

            <span className="rounded-full bg-white/15 px-4 py-2">
              @{profile.login}
            </span>

          </div>

        </section>

        {/* СЫНЫПҚА ҚОСЫЛУ */}
        <section className="mt-6 rounded-3xl bg-white p-7 shadow-sm">

          <div>

            <p className="text-sm font-bold uppercase tracking-widest text-violet-600">
              SMART OQYRMAN СЫНЫБЫ
            </p>

            <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
              🔑 Сыныпқа қосылу
            </h2>

            <p className="mt-2 max-w-2xl leading-7 text-slate-500">
              Мұғалім берген сынып кодын енгізіңіз.
              Осыдан кейін сіздің оқу нәтижеңіз мұғалімнің сыныбында көрінеді.
            </p>

          </div>

          <form
            onSubmit={joinClass}
            className="mt-6 flex flex-col gap-3 sm:flex-row"
          >

            <input
              type="text"
              value={classCode}
              onChange={(event) =>
                setClassCode(
                  event.target.value
                )
              }
              placeholder="Мысалы: SO-A12B34"
              className="flex-1 rounded-xl border border-slate-200 px-5 py-4 font-bold uppercase tracking-wider outline-none focus:border-violet-500"
            />

            <button
              type="submit"
              disabled={
                joiningClass
              }
              className="rounded-xl bg-violet-600 px-7 py-4 font-extrabold text-white hover:bg-violet-700 disabled:opacity-60"
            >
              {joiningClass
                ? "Қосылуда..."
                : "Сыныпқа қосылу →"}
            </button>

          </form>

          {classrooms.length > 0 && (
            <div className="mt-6">

              <p className="mb-3 font-extrabold text-slate-800">
                ✅ Мен қосылған сыныптар
              </p>

              <div className="grid gap-3 md:grid-cols-2">

                {classrooms.map(
                  (classroom) => (
                    <div
                      key={
                        classroom.id
                      }
                      className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5"
                    >

                      <div className="flex items-start justify-between gap-3">

                        <div>

                          <p className="text-sm font-bold text-indigo-600">
                            {classroom.grade
                              ? `${classroom.grade}-сынып`
                              : "SMART OQYRMAN"}
                          </p>

                          <p className="mt-1 text-lg font-extrabold text-slate-900">
                            {classroom.name}
                          </p>

                        </div>

                        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-emerald-600">
                          Қосылды
                        </span>

                      </div>

                      <p className="mt-3 text-sm text-slate-500">
                        Код:{" "}
                        <span className="font-bold text-indigo-700">
                          {classroom.class_code}
                        </span>
                      </p>

                    </div>
                  )
                )}

              </div>

            </div>
          )}

        </section>

        {/* НӘТИЖЕЛЕР */}
        <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm">

          <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">
            SMART OQYRMAN
          </p>

          <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
            📊 Менің нәтижелерім
          </h2>

          <p className="mt-2 text-slate-500">
            Оқу, тест, шығармашылық тапсырма және пікір бойынша жинаған ұпайларыңыз.
          </p>

        </section>

        {/* STATISTICS */}
        <section className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-3xl bg-white p-6 shadow-sm">

            <p className="text-sm text-slate-500">
              Жалпы ұпай
            </p>

            <p className="mt-2 text-3xl font-extrabold text-indigo-700">
              {totalPoints}
            </p>

          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">

            <p className="text-sm text-slate-500">
              Оқылған кітап
            </p>

            <p className="mt-2 text-3xl font-extrabold text-slate-900">
              {booksRead}
            </p>

          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">

            <p className="text-sm text-slate-500">
              Таңдалған кітап
            </p>

            <p className="mt-2 text-3xl font-extrabold text-slate-900">
              {results.length}
            </p>

          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">

            <p className="text-sm text-slate-500">
              100 ұпайлық нәтиже
            </p>

            <p className="mt-2 text-3xl font-extrabold text-amber-500">
              {perfectBooks}
            </p>

          </div>

        </section>

        {/* CURRENT BOOK */}
        {currentResult ? (
          <section className="mt-6 rounded-3xl bg-white p-7 shadow-sm">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

              <div>

                <p className="text-sm font-bold text-indigo-600">
                  ҚАЗІРГІ КІТАП
                </p>

                <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
                  {currentResult.book.title}
                </h2>

                <p className="mt-1 text-slate-500">
                  {currentResult.book.author}
                </p>

              </div>

              <span className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-700">
                {currentResult.totalScore} / 100 ұпай
              </span>

            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-4">

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">
                  📖 Оқу
                </p>
                <p className="mt-1 text-xl font-extrabold">
                  {currentResult.readingScore}/20
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">
                  📝 Тест
                </p>
                <p className="mt-1 text-xl font-extrabold">
                  {currentResult.testScore}/50
                </p>
              </div>

              <div className="rounded-2xl bg-violet-50 p-4">
                <p className="text-sm text-violet-600">
                  🎨 Шығармашылық
                </p>
                <p className="mt-1 text-xl font-extrabold">
                  {currentResult.creativeScore}/10
                </p>
              </div>

              <div className="rounded-2xl bg-amber-50 p-4">
                <p className="text-sm text-amber-600">
                  💬 Пікір
                </p>
                <p className="mt-1 text-xl font-extrabold">
                  {currentResult.reviewScore}/20
                </p>
              </div>

            </div>

            {currentResult.creative && (
              <div className="mt-5 rounded-2xl border border-violet-100 bg-violet-50 p-5">

                <p className="font-extrabold text-violet-700">
                  🎨 Менің шығармашылық тапсырмам
                </p>

                <p className="mt-2 text-sm font-bold text-slate-600">
                  {currentResult.creative.task_type}
                </p>

                {currentResult.creative.answer && (
                  <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-700">
                    {currentResult.creative.answer}
                  </p>
                )}

                {currentResult.creative.file_path &&
                  (() => {
                    const filePath =
                      currentResult.creative.file_path;

                    const fileUrl =
                      getCreativeFileUrl(
                        filePath
                      );

                    if (!fileUrl) {
                      return (
                        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">

                          <p className="font-bold">
                            📎 {filePath}
                          </p>

                          <p className="mt-1">
                            Файл атауы сақталған, бірақ Storage сілтемесі табылмады.
                          </p>

                        </div>
                      );
                    }

                    if (
                      isImageFile(
                        filePath
                      )
                    ) {
                      return (
                        <img
                          src={fileUrl}
                          alt="Шығармашылық жұмыс"
                          className="mt-4 max-h-[480px] w-full rounded-2xl bg-white object-contain"
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
                          src={fileUrl}
                          controls
                          playsInline
                          preload="metadata"
                          className="mt-4 max-h-[480px] w-full rounded-2xl bg-black"
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
                          src={fileUrl}
                          controls
                          className="mt-4 w-full"
                        />
                      );
                    }

                    return (
                      <a
                        href={fileUrl}
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

            {currentResult.review && (
              <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-5">

                <p className="font-extrabold text-amber-700">
                  💬 Менің пікірім
                </p>

                <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-700">
                  {currentResult.review.review}
                </p>

                <p className="mt-3 text-sm font-bold text-amber-700">
                  Пікір ұпайы: {currentResult.reviewScore}/20
                </p>

              </div>
            )}

            {currentResult.status !==
            "finished" ? (
              <button
                type="button"
                onClick={() =>
                  finishReading(
                    currentResult.book.id
                  )
                }
                disabled={
                  finishingBook ===
                  currentResult.book.id
                }
                className="mt-6 w-full rounded-xl bg-emerald-600 px-6 py-4 font-extrabold text-white hover:bg-emerald-700 disabled:opacity-60"
              >
                {finishingBook ===
                currentResult.book.id
                  ? "Сақталуда..."
                  : "✅ Кітапты оқып болдым +20 ұпай"}
              </button>
            ) : (
              <div className="mt-6 rounded-xl bg-emerald-50 px-5 py-4 text-center font-bold text-emerald-700">
                ✅ Кітап оқылып аяқталды — 20/20 ұпай
              </div>
            )}

            <div className="mt-5 grid gap-3 sm:grid-cols-3">

              <a
                href="/test"
                className="rounded-xl bg-indigo-600 px-5 py-4 text-center font-bold text-white"
              >
                📝 Тест тапсыру
              </a>

              <a
                href="/creative"
                className="rounded-xl bg-violet-600 px-5 py-4 text-center font-bold text-white"
              >
                🎨 Шығармашылық
              </a>

              <a
                href="/review"
                className="rounded-xl bg-amber-500 px-5 py-4 text-center font-bold text-white"
              >
                💬 Пікір жазу
              </a>

            </div>

          </section>
        ) : (
          <section className="mt-6 rounded-3xl bg-white p-10 text-center shadow-sm">

            <div className="text-5xl">
              📚
            </div>

            <h2 className="mt-4 text-2xl font-extrabold text-slate-900">
              Әлі кітап таңдалмаған
            </h2>

            <p className="mt-2 text-slate-500">
              Алдымен кітаптар тізімінен бір кітап таңдаңыз.
            </p>

            <a
              href="/books"
              className="mt-6 inline-block rounded-xl bg-indigo-600 px-6 py-4 font-bold text-white"
            >
              Кітап таңдау →
            </a>

          </section>
        )}

        {/* HISTORY */}
        {results.length > 0 && (
          <section className="mt-6">

            <div className="flex items-center justify-between">

              <h2 className="text-2xl font-extrabold text-slate-900">
                📚 Оқу тарихым
              </h2>

              <a
                href="/books"
                className="font-bold text-indigo-600"
              >
                + Кітап таңдау
              </a>

            </div>

            <div className="mt-4 space-y-4">

              {results.map(
                (item) => (
                  <article
                    key={
                      item.book.id
                    }
                    className="rounded-3xl bg-white p-6 shadow-sm"
                  >

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                      <div>

                        <h3 className="text-lg font-extrabold text-slate-900">
                          {item.book.title}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {item.book.author}
                        </p>

                      </div>

                      <div className="text-left sm:text-right">

                        <p className="text-2xl font-extrabold text-indigo-700">
                          {item.totalScore}/100
                        </p>

                        <p className="text-sm text-slate-500">
                          {item.status ===
                          "finished"
                            ? "✅ Оқылып болды"
                            : "📖 Оқылып жатыр"}
                        </p>

                      </div>

                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">

                      <div className="rounded-xl bg-slate-50 p-3 text-center">
                        <p className="text-xs text-slate-500">
                          Оқу
                        </p>
                        <p className="font-extrabold">
                          {item.readingScore}/20
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3 text-center">
                        <p className="text-xs text-slate-500">
                          Тест
                        </p>
                        <p className="font-extrabold">
                          {item.testScore}/50
                        </p>
                      </div>

                      <div className="rounded-xl bg-violet-50 p-3 text-center">
                        <p className="text-xs text-violet-600">
                          Шығармашылық
                        </p>
                        <p className="font-extrabold">
                          {item.creativeScore}/10
                        </p>
                      </div>

                      <div className="rounded-xl bg-amber-50 p-3 text-center">
                        <p className="text-xs text-amber-600">
                          Пікір
                        </p>
                        <p className="font-extrabold">
                          {item.reviewScore}/20
                        </p>
                      </div>

                    </div>

                    {item.creative && (
                      <div className="mt-4 rounded-2xl bg-violet-50 p-4">

                        <p className="font-extrabold text-violet-700">
                          🎨 Шығармашылық тапсырма
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-600">
                          {item.creative.task_type}
                        </p>

                        {item.creative.answer && (
                          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                            {item.creative.answer}
                          </p>
                        )}

                      </div>
                    )}

                    {item.review && (
                      <div className="mt-3 rounded-2xl bg-amber-50 p-4">

                        <p className="font-extrabold text-amber-700">
                          💬 Оқушы пікірі
                        </p>

                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                          {item.review.review}
                        </p>

                      </div>
                    )}

                  </article>
                )
              )}

            </div>

          </section>
        )}

        {/* FOOTER BUTTONS */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2">

          <a
            href="/books"
            className="rounded-2xl bg-indigo-600 px-6 py-4 text-center font-extrabold text-white"
          >
            📚 Кітаптар
          </a>

          <a
            href="/ranking"
            className="rounded-2xl bg-amber-500 px-6 py-4 text-center font-extrabold text-white"
          >
            🏆 Рейтинг
          </a>

        </section>

      </div>

    </main>
  );
}