"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../utils/supabase/client";

type Book = {
  id: number;
  title: string;
  author: string;
  academic_year: string;
};

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectingId, setSelectingId] = useState<number | null>(
    null
  );

  useEffect(() => {
    loadBooks();
  }, []);

  async function loadBooks() {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("books")
      .select("id, title, author, academic_year")
      .eq("active", true)
      .order("id", { ascending: true });

    if (error) {
      console.error(error);
      alert("Кітаптарды жүктеу кезінде қате шықты.");
      setLoading(false);
      return;
    }

    setBooks(data ?? []);
    setLoading(false);
  }

  async function selectBook(book: Book) {
    setSelectingId(book.id);

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSelectingId(null);

      alert(
        "Кітап таңдау үшін алдымен жеке кабинетке кіріңіз."
      );

      window.location.href = "/login";
      return;
    }

    // Бұл кітап бұрын таңдалған ба — тексереміз
    const { data: existingProgress, error: checkError } =
      await supabase
        .from("reading_progress")
        .select(
          "id, status, reading_score, started_at, finished_at"
        )
        .eq("student_id", user.id)
        .eq("book_id", book.id)
        .maybeSingle();

    if (checkError) {
      console.error(checkError);
      setSelectingId(null);

      alert(
        "Кітапты тексеру кезінде қате шықты."
      );

      return;
    }

    // Егер бұрын таңдалмаған болса — Supabase-қа жазамыз
    if (!existingProgress) {
      const { error: insertError } = await supabase
        .from("reading_progress")
        .insert({
          student_id: user.id,
          book_id: book.id,
          status: "reading",
          reading_score: 0,
          started_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error(insertError);
        setSelectingId(null);

        alert(
          "Кітапты сақтау кезінде қате шықты."
        );

        return;
      }
    }

    // Қазіргі басқа беттер де жұмыс істей беруі үшін
    // таңдалған кітапты localStorage-қа сақтаймыз
    const currentBook = {
      id: book.id,
      title: book.title,
      author: book.author,
      academic_year: book.academic_year,
    };

    localStorage.setItem(
      "smartOqyrmanCurrentBook",
      JSON.stringify(currentBook)
    );

    // Оқу тарихына қосамыз
    const savedHistory = localStorage.getItem(
      "smartOqyrmanBookHistory"
    );

    let history: Book[] = [];

    if (savedHistory) {
      try {
        history = JSON.parse(savedHistory);
      } catch {
        history = [];
      }
    }

    const alreadyInHistory = history.some(
      (item) => item.title === book.title
    );

    if (!alreadyInHistory) {
      history.push(currentBook);

      localStorage.setItem(
        "smartOqyrmanBookHistory",
        JSON.stringify(history)
      );
    }

    // Жеке кабинеттегі қазіргі оқу күйі жоғалмауы үшін
    const savedReadingResults = localStorage.getItem(
      "smartOqyrmanReadingResults"
    );

    let readingResults: Record<
      string,
      {
        status: string;
        score: number;
      }
    > = {};

    if (savedReadingResults) {
      try {
        readingResults = JSON.parse(savedReadingResults);
      } catch {
        readingResults = {};
      }
    }

    if (!readingResults[book.title]) {
      readingResults[book.title] = {
        status: "reading",
        score: 0,
      };

      localStorage.setItem(
        "smartOqyrmanReadingResults",
        JSON.stringify(readingResults)
      );
    }

    setSelectingId(null);

    window.location.href = "/profile";
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10">
      <div className="mx-auto max-w-6xl">

        <header className="text-center">
          <a
            href="/"
            className="text-3xl font-extrabold text-indigo-700"
          >
            SMART OQYRMAN
          </a>

          <h1 className="mt-5 text-4xl font-extrabold text-slate-900">
            📚 Кітаптар
          </h1>

          <p className="mt-3 text-slate-500">
            5–9 сынып оқушыларына арналған ортақ кітаптар
          </p>
        </header>

        {loading ? (
          <div className="mt-12 text-center text-lg font-bold text-slate-500">
            Кітаптар жүктелуде...
          </div>
        ) : (
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {books.map((book, index) => (
              <article
                key={book.id}
                className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-bold text-indigo-700">
                    {index + 1}-кітап
                  </span>

                  <span className="text-3xl">
                    📖
                  </span>
                </div>

                <h2 className="mt-5 text-xl font-extrabold text-slate-900">
                  {book.title}
                </h2>

                <p className="mt-2 text-slate-500">
                  {book.author}
                </p>

                <p className="mt-4 text-sm text-slate-400">
                  {book.academic_year} оқу жылы
                </p>

                <button
                  onClick={() => selectBook(book)}
                  disabled={selectingId === book.id}
                  className="mt-6 w-full rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {selectingId === book.id
                    ? "Сақталуда..."
                    : "Осы кітапты таңдау →"}
                </button>
              </article>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <a
            href="/profile"
            className="inline-block rounded-xl bg-white px-6 py-3 font-bold text-indigo-700 shadow-sm"
          >
            ← Жеке кабинетке оралу
          </a>
        </div>

      </div>
    </main>
  );
}