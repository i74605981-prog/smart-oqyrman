"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../utils/supabase/client";

type Book = {
  id: number;
  title: string;
  author: string;
};

export default function ReviewPage() {
  const [book, setBook] = useState<Book | null>(null);
  const [review, setReview] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCurrentBook();
  }, []);

  async function loadCurrentBook() {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    let currentBook: Book | null = null;

    const savedBook = localStorage.getItem(
      "smartOqyrmanCurrentBook"
    );

    if (savedBook) {
      try {
        currentBook = JSON.parse(savedBook);
      } catch {
        currentBook = null;
      }
    }

    if (!currentBook) {
      const { data: progress } = await supabase
        .from("reading_progress")
        .select("book_id, updated_at")
        .eq("student_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (progress) {
        const { data: selectedBook } = await supabase
          .from("books")
          .select("id, title, author")
          .eq("id", progress.book_id)
          .single();

        if (selectedBook) {
          currentBook = selectedBook;

          localStorage.setItem(
            "smartOqyrmanCurrentBook",
            JSON.stringify(selectedBook)
          );
        }
      }
    }

    if (currentBook) {
      setBook(currentBook);

      const { data: existing } = await supabase
        .from("reviews")
        .select("review, score, completed")
        .eq("student_id", user.id)
        .eq("book_id", currentBook.id)
        .maybeSingle();

      if (existing) {
        setReview(existing.review ?? "");
        setSaved(existing.completed === true);
      }
    }

    setLoading(false);
  }

  async function saveReview() {
    if (!book) {
      alert("Алдымен кітап таңдаңыз.");
      return;
    }

    const cleanReview = review.trim();

    if (cleanReview.length < 20) {
      alert(
        "Пікіріңіз кемінде 20 таңбадан тұруы керек."
      );
      return;
    }

    setSaving(true);

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSaving(false);
      window.location.href = "/login";
      return;
    }

    const now = new Date().toISOString();

    const { error } = await supabase
      .from("reviews")
      .upsert(
        {
          student_id: user.id,
          book_id: book.id,
          review: cleanReview,
          score: 20,
          completed: true,
          submitted_at: now,
          updated_at: now,
        },
        {
          onConflict: "student_id,book_id",
        }
      );

    if (error) {
      console.error(error);
      setSaving(false);

      alert(
        "Пікірді сақтау кезінде қате шықты."
      );

      return;
    }

    const oldResults = localStorage.getItem(
      "smartOqyrmanReviewResults"
    );

    let results: Record<
      string,
      {
        bookId: number;
        review: string;
        score: number;
        completed: boolean;
      }
    > = {};

    if (oldResults) {
      try {
        results = JSON.parse(oldResults);
      } catch {
        results = {};
      }
    }

    results[book.title] = {
      bookId: book.id,
      review: cleanReview,
      score: 20,
      completed: true,
    };

    localStorage.setItem(
      "smartOqyrmanReviewResults",
      JSON.stringify(results)
    );

    localStorage.setItem(
      "smartOqyrmanReviewResult",
      JSON.stringify(results[book.title])
    );

    setSaved(true);
    setSaving(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-5 py-20">
        <p className="text-center font-bold text-slate-500">
          Жүктелуде...
        </p>
      </main>
    );
  }

  if (!book) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
        <div className="max-w-md rounded-3xl bg-white p-8 text-center shadow-lg">

          <div className="text-5xl">
            📚
          </div>

          <h1 className="mt-4 text-3xl font-extrabold text-indigo-700">
            SMART OQYRMAN
          </h1>

          <p className="mt-4 text-slate-500">
            Пікір жазу үшін алдымен кітап таңдаңыз.
          </p>

          <a
            href="/books"
            className="mt-6 inline-block rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white"
          >
            Кітап таңдау →
          </a>

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8">
      <div className="mx-auto max-w-3xl">

        <header className="rounded-3xl bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h1 className="text-3xl font-extrabold text-indigo-700">
                SMART OQYRMAN
              </h1>

              <p className="mt-1 text-slate-500">
                💬 Оқушы пікірі
              </p>
            </div>

            <a
              href="/profile"
              className="rounded-xl bg-slate-100 px-5 py-3 text-center font-bold text-slate-700"
            >
              ← Жеке кабинет
            </a>

          </div>

        </header>

        <section className="mt-6 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-500 p-7 text-white">

          <p className="text-sm font-bold text-amber-100">
            ТАҢДАЛҒАН КІТАП
          </p>

          <h2 className="mt-2 text-3xl font-extrabold">
            «{book.title}»
          </h2>

          <p className="mt-2 text-amber-100">
            {book.author}
          </p>

          <p className="mt-5 rounded-2xl bg-white/10 p-4 font-bold">
            Кітап туралы пікір — 20 ұпай
          </p>

        </section>

        <section className="mt-6 rounded-3xl bg-white p-7 shadow-sm">

          <h2 className="text-xl font-extrabold text-slate-900">
            Кітап туралы өз пікіріңізді жазыңыз
          </h2>

          <p className="mt-2 text-slate-500">
            Сізге не ұнады? Қандай ой түйдіңіз?
            Қай кейіпкер немесе оқиға ерекше әсер етті?
          </p>

          <textarea
            value={review}
            onChange={(event) => {
              setReview(event.target.value);
              setSaved(false);
            }}
            rows={10}
            placeholder="Кітап туралы пікіріңізді осы жерге жазыңыз..."
            className="mt-5 w-full rounded-2xl border border-slate-200 p-4 outline-none focus:border-amber-500"
          />

          <div className="mt-2 flex items-center justify-between text-sm">

            <span
              className={
                review.trim().length >= 20
                  ? "font-bold text-emerald-600"
                  : "text-slate-400"
              }
            >
              Кемінде 20 таңба
            </span>

            <span className="text-slate-400">
              {review.trim().length} таңба
            </span>

          </div>

        </section>

        {saved ? (
          <section className="mt-6 rounded-3xl bg-emerald-50 p-7 text-center">

            <div className="text-5xl">
              ✅
            </div>

            <h2 className="mt-3 text-2xl font-extrabold text-emerald-700">
              Пікір сақталды
            </h2>

            <p className="mt-2 text-lg font-bold text-emerald-700">
              20 / 20 ұпай
            </p>

            <p className="mt-2 text-slate-500">
              Нәтиже Supabase дерекқорына сақталды.
            </p>

            <a
              href="/profile"
              className="mt-6 inline-block rounded-xl bg-indigo-600 px-7 py-3 font-bold text-white"
            >
              Жеке кабинетке қайту →
            </a>

          </section>
        ) : (
          <button
            type="button"
            onClick={saveReview}
            disabled={saving}
            className="mt-6 w-full rounded-xl bg-amber-500 px-6 py-4 text-lg font-extrabold text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? "Сақталуда..."
              : "✅ Пікірді сақтау"}
          </button>
        )}

      </div>
    </main>
  );
}