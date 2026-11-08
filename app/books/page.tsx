"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../utils/supabase/client";

type Book = {
  id: number;
  title: string;
  author: string;
  academic_year: string;
};

type AudioInfo = {
  src: string;
  label: string;
};

function getAudioForBook(title: string): AudioInfo | null {
  const normalized = title.toLowerCase().trim();

  if (normalized.includes("менің атым қожа")) {
    return {
      src: "/audio/menin-atym-kozha.mp3",
      label: "«Менің атым Қожа» шығармасынан аудио үзінді",
    };
  }

  if (normalized.includes("тұлпардың соңғы тұяғы")) {
    return {
      src: "/audio/tulpardyn-songy-tuyagy.mp3",
      label: "«Тұлпардың соңғы тұяғы» шығармасынан аудио үзінді",
    };
  }

  if (normalized.includes("өгей бала")) {
    return {
      src: "/audio/ogey-bala.mp3",
      label: "«Өгей бала» шығармасынан аудио үзінді",
    };
  }

  if (normalized.includes("бір уыс жусан")) {
    return {
      src: "/audio/bir-uys-zhusan.mp3",
      label: "«Бір уыс жусан» шығармасынан аудио үзінді",
    };
  }

  if (
    normalized.includes("әкең де бала болған") ||
    normalized.includes("әкеңде бала болған")
  ) {
    return {
      src: "/audio/aken-de-bala-bolgan.mp3",
      label: "«Әкең де бала болған» шығармасынан аудио үзінді",
    };
  }

  // ҚИЛЫ ЗАМАН
  if (normalized.includes("қилы заман")) {
    return {
      src: "/audio/qily-zaman.mp3",
      label: "Мұхтар Әуезовтің «Қилы заман» шығармасынан аудио үзінді",
    };
  }

  // ҚАҺАРЛЫ КҮНДЕР
  if (
    normalized.includes("қаһарлы күндер") ||
    normalized.includes("кахарлы күндер")
  ) {
    return {
      src: "/audio/qaharly-kunder.mp3",
      label: "Тахауи Ахтановтың «Қаһарлы күндер» шығармасынан аудио үзінді",
    };
  }

  return null;
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectingId, setSelectingId] = useState<number | null>(null);

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

      alert("Кітап таңдау үшін алдымен жеке кабинетке кіріңіз.");

      window.location.href = "/login";
      return;
    }

    const { data: existingProgress, error: checkError } = await supabase
      .from("reading_progress")
      .select("id, status, reading_score, started_at, finished_at")
      .eq("student_id", user.id)
      .eq("book_id", book.id)
      .maybeSingle();

    if (checkError) {
      console.error(checkError);
      setSelectingId(null);
      alert("Кітапты тексеру кезінде қате шықты.");
      return;
    }

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
        alert("Кітапты сақтау кезінде қате шықты.");
        return;
      }
    }

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

    const savedHistory = localStorage.getItem("smartOqyrmanBookHistory");

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
    <main className="min-h-screen bg-gradient-to-b from-violet-50 via-white to-blue-50 px-5 py-10">
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

          <p className="mx-auto mt-3 max-w-2xl text-slate-500">
            Кітапты таңда, мектеп кітапханасынан ал,
            қызықты аудио үзіндіні тыңда да,
            шығарманың жалғасын кітаптан оқы.
          </p>
        </header>

        {loading ? (
          <div className="mt-12 text-center text-lg font-bold text-slate-500">
            Кітаптар жүктелуде...
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {books.map((book, index) => {
              const audio = getAudioForBook(book.title);

              return (
                <article
                  key={book.id}
                  className="overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
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

                  <p className="mt-2 font-medium text-slate-500">
                    {book.author}
                  </p>

                  <p className="mt-4 text-sm text-slate-400">
                    {book.academic_year} оқу жылы
                  </p>

                  {/* МЕКТЕП КІТАПХАНАСЫ */}
                  <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">

                    <p className="font-extrabold text-emerald-800">
                      🏫 Кітапты мектеп кітапханасынан алыңыз
                    </p>

                    <p className="mt-1 text-sm leading-6 text-emerald-700">
                      SMART OQYRMAN кітапты алмастырмайды —
                      оқушыны кітапханаға және кітап оқуға бағыттайды.
                    </p>

                  </div>

                  {/* АУДИО */}
                  {audio && (
                    <div className="mt-4 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 p-4">

                      <div className="flex items-start gap-3">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-100 text-2xl">
                          🎧
                        </div>

                        <div>
                          <p className="font-extrabold text-slate-900">
                            Аудио үзінді
                          </p>

                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            {audio.label}
                          </p>
                        </div>

                      </div>

                      <audio
                        controls
                        preload="metadata"
                        className="mt-4 w-full"
                      >
                        <source
                          src={audio.src}
                          type="audio/mpeg"
                        />

                        Сіздің браузер аудионы қолдамайды.
                      </audio>

                      <div className="mt-3 rounded-xl bg-white/80 px-3 py-2 text-center text-xs font-bold text-amber-700">
                        ✨ Тыңда да, жалғасын кітаптан оқы!
                      </div>

                    </div>
                  )}

                  <button
                    onClick={() => selectBook(book)}
                    disabled={selectingId === book.id}
                    className="mt-6 w-full rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {selectingId === book.id
                      ? "Сақталуда..."
                      : "Осы кітапты таңдау →"}
                  </button>

                </article>
              );
            })}

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