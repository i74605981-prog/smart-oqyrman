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

          {/* Ардақ пен Айеркем */}
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