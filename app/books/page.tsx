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

const books2026: Book[] = [
  { id: 1, author: "Әкім Тарази", title: "Ауыл шетіндегі үй" },
  { id: 2, author: "Роза Мұқанова", title: "Мәңгілік бала бейнесі" },
  { id: 3, author: "Мұхтар Әуезов", title: "Көксерек" },
  { id: 4, author: "Дулат Исабеков", title: "Гауһартас" },
  { id: 5, author: "Тәкен Әлімқұлов", title: "Тұлпардың тағдыры" },
  { id: 6, author: "Бердібек Соқпақбаев", title: "Менің атым Қожа" },
  { id: 7, author: "Мұхтар Мағауин", title: "Бір атаның балалары" },
  { id: 8, author: "Бауыржан Момышұлы", title: "Ұшқан ұя" },
  { id: 9, author: "Сайын Мұратбеков", title: "Жусан иісі" },
  { id: 10, author: "Жүсіпбек Аймауытов", title: "Қартқожа" },
  { id: 11, author: "Қалмақан Әбдіқадыров", title: "Қажымұқан" },
];

export default function BooksPage() {
  const [student, setStudent] = useState<Student | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  useEffect(() => {
    const savedStudent = localStorage.getItem("smartOqyrmanStudent");
    const savedBook = localStorage.getItem("smartOqyrmanCurrentBook");

    if (savedStudent) {
      setStudent(JSON.parse(savedStudent));
    }

    if (savedBook) {
      setSelectedBook(JSON.parse(savedBook));
    }
  }, []);

  function selectBook(book: Book) {
    // Қазіргі кітап
    localStorage.setItem(
      "smartOqyrmanCurrentBook",
      JSON.stringify(book)
    );

    // ОҚУ ТАРИХЫ
    const savedHistory = localStorage.getItem(
      "smartOqyrmanBookHistory"
    );

    const history: Book[] = savedHistory
      ? JSON.parse(savedHistory)
      : [];

    const alreadyExists = history.some(
      (item) => item.title === book.title
    );

    if (!alreadyExists) {
      history.push(book);

      localStorage.setItem(
        "smartOqyrmanBookHistory",
        JSON.stringify(history)
      );
    }

    // ӘР КІТАПТЫҢ ОҚУ КҮЙІ ЖЕКЕ САҚТАЛАДЫ
    const savedReadingResults = localStorage.getItem(
      "smartOqyrmanReadingResults"
    );

    const readingResults = savedReadingResults
      ? JSON.parse(savedReadingResults)
      : {};

    if (!readingResults[book.title]) {
      readingResults[book.title] = {
        bookId: book.id,
        book: book.title,
        author: book.author,
        status: "not-started",
        score: 0,
        completed: false,
      };

      localStorage.setItem(
        "smartOqyrmanReadingResults",
        JSON.stringify(readingResults)
      );
    }

    setSelectedBook(book);

    alert(`«${book.title}» кітабы таңдалды!`);

    window.location.href = "/profile";
  }

  if (!student) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="max-w-md rounded-3xl bg-white p-8 text-center shadow-lg">
          <h1 className="text-3xl font-extrabold text-indigo-700">
            SMART OQYRMAN
          </h1>

          <p className="mt-4 text-slate-500">
            Кітап таңдау үшін алдымен платформаға тіркеліңіз.
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

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8">
      <div className="mx-auto max-w-7xl">

        <header className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>
              <h1 className="text-3xl font-extrabold text-indigo-700">
                SMART OQYRMAN
              </h1>

              <p className="mt-2 text-slate-500">
                Кітап оқы. Ойлан. Талда. Дамы.
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

        <section className="mt-6 rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 p-8 text-white">

          <p className="text-sm font-bold uppercase tracking-widest text-indigo-200">
            2026–2027 оқу жылы
          </p>

          <h2 className="mt-3 text-4xl font-extrabold">
            Кітап таңда
          </h2>

          <p className="mt-3 max-w-3xl text-lg leading-8 text-indigo-100">
            {student.name}, төмендегі 11 кітаптың бірін таңдап,
            мектеп кітапханасынан алып оқуды баста.
          </p>

        </section>

        {selectedBook && (
          <section className="mt-6 rounded-3xl border-2 border-emerald-200 bg-emerald-50 p-6">

            <p className="text-sm font-bold text-emerald-700">
              📖 Қазіргі таңдалған кітап
            </p>

            <h3 className="mt-2 text-2xl font-extrabold text-slate-800">
              «{selectedBook.title}»
            </h3>

            <p className="mt-1 text-slate-600">
              {selectedBook.author}
            </p>

          </section>
        )}

        <section className="mt-10">

          <h2 className="text-3xl font-extrabold text-slate-800">
            2026–2027 оқу жылындағы кітаптар
          </h2>

          <p className="mt-3 text-slate-500">
            5–9 сынып оқушылары ортақ кітаптар тізімінен таңдай алады.
          </p>

          <div className="mt-7 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {books2026.map((book) => {
              const isSelected =
                selectedBook?.title === book.title;

              return (
                <div
                  key={book.id}
                  className="rounded-3xl bg-white p-7 shadow-sm"
                >

                  <div className="flex items-center justify-between">

                    <div className="text-4xl">
                      📚
                    </div>

                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-bold text-indigo-600">
                      № {book.id}
                    </span>

                  </div>

                  <h3 className="mt-5 text-2xl font-extrabold text-slate-800">
                    «{book.title}»
                  </h3>

                  <p className="mt-2 font-semibold text-slate-600">
                    {book.author}
                  </p>

                  <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                    <p className="font-semibold text-slate-600">
                      🏫 Мектеп кітапханасынан алынады
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => selectBook(book)}
                    className={`mt-6 w-full rounded-xl px-6 py-3 font-bold text-white ${
                      isSelected
                        ? "bg-emerald-600"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                  >
                    {isSelected
                      ? "✓ Қазіргі кітап"
                      : "Осы кітапты таңдау →"}
                  </button>

                </div>
              );
            })}

          </div>

        </section>

      </div>
    </main>
  );
}