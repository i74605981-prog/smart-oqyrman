import { books2025, students2025 } from "./data";

export default function Results20252026Page() {
  const totalReadBooks = students2025.reduce(
    (sum, student) => sum + student.results.length,
    0
  );

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-6">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
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

            <a
              href="/"
              className="rounded-xl bg-slate-100 px-5 py-3 text-center font-semibold text-slate-700"
            >
              ← Басты бет
            </a>
          </div>
        </header>

        {/* TITLE */}
        <section className="mt-6 rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 p-8 text-white shadow-lg">
          <p className="text-sm font-bold uppercase tracking-widest text-indigo-200">
            Оқу нәтижелері
          </p>

          <h2 className="mt-3 text-4xl font-extrabold">
            2025–2026 оқу жылы
          </h2>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-indigo-100">
            SMART OQYRMAN платформасының 2025–2026 оқу жылындағы
            қатысушыларының кітап оқу нәтижелері, тест ұпайлары,
            шығармашылық жұмыстары, пікірлері және жетістіктері.
          </p>
        </section>

        {/* STATS */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Қатысушылар
            </p>

            <p className="mt-2 text-4xl font-extrabold text-indigo-600">
              {students2025.length}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Кітап қоры
            </p>

            <p className="mt-2 text-4xl font-extrabold text-emerald-600">
              {books2025.length}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Оқылған кітаптар
            </p>

            <p className="mt-2 text-4xl font-extrabold text-violet-600">
              {totalReadBooks}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Ең жоғары нәтиже
            </p>

            <p className="mt-2 text-4xl font-extrabold text-amber-500">
              100
            </p>
          </div>

        </section>

        {/* SCORE SYSTEM */}
        <section className="mt-8 rounded-3xl bg-white p-7 shadow-sm">
          <h2 className="text-2xl font-extrabold text-slate-800">
            🎯 Бағалау жүйесі
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-2xl bg-indigo-50 p-5">
              <p className="font-semibold text-slate-700">
                📖 Кітап оқу
              </p>

              <p className="mt-2 text-3xl font-extrabold text-indigo-600">
                20
              </p>
            </div>

            <div className="rounded-2xl bg-emerald-50 p-5">
              <p className="font-semibold text-slate-700">
                ✅ Тест
              </p>

              <p className="mt-2 text-3xl font-extrabold text-emerald-600">
                50
              </p>
            </div>

            <div className="rounded-2xl bg-amber-50 p-5">
              <p className="font-semibold text-slate-700">
                🎨 Шығармашылық тапсырма
              </p>

              <p className="mt-2 text-3xl font-extrabold text-amber-500">
                10
              </p>
            </div>

            <div className="rounded-2xl bg-violet-50 p-5">
              <p className="font-semibold text-slate-700">
                💬 Пікір
              </p>

              <p className="mt-2 text-3xl font-extrabold text-violet-600">
                20
              </p>
            </div>

          </div>

          <div className="mt-5 rounded-2xl bg-slate-900 p-5 text-center text-white">
            <span className="font-semibold">
              Жалпы нәтиже:
            </span>

            <span className="ml-3 text-3xl font-extrabold">
              100 ұпай
            </span>
          </div>
        </section>

        {/* BOOKS */}
        <section className="mt-10">
          <h2 className="text-3xl font-extrabold text-slate-800">
            📚 Оқу жылындағы кітаптар
          </h2>

          <p className="mt-2 text-slate-500">
            Оқушылар мектеп кітапханасындағы шығармаларды оқыды.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {books2025.map((book, index) => (
              <div
                key={book}
                className="rounded-2xl bg-white p-5 shadow-sm"
              >
                <span className="text-sm font-extrabold text-indigo-500">
                  № {index + 1}
                </span>

                <p className="mt-2 font-semibold leading-7 text-slate-700">
                  {book}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* STUDENTS */}
        <section className="mt-12">
          <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">
            Қатысушылар
          </p>

          <h2 className="mt-2 text-3xl font-extrabold text-slate-800">
            2025–2026 оқу жылының нәтижелері
          </h2>

          <p className="mt-3 text-slate-500">
            Оқушының аты-жөнін басып, оқыған кітаптары мен нәтижелерін көріңіз.
          </p>

          <div className="mt-7 space-y-5">

            {students2025.map((student, studentIndex) => (
              <details
                key={student.name}
                className="group rounded-3xl bg-white p-6 shadow-sm"
              >

                <summary className="cursor-pointer list-none">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <div className="flex items-center gap-4">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-extrabold text-indigo-700">
                        {studentIndex + 1}
                      </div>

                      <div>
                        <h3 className="text-xl font-extrabold text-slate-800">
                          {student.name}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {student.grade} · {student.results.length} кітап
                        </p>
                      </div>

                    </div>

                    <div className="flex flex-wrap items-center gap-3">

                      <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-700">
                        🏆 {student.award}
                      </span>

                      <span className="text-sm font-bold text-indigo-600">
                        Толық нәтиже ↓
                      </span>

                    </div>

                  </div>
                </summary>

                {/* BOOK RESULTS */}
                <div className="mt-6 space-y-5 border-t pt-6">

                  {student.results.map((result, index) => (
                    <div
                      key={`${student.name}-${result.book}-${index}`}
                      className="rounded-3xl border border-slate-200 p-5"
                    >

                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">

                        <div>
                          <p className="text-sm font-bold text-indigo-600">
                            {index + 1}-кітап
                          </p>

                          <h4 className="mt-1 text-xl font-extrabold text-slate-800">
                            {result.book}
                          </h4>
                        </div>

                        <div className="rounded-full bg-emerald-100 px-5 py-2 font-extrabold text-emerald-700">
                          {result.total} / 100
                        </div>

                      </div>

                      {/* POINTS */}
                      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

                        <div className="rounded-2xl bg-indigo-50 p-4">
                          <p className="text-sm text-slate-500">
                            📖 Кітап оқу
                          </p>

                          <p className="mt-1 text-xl font-extrabold text-indigo-600">
                            {result.readingPoints}/20
                          </p>
                        </div>

                        <div className="rounded-2xl bg-emerald-50 p-4">
                          <p className="text-sm text-slate-500">
                            ✅ Тест
                          </p>

                          <p className="mt-1 text-xl font-extrabold text-emerald-600">
                            {result.testPoints}/50
                          </p>
                        </div>

                        <div className="rounded-2xl bg-amber-50 p-4">
                          <p className="text-sm text-slate-500">
                            🎨 Тапсырма
                          </p>

                          <p className="mt-1 text-xl font-extrabold text-amber-600">
                            {result.creativePoints}/10
                          </p>
                        </div>

                        <div className="rounded-2xl bg-violet-50 p-4">
                          <p className="text-sm text-slate-500">
                            💬 Пікір
                          </p>

                          <p className="mt-1 text-xl font-extrabold text-violet-600">
                            {result.reviewPoints}/20
                          </p>
                        </div>

                      </div>

                      {/* CREATIVE */}
                      <div className="mt-5 rounded-2xl bg-amber-50 p-5">
                        <p className="font-bold text-amber-800">
                          🎨 Шығармашылық тапсырма
                        </p>

                        <p className="mt-2 leading-7 text-slate-700">
                          {result.creativeTask}
                        </p>
                      </div>

                      {/* REVIEW */}
                      <details className="mt-4 rounded-2xl bg-violet-50 p-5">
                        <summary className="cursor-pointer font-bold text-violet-700">
                          💬 Оқушы пікірін оқу
                        </summary>

                        <p className="mt-4 leading-8 text-slate-700">
                          {result.review}
                        </p>
                      </details>

                    </div>
                  ))}

                </div>
              </details>
            ))}

          </div>
        </section>

        {/* FINAL */}
        <section className="mt-12 rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 p-8 text-center text-white">

          <p className="text-sm font-bold uppercase tracking-widest text-indigo-200">
            SMART OQYRMAN
          </p>

          <h2 className="mt-3 text-3xl font-extrabold">
            Оқу жалғасады!
          </h2>

          <p className="mx-auto mt-3 max-w-2xl leading-7 text-indigo-100">
            2025–2026 оқу жылындағы тәжірибе 2026–2027 оқу жылында
            жаңа қатысушылармен жалғасуда.
          </p>

          <a
            href="/register"
            className="mt-6 inline-block rounded-xl bg-white px-6 py-3 font-bold text-indigo-700"
          >
            2026–2027 оқу жылына қатысу →
          </a>

        </section>

      </div>
    </main>
  );
}