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

type RankingEntry = {
  id: string;
  name: string;
  grade: string;
  school: string;
  totalPoints: number;
  booksRead: number;
  perfectBooks: number;
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

export default function AdminPage() {
  const [student, setStudent] = useState<Student | null>(null);
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [history, setHistory] = useState<Book[]>([]);

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

  useEffect(() => {
    const savedStudent = localStorage.getItem(
      "smartOqyrmanStudent"
    );

    const savedRanking = localStorage.getItem(
      "smartOqyrmanRanking"
    );

    const savedHistory = localStorage.getItem(
      "smartOqyrmanBookHistory"
    );

    const savedReading = localStorage.getItem(
      "smartOqyrmanReadingResults"
    );

    const savedTests = localStorage.getItem(
      "smartOqyrmanTestResults"
    );

    const savedCreative = localStorage.getItem(
      "smartOqyrmanCreativeResults"
    );

    const savedReviews = localStorage.getItem(
      "smartOqyrmanReviewResults"
    );

    const currentStudent: Student | null =
      savedStudent ? JSON.parse(savedStudent) : null;

    let rankingList: RankingEntry[] =
      savedRanking ? JSON.parse(savedRanking) : [];

    if (currentStudent) {
      setStudent(currentStudent);

      const studentId =
        currentStudent.login ||
        `${currentStudent.name}-${currentStudent.grade}`;

      const exists = rankingList.some(
        (item) => item.id === studentId
      );

      if (!exists) {
        rankingList.push({
          id: studentId,
          name: currentStudent.name,
          grade: currentStudent.grade,
          school: currentStudent.school,
          totalPoints: 0,
          booksRead: 0,
          perfectBooks: 0,
        });
      }
    }

    rankingList.sort(
      (a, b) => b.totalPoints - a.totalPoints
    );

    setRanking(rankingList);

    setHistory(
      savedHistory ? JSON.parse(savedHistory) : []
    );

    setReadingResults(
      savedReading ? JSON.parse(savedReading) : {}
    );

    setTestResults(
      savedTests ? JSON.parse(savedTests) : {}
    );

    setCreativeResults(
      savedCreative ? JSON.parse(savedCreative) : {}
    );

    setReviewResults(
      savedReviews ? JSON.parse(savedReviews) : {}
    );
  }, []);

  function getBookTotal(book: Book) {
    const reading =
      readingResults[book.title]?.status === "finished"
        ? 20
        : 0;

    const test =
      testResults[book.title]?.score || 0;

    const creative =
      creativeResults[book.title]?.score || 0;

    const review =
      reviewResults[book.title]?.score || 0;

    return reading + test + creative + review;
  }

  const totalStudents = ranking.length;

  const totalBooksRead = ranking.reduce(
    (sum, item) => sum + item.booksRead,
    0
  );

  const totalPoints = ranking.reduce(
    (sum, item) => sum + item.totalPoints,
    0
  );

  const perfectResults = ranking.reduce(
    (sum, item) => sum + item.perfectBooks,
    0
  );

  const leader =
    ranking.length > 0 ? ranking[0] : null;

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <header className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">
                Мұғалім бөлімі
              </p>

              <h1 className="mt-1 text-3xl font-extrabold text-slate-900">
                SMART OQYRMAN басқару панелі
              </h1>

              <p className="mt-2 text-slate-500">
                2026–2027 оқу жылы
              </p>
            </div>

            <div className="flex flex-wrap gap-3">

              <a
                href="/"
                className="rounded-xl bg-slate-100 px-5 py-3 font-bold text-slate-700"
              >
                Басты бет
              </a>

              <a
                href="/ranking"
                className="rounded-xl bg-amber-500 px-5 py-3 font-bold text-white"
              >
                🏆 Рейтинг
              </a>

              <a
                href="/profile"
                className="rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white"
              >
                👤 Оқушы кабинеті
              </a>

            </div>
          </div>
        </header>

        {/* INFO */}
        <section className="mt-6 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-white">

          <p className="text-sm font-bold uppercase tracking-widest text-indigo-300">
            Жалпы бақылау
          </p>

          <h2 className="mt-2 text-3xl font-extrabold">
            Оқу белсенділігінің мониторингі
          </h2>

          <p className="mt-3 max-w-3xl leading-7 text-slate-300">
            Мұғалім оқушылардың кітап оқу белсенділігін,
            тест нәтижелерін, шығармашылық тапсырмаларын,
            пікірлерін және жинаған ұпайларын бақылай алады.
          </p>

        </section>

        {/* STATS */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="text-4xl">👥</div>

            <p className="mt-4 text-sm text-slate-500">
              Оқушылар
            </p>

            <p className="mt-2 text-4xl font-extrabold text-indigo-600">
              {totalStudents}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="text-4xl">📚</div>

            <p className="mt-4 text-sm text-slate-500">
              Оқылған кітаптар
            </p>

            <p className="mt-2 text-4xl font-extrabold text-emerald-600">
              {totalBooksRead}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="text-4xl">⭐</div>

            <p className="mt-4 text-sm text-slate-500">
              Жалпы ұпай
            </p>

            <p className="mt-2 text-4xl font-extrabold text-amber-500">
              {totalPoints}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="text-4xl">💯</div>

            <p className="mt-4 text-sm text-slate-500">
              100 ұпайлық нәтиже
            </p>

            <p className="mt-2 text-4xl font-extrabold text-violet-600">
              {perfectResults}
            </p>
          </div>

        </section>

        {/* LEADER */}
        {leader && (
          <section className="mt-8 rounded-3xl bg-gradient-to-r from-amber-400 to-orange-500 p-7 text-white">

            <p className="text-sm font-bold uppercase tracking-widest text-amber-100">
              🏆 Қазіргі көшбасшы
            </p>

            <div className="mt-4 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

              <div>
                <h2 className="text-3xl font-extrabold">
                  {leader.name}
                </h2>

                <p className="mt-2 text-amber-50">
                  {leader.grade} · {leader.school}
                </p>
              </div>

              <div className="rounded-2xl bg-white/20 px-8 py-5 text-center">
                <p className="text-sm text-amber-50">
                  Жалпы ұпай
                </p>

                <p className="mt-1 text-4xl font-extrabold">
                  {leader.totalPoints}
                </p>
              </div>

            </div>

          </section>
        )}

        {/* STUDENT TABLE */}
        <section className="mt-10">

          <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">
            Оқушылар
          </p>

          <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
            📊 Оқушылар нәтижесі
          </h2>

          <div className="mt-6 overflow-hidden rounded-3xl bg-white shadow-sm">

            <div className="hidden grid-cols-12 bg-slate-100 px-6 py-4 text-sm font-bold text-slate-500 md:grid">

              <div className="col-span-1">
                №
              </div>

              <div className="col-span-5">
                Оқушы
              </div>

              <div className="col-span-2 text-center">
                Кітап
              </div>

              <div className="col-span-2 text-center">
                100 ұпай
              </div>

              <div className="col-span-2 text-center">
                Жалпы
              </div>

            </div>

            {ranking.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                Әзірге оқушы нәтижесі жоқ.
              </div>
            ) : (
              ranking.map((item, index) => (
                <div
                  key={item.id}
                  className="border-t border-slate-100 px-6 py-5"
                >

                  <div className="grid gap-4 md:grid-cols-12 md:items-center">

                    <div className="md:col-span-1">
                      <span className="font-extrabold text-indigo-600">
                        {index + 1}
                      </span>
                    </div>

                    <div className="md:col-span-5">

                      <p className="font-extrabold text-slate-800">
                        {item.name}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {item.grade} · {item.school}
                      </p>

                    </div>

                    <div className="md:col-span-2 md:text-center">
                      <p className="font-extrabold text-slate-700">
                        {item.booksRead}
                      </p>
                    </div>

                    <div className="md:col-span-2 md:text-center">
                      <p className="font-extrabold text-amber-600">
                        {item.perfectBooks}
                      </p>
                    </div>

                    <div className="md:col-span-2 md:text-center">
                      <p className="text-2xl font-extrabold text-emerald-600">
                        {item.totalPoints}
                      </p>
                    </div>

                  </div>

                </div>
              ))
            )}

          </div>

        </section>

        {/* CURRENT STUDENT DETAIL */}
        {student && (
          <section className="mt-12">

            <p className="text-sm font-bold uppercase tracking-widest text-violet-600">
              Толық мәлімет
            </p>

            <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
              👤 {student.name}
            </h2>

            <p className="mt-2 text-slate-500">
              {student.grade} · {student.school}
            </p>

            {history.length === 0 ? (
              <div className="mt-6 rounded-3xl bg-white p-8 text-center shadow-sm">
                <p className="text-slate-500">
                  Оқу тарихы әлі жоқ.
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-6">

                {history.map((book) => {
                  const reading =
                    readingResults[book.title];

                  const test =
                    testResults[book.title];

                  const creative =
                    creativeResults[book.title];

                  const review =
                    reviewResults[book.title];

                  const total =
                    getBookTotal(book);

                  return (
                    <div
                      key={book.title}
                      className="rounded-3xl bg-white p-7 shadow-sm"
                    >

                      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                        <div>
                          <p className="text-sm font-bold text-indigo-600">
                            📖 Кітап
                          </p>

                          <h3 className="mt-2 text-2xl font-extrabold text-slate-800">
                            «{book.title}»
                          </h3>

                          <p className="mt-1 text-slate-500">
                            {book.author}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-slate-900 px-7 py-4 text-center text-white">

                          <p className="text-xs text-slate-400">
                            НӘТИЖЕ
                          </p>

                          <p className="mt-1 text-3xl font-extrabold">
                            {total}/100
                          </p>

                        </div>

                      </div>

                      {/* SCORES */}
                      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

                        <div className="rounded-2xl bg-indigo-50 p-4">
                          <p className="text-sm text-slate-500">
                            📖 Оқу
                          </p>

                          <p className="mt-1 text-2xl font-extrabold text-indigo-600">
                            {reading?.status === "finished"
                              ? 20
                              : 0}
                            /20
                          </p>
                        </div>

                        <div className="rounded-2xl bg-emerald-50 p-4">
                          <p className="text-sm text-slate-500">
                            ✅ Тест
                          </p>

                          <p className="mt-1 text-2xl font-extrabold text-emerald-600">
                            {test?.score || 0}/50
                          </p>

                          {test && (
                            <p className="mt-1 text-xs text-slate-500">
                              {test.correctAnswers}/5 дұрыс
                            </p>
                          )}
                        </div>

                        <div className="rounded-2xl bg-amber-50 p-4">
                          <p className="text-sm text-slate-500">
                            🎨 Шығармашылық
                          </p>

                          <p className="mt-1 text-2xl font-extrabold text-amber-600">
                            {creative?.score || 0}/10
                          </p>
                        </div>

                        <div className="rounded-2xl bg-violet-50 p-4">
                          <p className="text-sm text-slate-500">
                            💬 Пікір
                          </p>

                          <p className="mt-1 text-2xl font-extrabold text-violet-600">
                            {review?.score || 0}/20
                          </p>
                        </div>

                      </div>

                      {/* CREATIVE DETAIL */}
                      {creative && (
                        <details className="mt-5 rounded-2xl bg-amber-50 p-5">

                          <summary className="cursor-pointer font-extrabold text-amber-700">
                            🎨 Шығармашылық жұмысты көру
                          </summary>

                          <p className="mt-4 font-bold text-slate-700">
                            {creative.taskTitle}
                          </p>

                          {creative.answer && (
                            <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-600">
                              {creative.answer}
                            </p>
                          )}

                          {creative.fileName && (
                            <p className="mt-3 text-sm text-slate-500">
                              📎 Файл: {creative.fileName}
                            </p>
                          )}

                        </details>
                      )}

                      {/* REVIEW DETAIL */}
                      {review && (
                        <details className="mt-4 rounded-2xl bg-violet-50 p-5">

                          <summary className="cursor-pointer font-extrabold text-violet-700">
                            💬 Оқушы пікірін көру
                          </summary>

                          <p className="mt-4 whitespace-pre-wrap leading-7 text-slate-600">
                            {review.review}
                          </p>

                        </details>
                      )}

                    </div>
                  );
                })}

              </div>
            )}

          </section>
        )}

        {/* NOTICE */}
        <section className="mt-10 rounded-3xl border border-blue-200 bg-blue-50 p-6">

          <p className="font-extrabold text-blue-700">
            ℹ️ Платформаның қазіргі сынақ нұсқасы
          </p>

          <p className="mt-2 leading-7 text-slate-600">
            Қазір мәліметтер осы құрылғының браузерінде сақталады.
            Платформаны мектеп көлемінде іске қосқанда оқушылардың
            деректері ортақ дерекқорда сақталып, мұғалім барлық
            оқушының нәтижесін осы панельден көре алады.
          </p>

        </section>

      </div>
    </main>
  );
}