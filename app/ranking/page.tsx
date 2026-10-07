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

export default function RankingPage() {
  const [ranking, setRanking] = useState<RankingRow[]>([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

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

    const { data, error } = await supabase.rpc(
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

    const normalized: RankingRow[] = (data ?? []).map(
      (row: {
        student_id: string;
        display_name: string;
        grade: number | null;
        school: string;
        books_read: number | string | null;
        total_points: number | string | null;
        perfect_books: number | string | null;
      }) => ({
        student_id: row.student_id,
        display_name: row.display_name,
        grade: row.grade,
        school: row.school,
        books_read: Number(row.books_read ?? 0),
        total_points: Number(row.total_points ?? 0),
        perfect_books: Number(row.perfect_books ?? 0),
      })
    );

    setRanking(normalized);
    setLoading(false);
  }

  const currentStudent = useMemo(() => {
    return ranking.find(
      (student) =>
        student.student_id === currentUserId
    );
  }, [ranking, currentUserId]);

  const currentPosition = useMemo(() => {
    const index = ranking.findIndex(
      (student) =>
        student.student_id === currentUserId
    );

    return index >= 0 ? index + 1 : null;
  }, [ranking, currentUserId]);

  function getMedal(position: number) {
    if (position === 1) return "🥇";
    if (position === 2) return "🥈";
    if (position === 3) return "🥉";

    return `${position}`;
  }

  function getAchievements(student: RankingRow) {
    const achievements: string[] = [];

    if (student.books_read >= 1) {
      achievements.push("📖 Алғашқы кітап");
    }

    if (student.books_read >= 3) {
      achievements.push("📚 3 кітап");
    }

    if (student.books_read >= 5) {
      achievements.push("🌟 5 кітап");
    }

    if (student.perfect_books >= 1) {
      achievements.push("💯 100 ұпай");
    }

    if (student.total_points >= 300) {
      achievements.push("🏅 300 ұпай");
    }

    if (student.total_points >= 500) {
      achievements.push("🏆 500 ұпай");
    }

    return achievements;
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
              href="/profile"
              className="rounded-xl bg-indigo-50 px-5 py-3 text-center font-bold text-indigo-700"
            >
              ← Жеке кабинет
            </a>

          </div>
        </header>

        <section className="mt-6 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-500 p-8 text-white shadow-lg">

          <p className="text-sm font-bold uppercase tracking-widest text-amber-100">
            2026–2027 оқу жылы
          </p>

          <h1 className="mt-2 text-4xl font-extrabold">
            🏆 Оқырмандар рейтингі
          </h1>

          <p className="mt-3 max-w-2xl text-amber-50">
            Оқушылардың кітап оқу белсенділігі мен
            жинаған ұпайлары бойынша ортақ рейтинг.
          </p>

        </section>

        {currentStudent && (
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
                  {currentStudent.total_points}
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-sm text-indigo-100">
                  Оқылған кітап
                </p>

                <p className="mt-1 text-3xl font-extrabold">
                  {currentStudent.books_read}
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-sm text-indigo-100">
                  100 ұпайлық кітап
                </p>

                <p className="mt-1 text-3xl font-extrabold">
                  {currentStudent.perfect_books}
                </p>
              </div>

            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {getAchievements(currentStudent).map(
                (achievement) => (
                  <span
                    key={achievement}
                    className="rounded-full bg-white/15 px-4 py-2 text-sm font-bold"
                  >
                    {achievement}
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

        {!errorMessage && ranking.length === 0 && (
          <section className="mt-6 rounded-3xl bg-white p-10 text-center shadow-sm">

            <div className="text-5xl">
              📚
            </div>

            <h2 className="mt-4 text-2xl font-extrabold text-slate-900">
              Рейтинг әзірге бос
            </h2>

            <p className="mt-2 text-slate-500">
              Оқушылар тапсырмаларды орындаған сайын
              рейтинг осы жерде пайда болады.
            </p>

          </section>
        )}

        {ranking.length > 0 && (
          <section className="mt-6 overflow-hidden rounded-3xl bg-white shadow-sm">

            <div className="border-b border-slate-100 p-6">

              <h2 className="text-2xl font-extrabold text-slate-900">
                Жалпы рейтинг
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Барлығы: {ranking.length} оқушы
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
                    (student, index) => {
                      const isCurrent =
                        student.student_id ===
                        currentUserId;

                      return (
                        <tr
                          key={student.student_id}
                          className={`border-t border-slate-100 ${
                            isCurrent
                              ? "bg-indigo-50"
                              : "bg-white"
                          }`}
                        >

                          <td className="px-6 py-5 text-xl font-extrabold">
                            {getMedal(index + 1)}
                          </td>

                          <td className="px-6 py-5">

                            <p className="font-extrabold text-slate-900">
                              {student.display_name}

                              {isCurrent && (
                                <span className="ml-2 rounded-full bg-indigo-600 px-2 py-1 text-xs text-white">
                                  Сіз
                                </span>
                              )}
                            </p>

                            <p className="mt-1 text-sm text-slate-400">
                              {student.school}
                            </p>

                          </td>

                          <td className="px-6 py-5 font-semibold text-slate-700">
                            {student.grade
                              ? `${student.grade}-сынып`
                              : "—"}
                          </td>

                          <td className="px-6 py-5 font-bold text-slate-700">
                            {student.books_read}
                          </td>

                          <td className="px-6 py-5 font-bold text-amber-600">
                            {student.perfect_books}
                          </td>

                          <td className="px-6 py-5">

                            <span className="rounded-xl bg-indigo-50 px-4 py-2 text-lg font-extrabold text-indigo-700">
                              {student.total_points}
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

        <div className="mt-8 text-center">

          <a
            href="/profile"
            className="inline-block rounded-xl bg-indigo-600 px-7 py-4 font-extrabold text-white"
          >
            ← Жеке кабинетке қайту
          </a>

        </div>

      </div>
    </main>
  );
}