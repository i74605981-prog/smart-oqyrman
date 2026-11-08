import Link from "next/link";

export default function MediaPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <section className="w-full px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-5xl">

          {/* Бөлім тақырыбы */}
          <div className="mb-8 text-center">
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
              SMART OQYRMAN
            </p>

            <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Медиа
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              SMART OQYRMAN жобасының жетістіктері мен жарқын сәттері
            </p>
          </div>

          {/* Үздік оқырмандар */}
          <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl bg-white shadow-xl">
            <img
              src="/media/ardak-aiyerkem.png"
              alt="SMART OQYRMAN жобасының үздік оқырмандары Ардақ пен Айеркем"
              className="block h-auto w-full object-cover"
            />

            <div className="px-5 py-6 text-center sm:px-8 sm:py-8">
              <p className="text-sm font-semibold text-emerald-600 sm:text-base">
                2025–2026 оқу жылы
              </p>

              <h2 className="mt-2 text-xl font-extrabold leading-snug text-slate-900 sm:text-2xl">
                SMART OQYRMAN жобасының үздік оқырмандары
              </h2>

              <p className="mt-3 text-2xl font-black text-slate-900 sm:text-3xl">
                Ардақ пен Айеркем
              </p>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
                2025–2026 оқу жылының қорытындысы бойынша оқу белсенділігі
                мен жоба тапсырмаларын орындауда жоғары нәтиже көрсетті.
              </p>
            </div>
          </div>

          {/* Бірінші сұхбат */}
          <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-3xl bg-white shadow-xl">
            <div className="px-5 pt-6 text-center sm:px-8 sm:pt-8">
              <p className="text-sm font-bold uppercase tracking-[0.15em] text-emerald-600">
                🎤 Сұхбат
              </p>

              <h2 className="mt-2 text-xl font-extrabold text-slate-900 sm:text-2xl">
                SMART OQYRMAN жобасы туралы сұхбат
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
                SMART OQYRMAN жобасының мақсаты, жүзеге асырылуы,
                оқушылардың кітап оқуға қызығушылығы және жоба нәтижелері
                туралы сұхбат.
              </p>
            </div>

            <div className="p-4 sm:p-6">
              <video
                controls
                playsInline
                preload="metadata"
                poster="/media/suhbat-cover.jpg"
                className="w-full rounded-2xl bg-black shadow-lg"
              >
                <source src="/videos/suhbat.mp4" type="video/mp4" />
                Сіздің браузеріңіз видеоны қолдамайды.
              </video>
            </div>
          </div>

          {/* І тоқсан қорытындысы */}
          <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-3xl bg-white shadow-xl">

            <div className="bg-gradient-to-r from-emerald-50 to-amber-50 px-5 py-7 text-center sm:px-8">
              <p className="text-sm font-bold uppercase tracking-[0.15em] text-emerald-600">
                📚 І тоқсан қорытындысы
              </p>

              <h2 className="mt-2 text-xl font-extrabold text-slate-900 sm:text-2xl">
                Сұхбат • Нәтиже • Марапаттау
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                SMART OQYRMAN жобасы аясында мектеп кітапханасында
                І тоқсан қорытындысына арналған кездесу өткізілді.
                Оқушылармен сұхбат жүргізіліп, оқылған кітаптар,
                орындалған тапсырмалар мен оқырман белсенділігі талқыланды.
              </p>

              <p className="mx-auto mt-3 max-w-2xl text-sm font-semibold leading-6 text-slate-700 sm:text-base">
                І тоқсан қорытындысы бойынша жоғары нәтиже көрсеткен
                оқушыларға сыныптар бойынша Сары Батақұлы атындағы
                Шалқар аудандық мәдениет үйіне және музейге баруға
                арналған жолдамалар табысталды.
              </p>
            </div>

            <div className="p-4 sm:p-6">
              <video
                controls
                playsInline
                preload="metadata"
                className="w-full rounded-2xl bg-black shadow-lg"
              >
                <source src="/videos/1-toksan.mp4" type="video/mp4" />
                Сіздің браузеріңіз видеоны қолдамайды.
              </video>
            </div>

            <div className="px-5 pb-7 text-center sm:px-8">
              <p className="text-sm font-semibold text-emerald-700 sm:text-base">
                🏆 Белсенді оқырман – жаңа мүмкіндікке қадам!
              </p>
            </div>
          </div>

          {/* Басты бетке қайту */}
          <div className="mt-10 text-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-slate-700 sm:text-base"
            >
              ← Басты бетке қайту
            </Link>
          </div>

        </div>
      </section>
    </main>
  );
}