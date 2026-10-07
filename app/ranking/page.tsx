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

export default function RankingPage() {
  const [student, setStudent] = useState<Student | null>(null);
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [myResult, setMyResult] = useState<RankingEntry | null>(null);

  useEffect(() => {
    const savedStudent = localStorage.getItem(
      "smartOqyrmanStudent"
    );

    if (!savedStudent) {
      return;
    }

    const currentStudent: Student =
      JSON.parse(savedStudent);

    setStudent(currentStudent);

    const history: Book[] = JSON.parse(
      localStorage.getItem(
        "smartOqyrmanBookHistory"
      ) || "[]"
    );

    const readingResults = JSON.parse(
      localStorage.getItem(
        "smartOqyrmanReadingResults"
      ) || "{}"
    );

    const testResults = JSON.parse(
      localStorage.getItem(
        "smartOqyrmanTestResults"
      ) || "{}"
    );

    const creativeResults = JSON.parse(
      localStorage.getItem(
        "smartOqyrmanCreativeResults"
      ) || "{}"
    );

    const reviewResults = JSON.parse(
      localStorage.getItem(
        "smartOqyrmanReviewResults"
      ) || "{}"
    );

    function getBookTotal(book: Book) {
      const reading =
        readingResults[book.title]?.status ===
        "finished"
          ? 20
          : 0;

      const test =
        testResults[book.title]?.score || 0;

      const creative =
        creativeResults[book.title]?.score || 0;

      const review =
        reviewResults[book.title]?.score || 0;

      return (
        reading +
        test +
        creative +
        review
      );
    }

    const booksRead = history.filter(
      (book) =>
        readingResults[book.title]?.status ===
        "finished"
    ).length;

    const totalPoints = history.reduce(
      (sum, book) =>
        sum + getBookTotal(book),
      0
    );

    const perfectBooks = history.filter(
      (book) =>
        getBookTotal(book) === 100
    ).length;

    const currentEntry: RankingEntry = {
      id:
        currentStudent.login ||
        `${currentStudent.name}-${currentStudent.grade}`,
      name: currentStudent.name,
      grade: currentStudent.grade,
      school: currentStudent.school,
      totalPoints,
      booksRead,
      perfectBooks,
    };

    setMyResult(currentEntry);

    const oldRanking: RankingEntry[] =
      JSON.parse(
        localStorage.getItem(
          "smartOqyrmanRanking"
        ) || "[]"
      );

    const withoutCurrent =
      oldRanking.filter(
        (item) =>
          item.id !== currentEntry.id
      );

    const updatedRanking = [
      ...withoutCurrent,
      currentEntry,
    ].sort(
      (a, b) =>
        b.totalPoints - a.totalPoints
    );

    localStorage.setItem(
      "smartOqyrmanRanking",
      JSON.stringify(updatedRanking)
    );

    setRanking(updatedRanking);
  }, []);

  if (!student || !myResult) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="rounded-3xl bg-white p-8 text-center shadow-lg">

          <h1 className="text-3xl font-extrabold text-indigo-700">
            SMART OQYRMAN
          </h1>

          <p className="mt-4 text-slate-500">
            Рейтингті көру үшін алдымен тіркеліңіз.
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

  const myPlace =
    ranking.findIndex(
      (item) => item.id === myResult.id
    ) + 1;

  const achievements = [
    {
      icon: "📖",
      title: "Алғашқы қадам",
      description:
        "Алғашқы кітапты оқып аяқта",
      unlocked:
        myResult.booksRead >= 1,
    },
    {
      icon: "⭐",
      title: "Белсенді оқырман",
      description:
        "3 кітап оқып аяқта",
      unlocked:
        myResult.booksRead >= 3,
    },
    {
      icon: "📚",
      title: "Кітапқұмар",
      description:
        "5 кітап оқып аяқта",
      unlocked:
        myResult.booksRead >= 5,
    },
    {
      icon: "🏆",
      title: "Үздік нәтиже",
      description:
        "Бір кітаптан 100 ұпай жина",
      unlocked:
        myResult.perfectBooks >= 1,
    },
    {
      icon: "💯",
      title: "Ұпай жинаушы",
      description:
        "Жалпы 300 ұпай жина",
      unlocked:
        myResult.totalPoints >= 300,
    },
    {
      icon: "👑",
      title: "SMART OQYRMAN шебері",
      description:
        "Жалпы 500 ұпай жина",
      unlocked:
        myResult.totalPoints >= 500,
    },
  ];

  const unlockedCount =
    achievements.filter(
      (item) => item.unlocked
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
                Рейтинг және жетістіктер
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
                href="/profile"
                className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white"
              >
                Жеке кабинет
              </a>

            </div>

          </div>

        </header>

        {/* MY RESULT */}
        <section className="mt-6 rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 p-8 text-white">

          <p className="text-sm font-bold uppercase tracking-widest text-indigo-200">
            Менің нәтижем
          </p>

          <h2 className="mt-2 text-3xl font-extrabold">
            {myResult.name}
          </h2>

          <p className="mt-2 text-indigo-100">
            {myResult.grade} · {myResult.school}
          </p>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-2xl bg-white/10 p-5">
              <p className="text-sm text-indigo-100">
                Рейтингтегі орын
              </p>

              <p className="mt-2 text-4xl font-extrabold">
                № {myPlace}
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-5">
              <p className="text-sm text-indigo-100">
                Жалпы ұпай
              </p>

              <p className="mt-2 text-4xl font-extrabold">
                {myResult.totalPoints}
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-5">
              <p className="text-sm text-indigo-100">
                Оқылған кітап
              </p>

              <p className="mt-2 text-4xl font-extrabold">
                {myResult.booksRead}
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-5">
              <p className="text-sm text-indigo-100">
                Жетістік
              </p>

              <p className="mt-2 text-4xl font-extrabold">
                {unlockedCount}
              </p>
            </div>

          </div>

        </section>

        {/* RANKING */}
        <section className="mt-10">

          <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">
            2026–2027 оқу жылы
          </p>

          <h2 className="mt-2 text-3xl font-extrabold text-slate-800">
            🏆 Оқушылар рейтингі
          </h2>

          <p className="mt-2 text-slate-500">
            Рейтинг жалпы жиналған ұпай бойынша құрылады.
          </p>

          <div className="mt-6 overflow-hidden rounded-3xl bg-white shadow-sm">

            <div className="hidden grid-cols-12 gap-3 bg-slate-100 px-6 py-4 text-sm font-bold text-slate-500 md:grid">

              <div className="col-span-1">
                Орын
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
                Ұпай
              </div>

            </div>

            {ranking.map(
              (item, index) => {
                const isMe =
                  item.id === myResult.id;

                return (
                  <div
                    key={item.id}
                    className={`border-t border-slate-100 p-6 ${
                      isMe
                        ? "bg-indigo-50"
                        : "bg-white"
                    }`}
                  >

                    <div className="grid gap-4 md:grid-cols-12 md:items-center">

                      <div className="md:col-span-1">

                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-full text-lg font-extrabold ${
                            index === 0
                              ? "bg-amber-100 text-amber-700"
                              : index === 1
                              ? "bg-slate-200 text-slate-700"
                              : index === 2
                              ? "bg-orange-100 text-orange-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {index === 0
                            ? "🥇"
                            : index === 1
                            ? "🥈"
                            : index === 2
                            ? "🥉"
                            : index + 1}
                        </div>

                      </div>

                      <div className="md:col-span-5">

                        <p className="text-lg font-extrabold text-slate-800">
                          {item.name}

                          {isMe && (
                            <span className="ml-2 rounded-full bg-indigo-100 px-2 py-1 text-xs font-bold text-indigo-700">
                              Мен
                            </span>
                          )}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {item.grade} · {item.school}
                        </p>

                      </div>

                      <div className="md:col-span-2 md:text-center">

                        <p className="text-xs text-slate-400 md:hidden">
                          Оқылған кітап
                        </p>

                        <p className="font-extrabold text-slate-700">
                          {item.booksRead}
                        </p>

                      </div>

                      <div className="md:col-span-2 md:text-center">

                        <p className="text-xs text-slate-400 md:hidden">
                          100 ұпайлық нәтиже
                        </p>

                        <p className="font-extrabold text-amber-600">
                          {item.perfectBooks}
                        </p>

                      </div>

                      <div className="md:col-span-2 md:text-center">

                        <p className="text-xs text-slate-400 md:hidden">
                          Жалпы ұпай
                        </p>

                        <p className="text-2xl font-extrabold text-emerald-600">
                          {item.totalPoints}
                        </p>

                      </div>

                    </div>

                  </div>
                );
              }
            )}

          </div>

          {ranking.length === 1 && (
            <div className="mt-4 rounded-2xl bg-amber-50 p-5">

              <p className="font-bold text-amber-700">
                ℹ️ Қазір рейтингте 1 оқушы
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Басқа оқушылар тіркелген сайын олардың нәтижелерін де
                осы рейтингке қосуға болады. Нақты онлайн нұсқада бұл
                ақпарат ортақ дерекқордан алынады.
              </p>

            </div>
          )}

        </section>

        {/* ACHIEVEMENTS */}
        <section className="mt-12">

          <p className="text-sm font-bold uppercase tracking-widest text-violet-600">
            Марапаттар
          </p>

          <h2 className="mt-2 text-3xl font-extrabold text-slate-800">
            ⭐ Менің жетістіктерім
          </h2>

          <p className="mt-2 text-slate-500">
            Кітап оқып, ұпай жинаған сайын жаңа жетістіктер ашылады.
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            {achievements.map(
              (achievement) => (
                <div
                  key={achievement.title}
                  className={`rounded-3xl border-2 p-6 ${
                    achievement.unlocked
                      ? "border-amber-200 bg-white shadow-sm"
                      : "border-slate-100 bg-slate-100 opacity-60"
                  }`}
                >

                  <div className="text-5xl">
                    {achievement.unlocked
                      ? achievement.icon
                      : "🔒"}
                  </div>

                  <h3 className="mt-4 text-xl font-extrabold text-slate-800">
                    {achievement.title}
                  </h3>

                  <p className="mt-2 leading-6 text-slate-500">
                    {achievement.description}
                  </p>

                  <p
                    className={`mt-4 font-bold ${
                      achievement.unlocked
                        ? "text-emerald-600"
                        : "text-slate-400"
                    }`}
                  >
                    {achievement.unlocked
                      ? "✓ Жетістік ашылды"
                      : "Әлі ашылған жоқ"}
                  </p>

                </div>
              )
            )}

          </div>

        </section>

      </div>

    </main>
  );
}