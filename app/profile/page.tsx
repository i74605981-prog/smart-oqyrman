"use client";

import { useEffect, useMemo, useState } from "react";
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

type BookResult = {
  book: Book;
  status: string;
  readingScore: number;
  testScore: number;
  creativeScore: number;
  reviewScore: number;
  totalScore: number;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [reading, setReading] = useState<ReadingProgress[]>([]);
  const [tests, setTests] = useState<ScoreRow[]>([]);
  const [creative, setCreative] = useState<ScoreRow[]>([]);
  const [reviews, setReviews] = useState<ScoreRow[]>([]);
  const [loading, setLoading] = useState(true);
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
        .select("id, title, author, academic_year")
        .eq("active", true)
        .order("id", { ascending: true }),

      supabase
        .from("reading_progress")
        .select(
          "book_id, status, reading_score, started_at, finished_at, updated_at"
        )
        .eq("student_id", user.id)
        .order("updated_at", { ascending: false }),

      supabase
        .from("test_results")
        .select("book_id, score")
        .eq("student_id", user.id),

      supabase
        .from("creative_submissions")
        .select("book_id, score")
        .eq("student_id", user.id),

      supabase
        .from("reviews")
        .select("book_id, score")
        .eq("student_id", user.id),
    ]);

    if (profileResult.error) {
      console.error(profileResult.error);
      alert("Оқушы профилін жүктеу кезінде қате шықты.");
      setLoading(false);
      return;
    }

    setProfile(profileResult.data);
    setBooks(booksResult.data ?? []);
    setReading(readingResult.data ?? []);
    setTests(testResult.data ?? []);
    setCreative(creativeResult.data ?? []);
    setReviews(reviewResult.data ?? []);

    const savedBooks = booksResult.data ?? [];
    const savedReading = readingResult.data ?? [];

    if (savedReading.length > 0) {
      const currentProgress = savedReading[0];

      const currentBook = savedBooks.find(
        (book) => book.id === currentProgress.book_id
      );

      if (currentBook) {
        localStorage.setItem(
          "smartOqyrmanCurrentBook",
          JSON.stringify(currentBook)
        );
      }

      const history = savedReading
        .map((item) =>
          savedBooks.find(
            (book) => book.id === item.book_id
          )
        )
        .filter(Boolean);

      localStorage.setItem(
        "smartOqyrmanBookHistory",
        JSON.stringify(history)
      );

      const readingResults: Record<
        string,
        {
          status: string;
          score: number;
        }
      > = {};

      savedReading.forEach((item) => {
        const book = savedBooks.find(
          (itemBook) =>
            itemBook.id === item.book_id
        );

        if (book) {
          readingResults[book.title] = {
            status: item.status,
            score: item.reading_score,
          };
        }
      });

      localStorage.setItem(
        "smartOqyrmanReadingResults",
        JSON.stringify(readingResults)
      );
    }

    setLoading(false);
  }

  const results = useMemo<BookResult[]>(() => {
    return reading
      .map((readingItem) => {
        const book = books.find(
          (item) => item.id === readingItem.book_id
        );

        if (!book) {
          return null;
        }

        const testScore =
          tests.find(
            (item) =>
              item.book_id === readingItem.book_id
          )?.score ?? 0;

        const creativeScore =
          creative.find(
            (item) =>
              item.book_id === readingItem.book_id
          )?.score ?? 0;

        const reviewScore =
          reviews.find(
            (item) =>
              item.book_id === readingItem.book_id
          )?.score ?? 0;

        const totalScore =
          readingItem.reading_score +
          testScore +
          creativeScore +
          reviewScore;

        return {
          book,
          status: readingItem.status,
          readingScore: readingItem.reading_score,
          testScore,
          creativeScore,
          reviewScore,
          totalScore,
        };
      })
      .filter(
        (item): item is BookResult =>
          item !== null
      );
  }, [books, reading, tests, creative, reviews]);

  const totalPoints = results.reduce(
    (sum, item) => sum + item.totalScore,
    0
  );

  const booksRead = results.filter(
    (item) => item.status === "finished"
  ).length;

  const perfectBooks = results.filter(
    (item) => item.totalScore === 100
  ).length;

  const currentResult =
    results.length > 0 ? results[0] : null;

  async function finishReading(bookId: number) {
    setFinishingBook(bookId);

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setFinishingBook(null);
      window.location.href = "/login";
      return;
    }

    const now = new Date().toISOString();

    const { error } = await supabase
      .from("reading_progress")
      .update({
        status: "finished",
        reading_score: 20,
        finished_at: now,
        updated_at: now,
      })
      .eq("student_id", user.id)
      .eq("book_id", bookId);

    if (error) {
      console.error(error);
      setFinishingBook(null);

      alert(
        "Оқу нәтижесін сақтау кезінде қате шықты."
      );

      return;
    }

    setFinishingBook(null);

    await loadProfile();
  }

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
            onClick={logout}
            className="rounded-xl bg-slate-100 px-5 py-3 font-bold text-slate-700"
          >
            Шығу
          </button>

        </header>

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

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

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

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">
                  🎨 Шығармашылық
                </p>
                <p className="mt-1 text-xl font-extrabold">
                  {currentResult.creativeScore}/10
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">
                  💬 Пікір
                </p>
                <p className="mt-1 text-xl font-extrabold">
                  {currentResult.reviewScore}/20
                </p>
              </div>

            </div>

            {currentResult.status !== "finished" ? (
              <button
                onClick={() =>
                  finishReading(currentResult.book.id)
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
              {results.map((item) => (
                <article
                  key={item.book.id}
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
                        {item.status === "finished"
                          ? "✅ Оқылып болды"
                          : "📖 Оқылып жатыр"}
                      </p>
                    </div>

                  </div>

                </article>
              ))}
            </div>

          </section>
        )}

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