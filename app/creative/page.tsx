"use client";

import { ChangeEvent, useEffect, useState } from "react";

type Book = {
  id: number;
  title: string;
  author: string;
};

type CreativeTask = {
  id: number;
  title: string;
  description: string;
  icon: string;
};

const creativeTasks: CreativeTask[] = [
  {
    id: 1,
    title: "Кейіпкерге мінездеме",
    description:
      "Шығармадағы бір кейіпкерді таңдап, оның мінезін, іс-әрекетін және өз пікіріңді жаз.",
    icon: "👤",
  },
  {
    id: 2,
    title: "Маған әсер еткен тұсы",
    description:
      "Кітаптағы саған ерекше әсер еткен оқиғаны немесе бөлімді жазып, себебін түсіндір.",
    icon: "💭",
  },
  {
    id: 3,
    title: "5 негізгі сөз",
    description:
      "Шығарманың мазмұнын ашатын 5 негізгі сөзді жаз және неге таңдағаныңды қысқаша түсіндір.",
    icon: "🔑",
  },
  {
    id: 4,
    title: "Кейіпкерге хат",
    description:
      "Шығармадағы өзің таңдаған кейіпкерге арнап қысқаша хат жаз.",
    icon: "✉️",
  },
];

export default function CreativePage() {
  const [book, setBook] = useState<Book | null>(null);

  const [selectedTask, setSelectedTask] =
    useState<CreativeTask | null>(null);

  const [answer, setAnswer] = useState("");

  const [fileName, setFileName] = useState("");

  const [fileType, setFileType] = useState("");

  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const savedBook = localStorage.getItem(
      "smartOqyrmanCurrentBook"
    );

    if (savedBook) {
      const currentBook: Book = JSON.parse(savedBook);

      setBook(currentBook);

      const savedCreativeResults = localStorage.getItem(
        "smartOqyrmanCreativeResults"
      );

      if (savedCreativeResults) {
        const results = JSON.parse(savedCreativeResults);

        const currentResult = results[currentBook.title];

        if (currentResult?.completed) {
          setCompleted(true);
          setAnswer(currentResult.answer || "");
          setFileName(currentResult.fileName || "");
          setFileType(currentResult.fileType || "");

          const oldTask = creativeTasks.find(
            (task) => task.id === currentResult.taskId
          );

          if (oldTask) {
            setSelectedTask(oldTask);
          }
        }
      }
    }
  }, []);

  function handleFile(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setFileName(file.name);
    setFileType(file.type);
  }

  function submitTask() {
    if (!book) {
      return;
    }

    if (!selectedTask) {
      alert("Алдымен шығармашылық тапсырманың бір түрін таңдаңыз.");
      return;
    }

    if (answer.trim().length < 5 && !fileName) {
      alert(
        "Жауабыңызды жазыңыз немесе фото, аудио, видео файл таңдаңыз."
      );
      return;
    }

    const oldResults = localStorage.getItem(
      "smartOqyrmanCreativeResults"
    );

    const results = oldResults
      ? JSON.parse(oldResults)
      : {};

    results[book.title] = {
      bookId: book.id,
      book: book.title,
      author: book.author,
      taskId: selectedTask.id,
      taskTitle: selectedTask.title,
      answer: answer,
      fileName: fileName,
      fileType: fileType,
      score: 10,
      maxScore: 10,
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

    setCompleted(true);
  }

  if (!book) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="max-w-md rounded-3xl bg-white p-8 text-center shadow-lg">
          <h1 className="text-3xl font-extrabold text-indigo-700">
            SMART OQYRMAN
          </h1>

          <p className="mt-4 text-slate-500">
            Алдымен кітап таңдаңыз.
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

  if (completed) {
    return (
      <main className="min-h-screen bg-slate-50 px-5 py-8">
        <div className="mx-auto max-w-3xl">

          <header className="rounded-3xl bg-white p-6 shadow-sm">
            <h1 className="text-3xl font-extrabold text-indigo-700">
              SMART OQYRMAN
            </h1>

            <p className="mt-2 text-slate-500">
              Шығармашылық тапсырма
            </p>
          </header>

          <section className="mt-8 rounded-3xl bg-emerald-50 p-8 text-center">

            <div className="text-6xl">
              🎉
            </div>

            <h2 className="mt-4 text-3xl font-extrabold text-emerald-700">
              Тапсырма орындалды!
            </h2>

            <p className="mt-3 text-xl font-bold text-slate-800">
              «{book.title}»
            </p>

            {selectedTask && (
              <p className="mt-2 text-slate-600">
                {selectedTask.title}
              </p>
            )}

            <div className="mx-auto mt-6 max-w-xs rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm font-bold text-slate-500">
                ШЫҒАРМАШЫЛЫҚ ҰПАЙ
              </p>

              <p className="mt-2 text-5xl font-extrabold text-emerald-600">
                10 / 10
              </p>
            </div>

            {answer && (
              <div className="mt-6 rounded-2xl bg-white p-5 text-left">
                <p className="font-bold text-slate-700">
                  Жауабың:
                </p>

                <p className="mt-2 whitespace-pre-wrap text-slate-600">
                  {answer}
                </p>
              </div>
            )}

            {fileName && (
              <div className="mt-4 rounded-2xl bg-white p-5 text-left">
                <p className="font-bold text-slate-700">
                  📎 Таңдалған файл
                </p>

                <p className="mt-2 text-slate-600">
                  {fileName}
                </p>
              </div>
            )}

            <a
              href="/profile"
              className="mt-7 inline-block rounded-xl bg-indigo-600 px-7 py-4 font-bold text-white"
            >
              Жеке кабинетке қайту →
            </a>

          </section>

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8">
      <div className="mx-auto max-w-5xl">

        {/* HEADER */}
        <header className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h1 className="text-3xl font-extrabold text-indigo-700">
                SMART OQYRMAN
              </h1>

              <p className="mt-2 text-slate-500">
                Шығармашылық тапсырма
              </p>
            </div>

            <a
              href="/profile"
              className="rounded-xl bg-slate-100 px-5 py-3 text-center font-semibold text-slate-700"
            >
              ← Жеке кабинет
            </a>

          </div>
        </header>

        {/* BOOK */}
        <section className="mt-6 rounded-3xl bg-gradient-to-r from-amber-500 to-orange-500 p-7 text-white">

          <p className="text-sm font-bold uppercase tracking-widest text-amber-100">
            Таңдалған кітап
          </p>

          <h2 className="mt-2 text-3xl font-extrabold">
            «{book.title}»
          </h2>

          <p className="mt-2 text-amber-50">
            {book.author}
          </p>

          <div className="mt-5 rounded-2xl bg-white/15 p-4">
            <p className="font-bold">
              🎨 Шығармашылық тапсырма — 10 ұпай
            </p>
          </div>

        </section>

        {/* TASK SELECTION */}
        <section className="mt-8">

          <h2 className="text-2xl font-extrabold text-slate-800">
            1. Тапсырманың бірін таңда
          </h2>

          <p className="mt-2 text-slate-500">
            Төрт шығармашылық тапсырманың біреуін орындау жеткілікті.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">

            {creativeTasks.map((task) => {
              const selected =
                selectedTask?.id === task.id;

              return (
                <button
                  type="button"
                  key={task.id}
                  onClick={() =>
                    setSelectedTask(task)
                  }
                  className={`rounded-3xl border-2 p-6 text-left transition ${
                    selected
                      ? "border-amber-500 bg-amber-50"
                      : "border-transparent bg-white shadow-sm"
                  }`}
                >
                  <div className="text-4xl">
                    {task.icon}
                  </div>

                  <h3 className="mt-3 text-xl font-extrabold text-slate-800">
                    {task.title}
                  </h3>

                  <p className="mt-2 leading-6 text-slate-500">
                    {task.description}
                  </p>

                  {selected && (
                    <p className="mt-4 font-bold text-amber-600">
                      ✓ Таңдалды
                    </p>
                  )}
                </button>
              );
            })}

          </div>
        </section>

        {/* ANSWER */}
        {selectedTask && (
          <section className="mt-8 rounded-3xl bg-white p-7 shadow-sm">

            <p className="text-sm font-bold uppercase tracking-widest text-amber-600">
              2. Жауабыңды жаз
            </p>

            <h2 className="mt-2 text-2xl font-extrabold text-slate-800">
              {selectedTask.icon}{" "}
              {selectedTask.title}
            </h2>

            <p className="mt-3 text-slate-500">
              {selectedTask.description}
            </p>

            <textarea
              value={answer}
              onChange={(event) =>
                setAnswer(event.target.value)
              }
              placeholder="Жауабыңды осы жерге жаз..."
              className="mt-6 min-h-52 w-full resize-y rounded-2xl border border-slate-200 p-5 text-slate-700 outline-none focus:border-amber-500"
            />

            <p className="mt-2 text-right text-sm text-slate-400">
              {answer.length} таңба
            </p>

          </section>
        )}

        {/* FILE */}
        {selectedTask && (
          <section className="mt-6 rounded-3xl bg-white p-7 shadow-sm">

            <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">
              Қосымша
            </p>

            <h2 className="mt-2 text-2xl font-extrabold text-slate-800">
              📎 Фото, аудио немесе видео қосу
            </h2>

            <p className="mt-2 text-slate-500">
              Қаласаң, шығармашылық жұмысыңды файл түрінде де таңдай аласың.
            </p>

            <label className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-indigo-200 bg-indigo-50 p-8 text-center">

              <span className="text-5xl">
                📤
              </span>

              <span className="mt-3 font-bold text-indigo-700">
                Фото / аудио / видео таңдау
              </span>

              <span className="mt-1 text-sm text-slate-500">
                Файлды компьютерден немесе телефоннан таңда
              </span>

              <input
                type="file"
                accept="image/*,audio/*,video/*"
                onChange={handleFile}
                className="hidden"
              />

            </label>

            {fileName && (
              <div className="mt-4 rounded-2xl bg-emerald-50 p-4">

                <p className="font-bold text-emerald-700">
                  ✓ Файл таңдалды
                </p>

                <p className="mt-1 break-all text-sm text-slate-600">
                  {fileName}
                </p>

              </div>
            )}

          </section>
        )}

        {/* SUBMIT */}
        {selectedTask && (
          <section className="mt-6">

            <button
              type="button"
              onClick={submitTask}
              className="w-full rounded-2xl bg-amber-500 px-7 py-5 text-lg font-extrabold text-white hover:bg-amber-600"
            >
              ✅ Тапсырманы жіберу
            </button>

            <p className="mt-3 text-center text-sm text-slate-400">
              Тапсырма орындалса — 10 ұпай
            </p>

          </section>
        )}

      </div>
    </main>
  );
}