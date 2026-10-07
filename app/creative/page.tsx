"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { createClient } from "../../utils/supabase/client";

type Book = {
  id: number;
  title: string;
  author: string;
};

const taskOptions = [
  "Кейіпкерге мінездеме",
  "Маған әсер еткен тұсы",
  "5 негізгі сөз",
  "Кейіпкерге хат",
];

export default function CreativePage() {
  const [book, setBook] = useState<Book | null>(null);
  const [taskType, setTaskType] = useState("");
  const [answer, setAnswer] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
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
        .from("creative_submissions")
        .select(
          "task_type, answer, file_path, score, completed"
        )
        .eq("student_id", user.id)
        .eq("book_id", currentBook.id)
        .maybeSingle();

      if (existing) {
        setTaskType(existing.task_type ?? "");
        setAnswer(existing.answer ?? "");
        setFileName(existing.file_path ?? "");
        setSaved(existing.completed === true);
      }
    }

    setLoading(false);
  }

  function handleFile(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      setFileName("");
      setFileType("");
      return;
    }

    setFileName(file.name);
    setFileType(file.type);
  }

  async function saveCreative() {
    if (!book) {
      alert("Алдымен кітап таңдаңыз.");
      return;
    }

    if (!taskType) {
      alert("Шығармашылық тапсырма түрін таңдаңыз.");
      return;
    }

    if (!answer.trim()) {
      alert("Жауабыңызды жазыңыз.");
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
      .from("creative_submissions")
      .upsert(
        {
          student_id: user.id,
          book_id: book.id,
          task_type: taskType,
          answer: answer.trim(),
          file_path: fileName || null,
          score: 10,
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
        "Шығармашылық тапсырманы сақтау кезінде қате шықты."
      );

      return;
    }

    const oldResults = localStorage.getItem(
      "smartOqyrmanCreativeResults"
    );

    let results: Record<
      string,
      {
        bookId: number;
        taskType: string;
        answer: string;
        fileName: string;
        fileType: string;
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
      taskType,
      answer: answer.trim(),
      fileName,
      fileType,
      score: 10,
      completed: true,
    };

    localStorage.setItem(
      "smartOqyrmanCreativeResults",
      JSON.stringify(results)
    );

    localStorage.setItem(
      "smartOqyrmanCreativeResult",
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
            Шығармашылық тапсырма орындау үшін
            алдымен кітап таңдаңыз.
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
                🎨 Шығармашылық тапсырма
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

        <section className="mt-6 rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-600 p-7 text-white">

          <p className="text-sm font-bold text-violet-100">
            ТАҢДАЛҒАН КІТАП
          </p>

          <h2 className="mt-2 text-3xl font-extrabold">
            «{book.title}»
          </h2>

          <p className="mt-2 text-violet-100">
            {book.author}
          </p>

          <p className="mt-5 rounded-2xl bg-white/10 p-4 font-bold">
            Шығармашылық жұмыс — 10 ұпай
          </p>

        </section>

        <section className="mt-6 rounded-3xl bg-white p-7 shadow-sm">

          <h2 className="text-xl font-extrabold text-slate-900">
            1. Тапсырма түрін таңдаңыз
          </h2>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">

            {taskOptions.map((task) => (
              <button
                key={task}
                type="button"
                onClick={() => {
                  setTaskType(task);
                  setSaved(false);
                }}
                className={`rounded-2xl border p-4 text-left font-bold transition ${
                  taskType === task
                    ? "border-violet-600 bg-violet-50 text-violet-700"
                    : "border-slate-200 bg-white text-slate-700"
                }`}
              >
                {task}
              </button>
            ))}

          </div>

        </section>

        <section className="mt-6 rounded-3xl bg-white p-7 shadow-sm">

          <h2 className="text-xl font-extrabold text-slate-900">
            2. Жауабыңызды жазыңыз
          </h2>

          <textarea
            value={answer}
            onChange={(event) => {
              setAnswer(event.target.value);
              setSaved(false);
            }}
            rows={8}
            placeholder="Ойыңызды осы жерге жазыңыз..."
            className="mt-5 w-full rounded-2xl border border-slate-200 p-4 outline-none focus:border-violet-500"
          />

          <p className="mt-2 text-right text-sm text-slate-400">
            {answer.length} таңба
          </p>

        </section>

        <section className="mt-6 rounded-3xl bg-white p-7 shadow-sm">

          <h2 className="text-xl font-extrabold text-slate-900">
            3. Қосымша файл
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Қаласаңыз фото, аудио немесе видео таңдауға болады.
          </p>

          <input
            type="file"
            accept="image/*,audio/*,video/*"
            onChange={handleFile}
            className="mt-5 block w-full rounded-xl border border-slate-200 p-3"
          />

          {fileName && (
            <div className="mt-4 rounded-xl bg-slate-50 p-4">

              <p className="font-bold text-slate-700">
                📎 {fileName}
              </p>

              {fileType && (
                <p className="mt-1 text-sm text-slate-400">
                  {fileType}
                </p>
              )}

            </div>
          )}

          <p className="mt-3 text-xs text-slate-400">
            Ескерту: әзірге базаға файлдың атауы ғана
            сақталады. Нақты файл жүктеуді кейін қосамыз.
          </p>

        </section>

        {saved ? (
          <section className="mt-6 rounded-3xl bg-emerald-50 p-7 text-center">

            <div className="text-5xl">
              ✅
            </div>

            <h2 className="mt-3 text-2xl font-extrabold text-emerald-700">
              Тапсырма сақталды
            </h2>

            <p className="mt-2 text-lg font-bold text-emerald-700">
              10 / 10 ұпай
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
            onClick={saveCreative}
            disabled={saving}
            className="mt-6 w-full rounded-xl bg-violet-600 px-6 py-4 text-lg font-extrabold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? "Сақталуда..."
              : "✅ Шығармашылық тапсырманы сақтау"}
          </button>
        )}

      </div>
    </main>
  );
}