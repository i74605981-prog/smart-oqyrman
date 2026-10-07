"use client";

import { useEffect, useState } from "react";

type Student = {
  name: string;
  grade: string;
  school: string;
  login: string;
};

type Book = {
  id: number;
  title: string;
  author: string;
};

type ReadingResult = {
  bookId: number;
  book: string;
  author: string;
  status: "not-started" | "reading" | "finished";
  score: number;
  completed: boolean;
};

type TestResult = {
  bookId: number;
  book: string;
  author: string;
  correctAnswers: number;
  totalQuestions: number;
  score: number;
  maxScore: number;
  completed: boolean;
};

type CreativeResult = {
  bookId: number;
  book: string;
  author: string;
  taskId: number;
  taskTitle: string;
  answer: string;
  fileName: string;
  fileType: string;
  score: number;
  maxScore: number;
  completed: boolean;
};

type ReviewResult = {
  bookId: number;
  book: string;
  author: string;
  review: string;
  score: number;
  maxScore: number;
  completed: boolean;
};

export default function ProfilePage() {
  const [student, setStudent] = useState<Student | null>(null);
  const [book, setBook] = useState<Book | null>(null);

  const [readingResults, setReadingResults] = useState<
    Record<string, ReadingResult>
  >({});

  const [testResults, setTestResults] = useState<
    Record<string, TestResult>
  >({});

  const [creativeResults, setCreativeResults] = useState<
    Record<string, CreativeResult>
  >({});

  const [reviewResults, setReviewResults] = useState<
    Record<string, ReviewResult>
  >({});

  const [history, setHistory] = useState<Book[]>([]);

  useEffect(() => {
    const savedStudent = localStorage.getItem("smartOqyrmanStudent");
    const savedBook = localStorage.getItem("smartOqyrmanCurrentBook");
    const savedReading = localStorage.getItem("smartOqyrmanReadingResults");
    const savedTests = localStorage.getItem("smartOqyrmanTestResults");
    const savedCreative = localStorage.getItem("smartOqyrmanCreativeResults");
    const savedReviews = localStorage.getItem("smartOqyrmanReviewResults");
    const savedHistory = localStorage.getItem("smartOqyrmanBookHistory");

    if (savedStudent) {
      setStudent(JSON.parse(savedStudent));
    }

    const currentBook: Book | null = savedBook
      ? JSON.parse(savedBook)
      : null;

    if (currentBook) {
      setBook(currentBook);
    }

    const readingMap: Record<string, ReadingResult> = savedReading
      ? JSON.parse(savedReading)
      : {};

    const testMap: Record<string, TestResult> = savedTests
      ? JSON.parse(savedTests)
      : {};

    const creativeMap: Record<string, CreativeResult> = savedCreative
      ? JSON.parse(savedCreative)
      : {};

    const reviewMap: Record<string, ReviewResult> = savedReviews
      ? JSON.parse(savedReviews)
      : {};

    let historyList: Book[] = savedHistory
      ? JSON.parse(savedHistory)
      : [];

    const oldStatus = localStorage.getItem("smartOqyrmanReadingStatus");

    if (
      currentBook &&
      !readingMap[currentBook.title] &&
      (oldStatus === "not-started" ||
        oldStatus === "reading" ||
        oldStatus === "finished")
    ) {
      readingMap[currentBook.title] = {
        bookId: currentBook.id,
        book: currentBook.title,
        author: currentBook.author,
        status: oldStatus,
        score: oldStatus === "finished" ? 20 : 0,
        completed: oldStatus === "finished",
      };

      localStorage.setItem(
        "smartOqyrmanReadingResults",
        JSON.stringify(readingMap)
      );
    }

    localStorage.removeItem("smartOqyrmanReadingStatus");

    if (
      currentBook &&
      !historyList.some((item) => item.title === currentBook.title)
    ) {
      historyList.push(currentBook);

      localStorage.setItem(
        "smartOqyrmanBookHistory",
        JSON.stringify(historyList)
      );
    }

    setReadingResults(readingMap);
    setTestResults(testMap);
    setCreativeResults(creativeMap);
    setReviewResults(reviewMap);
    setHistory(historyList);
  }, []);

  function updateReadingStatus(
    newStatus: "reading" | "finished"
  ) {
    if (!book) return;

    const updated = {
      ...readingResults,
      [book.title]: {
        bookId: book.id,
        book: book.title,
        author: book.author,
        status: newStatus,
        score: newStatus === "finished" ? 20 : 0,
        completed: newStatus === "finished",
      } as ReadingResult,
    };

    setReadingResults(updated);

    localStorage.setItem(
      "smartOqyrmanReadingResults",
      JSON.stringify(updated)
    );
  }

  function openHistoryBook(historyBook: Book) {
    localStorage.setItem(
      "smartOqyrmanCurrentBook",
      JSON.stringify(historyBook)
    );

    window.location.reload();
  }

  if (!student) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="rounded-3xl bg-white p-8 text-center shadow-lg">
          <h1 className="text-3xl font-extrabold text-indigo-700">
            SMART OQYRMAN
          </h1>

          <p className="mt-4 text-slate-500">
            Алдымен платформаға тіркеліңіз.
          </p>

          <a
            href="/register"
            className="mt-6 inline-block rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white"
          >
            Тіркелу
          </a>
        </div>
      </main>
    );
  }

  const currentReading =
    book ? readingResults[book.title] : null;

  const currentStatus =
    currentReading?.status || "not-started";

  const currentTest =
    book ? testResults[book.title] : null;

  const currentCreative =
    book ? creativeResults[book.title] : null;

  const currentReview =
    book ? reviewResults[book.title] : null;

  const readingScore =
    currentStatus === "finished" ? 20 : 0;

  const testScore =
    currentTest?.score || 0;

  const creativeScore =
    currentCreative?.score || 0;

  const reviewScore =
    currentReview?.score || 0;

  const currentTotal =
    readingScore +
    testScore +
    creativeScore +
    reviewScore;

  function getBookTotal(historyBook: Book) {
    const read =
      readingResults[historyBook.title]?.status === "finished"
        ? 20
        : 0;

    const test =
      testResults[historyBook.title]?.score || 0;

    const creative =
      creativeResults[historyBook.title]?.score || 0;

    const review =
      reviewResults[historyBook.title]?.score || 0;

    return read + test + creative + review;
  }

  const finishedBookCount = history.filter(
    (item) =>
      readingResults[item.title]?.status === "finished"
  ).length;

  const allPoints = history.reduce(
    (sum, item) => sum + getBookTotal(item),
    0
  );

  const perfectResults = history.filter(
    (item) => getBookTotal(item) === 100
  ).length;

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <header className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>
              <h1 className="text-3xl font-extrabold text-indigo-700">
                SMART OQYRMAN
              </h1>

              <p className="mt-2 text-slate-500">
                Менің жеке кабинетім
              </p>
            </div>

            <div className="flex flex-wrap gap-3">

              <a
                href="/"
                className="rounded-xl bg-slate-100 px-5 py-3 font-semibold text-slate-700"
              >
                Басты бет
              </a>

              <a
                href="/books"
                className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white"
              >
                📚 Кітап таңдау
              </a>

              <a
                href="/ranking"
                className="rounded-xl bg-amber-500 px-5 py-3 font-semibold text-white"
              >
                🏆 Рейтинг
              </a>

            </div>

          </div>
        </header>

        {/* STUDENT */}
        <section className="mt-6 rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 p-8 text-white">

          <p className="text-sm font-bold uppercase tracking-widest text-indigo-200">
            Оқушы
          </p>

          <h2 className="mt-2 text-3xl font-extrabold">
            {student.name}
          </h2>

          <div className="mt-4 flex flex-wrap gap-3">

            <span className="rounded-full bg-white/20 px-4 py-2">
              {student.grade}
            </span>

            <span className="rounded-full bg-white/20 px-4 py-2">
              {student.school}
            </span>

            <span className="rounded-full bg-white/20 px-4 py-2">
              2026–2027 оқу жылы
            </span>

          </div>

        </section>

        {/* STATS */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Оқылған кітап
            </p>
            <p className="mt-2 text-3xl font-extrabold text-indigo-600">
              {finishedBookCount}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Жалпы жиналған ұпай
            </p>
            <p className="mt-2 text-3xl font-extrabold text-emerald-600">
              {allPoints}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Оқу тарихы
            </p>
            <p className="mt-2 text-3xl font-extrabold text-amber-500">
              {history.length}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              100 ұпайлық нәтиже
            </p>
            <p className="mt-2 text-3xl font-extrabold text-violet-600">
              {perfectResults}
            </p>
          </div>

        </section>

        {/* CURRENT BOOK */}
        <section className="mt-8 rounded-3xl bg-white p-7 shadow-sm">

          <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">
            Қазіргі кітап
          </p>

          {!book ? (
            <>
              <h2 className="mt-3 text-2xl font-extrabold text-slate-800">
                Әзірге кітап таңдалған жоқ
              </h2>

              <a
                href="/books"
                className="mt-5 inline-block rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white"
              >
                Кітап таңдау →
              </a>
            </>
          ) : (
            <>
              <div className="mt-4 rounded-3xl bg-indigo-50 p-6">

                <p className="text-sm font-bold text-indigo-600">
                  📖 Таңдалған кітап
                </p>

                <h2 className="mt-2 text-3xl font-extrabold text-slate-800">
                  «{book.title}»
                </h2>

                <p className="mt-2 text-lg text-slate-600">
                  {book.author}
                </p>

                <p className="mt-4 font-semibold text-slate-600">
                  🏫 Мектеп кітапханасынан алынады
                </p>

              </div>

              <div className="mt-6">

                {currentStatus === "not-started" && (
                  <button
                    type="button"
                    onClick={() =>
                      updateReadingStatus("reading")
                    }
                    className="w-full rounded-xl bg-indigo-600 px-6 py-4 font-bold text-white"
                  >
                    📖 Оқуды бастадым
                  </button>
                )}

                {currentStatus === "reading" && (
                  <>
                    <div className="rounded-2xl bg-amber-50 p-5">
                      <p className="font-bold text-amber-700">
                        📚 Оқу жүріп жатыр
                      </p>

                      <p className="mt-2 text-slate-600">
                        Кітапты оқып болған соң төмендегі батырманы бас.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        updateReadingStatus("finished")
                      }
                      className="mt-4 w-full rounded-xl bg-emerald-600 px-6 py-4 font-bold text-white"
                    >
                      ✅ Кітапты оқып бітірдім
                    </button>
                  </>
                )}

                {currentStatus === "finished" && (
                  <div className="rounded-2xl bg-emerald-50 p-5">
                    <p className="text-lg font-bold text-emerald-700">
                      ✅ Кітап оқылды
                    </p>

                    <p className="mt-2 text-slate-600">
                      Кітап оқу кезеңінен 20 ұпай алдың.
                    </p>
                  </div>
                )}

              </div>
            </>
          )}

        </section>

        {/* RESULTS */}
        {book && currentStatus === "finished" && (
          <section className="mt-8">

            <h2 className="text-3xl font-extrabold text-slate-800">
              Осы кітаптың нәтижесі
            </h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="text-4xl">📖</div>
                <h3 className="mt-4 text-xl font-extrabold">
                  Кітап оқу
                </h3>
                <p className="mt-4 text-3xl font-extrabold text-emerald-600">
                  20 / 20
                </p>
                <p className="mt-2 font-semibold text-emerald-600">
                  ✓ Аяқталды
                </p>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="text-4xl">✅</div>
                <h3 className="mt-4 text-xl font-extrabold">
                  Тест
                </h3>

                {currentTest ? (
                  <>
                    <p className="mt-4 text-3xl font-extrabold text-emerald-600">
                      {currentTest.score} / 50
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                      Дұрыс жауап: {currentTest.correctAnswers} / 5
                    </p>

                    <a
                      href="/test"
                      className="mt-5 inline-block w-full rounded-xl bg-slate-100 px-5 py-3 text-center font-bold text-slate-700"
                    >
                      Қайта тапсыру
                    </a>
                  </>
                ) : (
                  <>
                    <p className="mt-4 text-3xl font-extrabold text-slate-300">
                      0 / 50
                    </p>

                    <a
                      href="/test"
                      className="mt-5 inline-block w-full rounded-xl bg-emerald-600 px-5 py-3 text-center font-bold text-white"
                    >
                      Тестті бастау →
                    </a>
                  </>
                )}

              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="text-4xl">🎨</div>
                <h3 className="mt-4 text-xl font-extrabold">
                  Шығармашылық
                </h3>

                {currentCreative ? (
                  <>
                    <p className="mt-4 text-3xl font-extrabold text-emerald-600">
                      {currentCreative.score} / 10
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                      {currentCreative.taskTitle}
                    </p>

                    <a
                      href="/creative"
                      className="mt-5 inline-block w-full rounded-xl bg-slate-100 px-5 py-3 text-center font-bold text-slate-700"
                    >
                      Жұмысты көру →
                    </a>
                  </>
                ) : (
                  <>
                    <p className="mt-4 text-3xl font-extrabold text-slate-300">
                      0 / 10
                    </p>

                    <a
                      href="/creative"
                      className="mt-5 inline-block w-full rounded-xl bg-amber-500 px-5 py-3 text-center font-bold text-white"
                    >
                      Тапсырманы орындау →
                    </a>
                  </>
                )}

              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="text-4xl">💬</div>
                <h3 className="mt-4 text-xl font-extrabold">
                  Пікір
                </h3>

                {currentReview ? (
                  <>
                    <p className="mt-4 text-3xl font-extrabold text-emerald-600">
                      {currentReview.score} / 20
                    </p>

                    <p className="mt-2 font-semibold text-emerald-600">
                      ✓ Пікір жазылды
                    </p>

                    <a
                      href="/review"
                      className="mt-5 inline-block w-full rounded-xl bg-slate-100 px-5 py-3 text-center font-bold text-slate-700"
                    >
                      Пікірді көру →
                    </a>
                  </>
                ) : (
                  <>
                    <p className="mt-4 text-3xl font-extrabold text-slate-300">
                      0 / 20
                    </p>

                    <a
                      href="/review"
                      className="mt-5 inline-block w-full rounded-xl bg-violet-600 px-5 py-3 text-center font-bold text-white"
                    >
                      Пікір жазу →
                    </a>
                  </>
                )}

              </div>

            </div>

            <div className="mt-7 rounded-3xl bg-slate-900 p-7 text-white">

              <p className="text-center text-sm font-bold uppercase tracking-widest text-slate-400">
                Осы кітап бойынша жалпы нәтиже
              </p>

              <p className="mt-3 text-center text-5xl font-extrabold">
                {currentTotal} / 100
              </p>

              <div className="mt-6 h-4 overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{
                    width: `${currentTotal}%`,
                  }}
                />
              </div>

              <p className="mt-4 text-center text-slate-300">
                📖 {readingScore} + ✅ {testScore} + 🎨 {creativeScore} + 💬 {reviewScore}
              </p>

            </div>

          </section>
        )}

        {/* HISTORY */}
        <section className="mt-12">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">
                2026–2027
              </p>

              <h2 className="mt-2 text-3xl font-extrabold text-slate-800">
                📚 Менің оқу тарихым
              </h2>
            </div>

            <a
              href="/books"
              className="rounded-xl bg-indigo-600 px-5 py-3 text-center font-bold text-white"
            >
              + Жаңа кітап таңдау
            </a>

          </div>

          <div className="mt-6 space-y-4">

            {history.map((historyBook, index) => {
              const total = getBookTotal(historyBook);

              const isCurrent =
                book?.title === historyBook.title;

              return (
                <div
                  key={historyBook.title}
                  className={`rounded-3xl border-2 bg-white p-6 shadow-sm ${
                    isCurrent
                      ? "border-indigo-300"
                      : "border-transparent"
                  }`}
                >

                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                    <div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-500">
                        #{index + 1}
                      </span>

                      <h3 className="mt-3 text-2xl font-extrabold text-slate-800">
                        «{historyBook.title}»
                      </h3>

                      <p className="mt-1 text-slate-500">
                        {historyBook.author}
                      </p>
                    </div>

                    <div className="min-w-36 text-center">

                      <p className="text-3xl font-extrabold text-emerald-600">
                        {total}/100
                      </p>

                      {!isCurrent && (
                        <button
                          type="button"
                          onClick={() =>
                            openHistoryBook(historyBook)
                          }
                          className="mt-3 w-full rounded-xl bg-indigo-600 px-4 py-2 font-bold text-white"
                        >
                          Ашып көру
                        </button>
                      )}

                    </div>

                  </div>

                </div>
              );
            })}

          </div>

        </section>

        {/* RANKING CTA */}
        <section className="mt-10 rounded-3xl bg-gradient-to-r from-amber-400 to-orange-500 p-8 text-center text-white">

          <div className="text-5xl">
            🏆
          </div>

          <h2 className="mt-3 text-3xl font-extrabold">
            Оқушылар рейтингі
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-amber-50">
            Жинаған ұпайыңды, оқылған кітаптарыңды және ашылған
            жетістіктеріңді көр.
          </p>

          <a
            href="/ranking"
            className="mt-6 inline-block rounded-xl bg-white px-7 py-4 font-extrabold text-orange-600"
          >
            Рейтингті көру →
          </a>

        </section>

      </div>
    </main>
  );
}