"use client";

import { useEffect, useState } from "react";

type Book = {
  id: number;
  title: string;
  author: string;
};

export default function ReviewPage() {
  const [book, setBook] = useState<Book | null>(null);
  const [review, setReview] = useState("");
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const savedBook = localStorage.getItem(
      "smartOqyrmanCurrentBook"
    );

    if (savedBook) {
      const currentBook: Book = JSON.parse(savedBook);

      setBook(currentBook);

      const savedResults = localStorage.getItem(
        "smartOqyrmanReviewResults"
      );

      if (savedResults) {
        const results = JSON.parse(savedResults);

        if (results[currentBook.title]) {
          setReview(
            results[currentBook.title].review || ""
          );

          setCompleted(
            results[currentBook.title].completed || false
          );
        }
      }
    }
  }, []);

  function submitReview() {
    if (!book) {
      return;
    }

    if (review.trim().length < 20) {
      alert(
        "Пікіріңізді сәл толық жазыңыз. Кемінде 20 таңба болуы керек."
      );
      return;
    }

    const oldResults = localStorage.getItem(
      "smartOqyrmanReviewResults"
    );

    const results = oldResults
      ? JSON.parse(oldResults)
      : {};

    results[book.title] = {
      bookId: book.id,
      book: book.title,
      author: book.author,
      review: review,
      score: 20,
      maxScore: 20,
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

  if (completed) {
    return (
      <main className="min-h-screen bg-slate-50 px-5 py-8">

        <div className="mx-auto max-w-3xl">

          <header className="rounded-3xl bg-white p-6 shadow-sm">

            <h1 className="text-3xl font-extrabold text-indigo-700">
              SMART OQYRMAN
            </h1>

            <p className="mt-2 text-slate-500">
              Кітап туралы пікір
            </p>

          </header>

          <section className="mt-8 rounded-3xl bg-emerald-50 p-8 text-center">

            <div className="text-6xl">
              💬
            </div>

            <h2 className="mt-4 text-3xl font-extrabold text-emerald-700">
              Пікір қабылданды!
            </h2>

            <p className="mt-3 text-xl font-bold text-slate-800">
              «{book.title}»
            </p>

            <p className="mt-1 text-slate-500">
              {book.author}
            </p>

            <div className="mx-auto mt-6 max-w-xs rounded-2xl bg-white p-6 shadow-sm">

              <p className="text-sm font-bold text-slate-500">
                ПІКІР ҰПАЙЫ
              </p>

              <p className="mt-2 text-5xl font-extrabold text-emerald-600">
                20 / 20
              </p>

            </div>

            <div className="mt-6 rounded-2xl bg-white p-6 text-left">

              <p className="font-bold text-slate-700">
                Менің пікірім:
              </p>

              <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-600">
                {review}
              </p>

            </div>

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

      <div className="mx-auto max-w-4xl">

        {/* HEADER */}
        <header className="rounded-3xl bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h1 className="text-3xl font-extrabold text-indigo-700">
                SMART OQYRMAN
              </h1>

              <p className="mt-2 text-slate-500">
                Кітап туралы пікір
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
        <section className="mt-6 rounded-3xl bg-gradient-to-r from-violet-600 to-purple-600 p-7 text-white">

          <p className="text-sm font-bold uppercase tracking-widest text-violet-200">
            Таңдалған кітап
          </p>

          <h2 className="mt-2 text-3xl font-extrabold">
            «{book.title}»
          </h2>

          <p className="mt-2 text-violet-100">
            {book.author}
          </p>

          <div className="mt-5 rounded-2xl bg-white/10 p-4">

            <p className="font-bold">
              💬 Пікір жазу — 20 ұпай
            </p>

          </div>

        </section>

        {/* INFO */}
        <section className="mt-7 rounded-3xl bg-white p-7 shadow-sm">

          <h2 className="text-2xl font-extrabold text-slate-800">
            Пікіріңде не жазуға болады?
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">

            <div className="rounded-2xl bg-violet-50 p-5">
              <p className="font-bold text-violet-700">
                1. Кітап ұнады ма?
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Неліктен ұнағанын немесе ұнамағанын жаз.
              </p>
            </div>

            <div className="rounded-2xl bg-violet-50 p-5">
              <p className="font-bold text-violet-700">
                2. Қай кейіпкер есте қалды?
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Оның қандай қасиеті саған әсер етті?
              </p>
            </div>

            <div className="rounded-2xl bg-violet-50 p-5">
              <p className="font-bold text-violet-700">
                3. Қандай ой түйдің?
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Шығармадан алған негізгі ойыңды жаз.
              </p>
            </div>

            <div className="rounded-2xl bg-violet-50 p-5">
              <p className="font-bold text-violet-700">
                4. Ұсынар ма едің?
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Бұл кітапты басқа оқушыларға ұсынар ма едің?
              </p>
            </div>

          </div>

        </section>

        {/* REVIEW */}
        <section className="mt-6 rounded-3xl bg-white p-7 shadow-sm">

          <p className="text-sm font-bold uppercase tracking-widest text-violet-600">
            Менің пікірім
          </p>

          <h2 className="mt-2 text-2xl font-extrabold text-slate-800">
            Кітаптан алған әсеріңді жаз
          </h2>

          <textarea
            value={review}
            onChange={(event) =>
              setReview(event.target.value)
            }
            placeholder="Мысалы: Бұл кітап маған өте ұнады. Маған әсіресе..."
            className="mt-6 min-h-64 w-full resize-y rounded-2xl border border-slate-200 p-5 leading-7 text-slate-700 outline-none focus:border-violet-500"
          />

          <div className="mt-3 flex items-center justify-between">

            <p className="text-sm text-slate-400">
              Кемінде 20 таңба
            </p>

            <p
              className={`text-sm font-bold ${
                review.length >= 20
                  ? "text-emerald-600"
                  : "text-slate-400"
              }`}
            >
              {review.length} таңба
            </p>

          </div>

        </section>

        {/* SUBMIT */}
        <button
          type="button"
          onClick={submitReview}
          className="mt-6 w-full rounded-2xl bg-violet-600 px-7 py-5 text-lg font-extrabold text-white hover:bg-violet-700"
        >
          💬 Пікірді жіберу
        </button>

        <p className="mt-3 text-center text-sm text-slate-400">
          Пікір жазылса — 20 ұпай
        </p>

      </div>

    </main>
  );
}