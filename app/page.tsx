export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">

      {/* HEADER */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <h1 className="text-3xl font-extrabold text-indigo-700">
              SMART OQYRMAN
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Кітап оқы. Ойлан. Талда. Дамы.
            </p>
          </div>

          <nav className="flex flex-wrap gap-2">

            <a
              href="/"
              className="rounded-xl bg-slate-100 px-4 py-2 font-semibold text-slate-700"
            >
              Басты бет
            </a>

            <a
              href="/books"
              className="rounded-xl px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100"
            >
              📚 Кітаптар
            </a>

            <a
              href="/2025-2026"
              className="rounded-xl px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100"
            >
              2025–2026
            </a>

            <a
              href="/ranking"
              className="rounded-xl px-4 py-2 font-semibold text-amber-600 hover:bg-amber-50"
            >
              🏆 Рейтинг
            </a>

            <a
              href="/profile"
              className="rounded-xl px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100"
            >
              👤 Жеке кабинет
            </a>

            <a
              href="/admin"
              className="rounded-xl px-4 py-2 font-semibold text-violet-600 hover:bg-violet-50"
            >
              👩‍🏫 Мұғалім
            </a>

            <a
              href="/login"
              className="rounded-xl border border-indigo-600 px-5 py-2 font-bold text-indigo-600 hover:bg-indigo-50"
            >
              Кіру
            </a>

            <a
              href="/register"
              className="rounded-xl bg-indigo-600 px-5 py-2 font-bold text-white"
            >
              Тіркелу
            </a>

          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">

          <div>
            <span className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-bold text-indigo-700">
              5–9 сынып оқушыларына арналған
            </span>

            <h2 className="mt-6 text-5xl font-extrabold leading-tight text-slate-900">
              Кітап оқу —
              <span className="text-indigo-600">
                {" "}жаңа деңгейге қадам!
              </span>
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              SMART OQYRMAN — мектеп кітапханасындағы көркем
              шығармаларды оқуға қызығушылықты арттыруға арналған
              цифрлық оқу платформасы.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">

              <a
                href="/register"
                className="rounded-xl bg-indigo-600 px-7 py-4 font-bold text-white"
              >
                Жаңа оқушыны тіркеу →
              </a>

              <a
                href="/login"
                className="rounded-xl border border-indigo-600 bg-white px-7 py-4 font-bold text-indigo-700"
              >
                👤 Жеке кабинетке кіру
              </a>

              <a
                href="/books"
                className="rounded-xl bg-white px-7 py-4 font-bold text-slate-700 shadow-sm"
              >
                📚 Кітаптарды көру
              </a>

            </div>
          </div>

          {/* SMART OQYRMAN ЖОЛЫ */}
          <div className="rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-violet-700 p-8 text-white shadow-xl">

            <p className="text-sm font-bold uppercase tracking-widest text-indigo-200">
              SMART OQYRMAN жолы
            </p>

            <div className="mt-7 space-y-4">

              <div className="rounded-2xl bg-white/10 p-5">
                <span className="text-3xl">📖</span>
                <h3 className="mt-2 text-xl font-bold">
                  1. Кітапты таңда
                </h3>
              </div>

              <div className="rounded-2xl bg-white/10 p-5">
                <span className="text-3xl">📚</span>
                <h3 className="mt-2 text-xl font-bold">
                  2. Кітапты оқы
                </h3>
              </div>

              <div className="rounded-2xl bg-white/10 p-5">
                <span className="text-3xl">✅</span>
                <h3 className="mt-2 text-xl font-bold">
                  3. Тест тапсыр
                </h3>
              </div>

              <div className="rounded-2xl bg-white/10 p-5">
                <span className="text-3xl">🎨</span>
                <h3 className="mt-2 text-xl font-bold">
                  4. Шығармашылық жұмыс орында
                </h3>
              </div>

              <div className="rounded-2xl bg-white/10 p-5">
                <span className="text-3xl">💬</span>
                <h3 className="mt-2 text-xl font-bold">
                  5. Пікір жазып, ұпай жина
                </h3>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* YEARS */}
      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-7xl">

          <p className="text-center text-sm font-bold uppercase tracking-widest text-indigo-600">
            Оқу жылдары
          </p>

          <h2 className="mt-3 text-center text-4xl font-extrabold text-slate-900">
            SMART OQYRMAN жолы
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-2">

            {/* 2025–2026 */}
            <div className="rounded-3xl border border-slate-200 p-8">

              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600">
                2025–2026 оқу жылы
              </span>

              <h3 className="mt-5 text-3xl font-extrabold text-slate-800">
                Алғашқы оқу нәтижелері
              </h3>

              <div className="mt-6 grid grid-cols-2 gap-4">

                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-3xl font-extrabold text-indigo-600">
                    11
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Қатысушы
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-3xl font-extrabold text-indigo-600">
                    11
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Кітап
                  </p>
                </div>

              </div>

              <a
                href="/2025-2026"
                className="mt-7 inline-block rounded-xl bg-slate-900 px-6 py-3 font-bold text-white"
              >
                Нәтижелерді көру →
              </a>

            </div>

            {/* 2026–2027 */}
            <div className="rounded-3xl bg-indigo-50 p-8">

              <span className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-bold text-white">
                2026–2027 оқу жылы
              </span>

              <h3 className="mt-5 text-3xl font-extrabold text-slate-800">
                Қазіргі оқу жылы
              </h3>

              <p className="mt-4 leading-7 text-slate-600">
                Оқушы өзі тіркеледі, кітап таңдайды, тест тапсырады,
                шығармашылық жұмыс орындайды, пікір жазады және
                жинаған ұпайын жеке кабинетінен бақылайды.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">

                <a
                  href="/register"
                  className="rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white"
                >
                  Тіркелу →
                </a>

                <a
                  href="/login"
                  className="rounded-xl bg-white px-6 py-3 font-bold text-indigo-700"
                >
                  Кіру →
                </a>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SCORE */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">

          <p className="text-center text-sm font-bold uppercase tracking-widest text-indigo-600">
            Бағалау жүйесі
          </p>

          <h2 className="mt-3 text-center text-4xl font-extrabold text-slate-900">
            Бір кітап — 100 ұпай
          </h2>

          <div className="mt-10 grid gap-5 md:grid-cols-4">

            <div className="rounded-3xl bg-white p-7 text-center shadow-sm">
              <div className="text-5xl">📖</div>
              <h3 className="mt-4 text-xl font-bold">
                Кітап оқу
              </h3>
              <p className="mt-3 text-4xl font-extrabold text-indigo-600">
                20
              </p>
            </div>

            <div className="rounded-3xl bg-white p-7 text-center shadow-sm">
              <div className="text-5xl">✅</div>
              <h3 className="mt-4 text-xl font-bold">
                Тест
              </h3>
              <p className="mt-3 text-4xl font-extrabold text-emerald-600">
                50
              </p>
            </div>

            <div className="rounded-3xl bg-white p-7 text-center shadow-sm">
              <div className="text-5xl">🎨</div>
              <h3 className="mt-4 text-xl font-bold">
                Шығармашылық
              </h3>
              <p className="mt-3 text-4xl font-extrabold text-amber-500">
                10
              </p>
            </div>

            <div className="rounded-3xl bg-white p-7 text-center shadow-sm">
              <div className="text-5xl">💬</div>
              <h3 className="mt-4 text-xl font-bold">
                Пікір
              </h3>
              <p className="mt-3 text-4xl font-extrabold text-violet-600">
                20
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-slate-900 px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">

          <h2 className="text-center text-4xl font-extrabold">
            Оқушының цифрлық оқу кеңістігі
          </h2>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-3xl bg-white/10 p-6">
              <div className="text-4xl">👤</div>
              <h3 className="mt-4 text-xl font-bold">
                Жеке кабинет
              </h3>
              <p className="mt-2 text-slate-300">
                Әр оқушының жеке оқу нәтижесі сақталады.
              </p>
            </div>

            <div className="rounded-3xl bg-white/10 p-6">
              <div className="text-4xl">📚</div>
              <h3 className="mt-4 text-xl font-bold">
                Оқу тарихы
              </h3>
              <p className="mt-2 text-slate-300">
                Әр кітаптың нәтижесі жеке сақталады.
              </p>
            </div>

            <div className="rounded-3xl bg-white/10 p-6">
              <div className="text-4xl">🏆</div>
              <h3 className="mt-4 text-xl font-bold">
                Рейтинг
              </h3>
              <p className="mt-2 text-slate-300">
                Жиналған ұпай бойынша рейтинг қалыптасады.
              </p>
            </div>

            <div className="rounded-3xl bg-white/10 p-6">
              <div className="text-4xl">⭐</div>
              <h3 className="mt-4 text-xl font-bold">
                Жетістіктер
              </h3>
              <p className="mt-2 text-slate-300">
                Белсенділікке қарай жаңа марапаттар ашылады.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* TEACHER */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl rounded-[2.5rem] bg-white p-10 shadow-sm">

          <div className="text-center">

            <div className="text-6xl">
              👩‍🏫
            </div>

            <p className="mt-4 text-sm font-bold uppercase tracking-widest text-violet-600">
              Мұғалім бөлімі
            </p>

            <h2 className="mt-2 text-4xl font-extrabold text-slate-900">
              Оқу нәтижелерін бақылау
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
              Мұғалім оқушылардың оқу белсенділігін, тест нәтижесін,
              шығармашылық жұмысын, пікірін және жинаған ұпайын
              бақылау панелінен көре алады.
            </p>

            <a
              href="/admin"
              className="mt-7 inline-block rounded-xl bg-violet-600 px-7 py-4 font-bold text-white"
            >
              👩‍🏫 Мұғалім панеліне өту →
            </a>

          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-5xl rounded-[2.5rem] bg-gradient-to-r from-indigo-600 to-violet-600 p-10 text-center text-white">

          <div className="text-6xl">
            📚
          </div>

          <h2 className="mt-4 text-4xl font-extrabold">
            Оқуды бүгін баста!
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-indigo-100">
            Кітап таңда, оқы, тапсырмаларды орында, ұпай жина және
            SMART OQYRMAN рейтингінде өз орныңды көтер.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">

            <a
              href="/register"
              className="rounded-xl bg-white px-7 py-4 font-bold text-indigo-700"
            >
              Тіркелу →
            </a>

            <a
              href="/login"
              className="rounded-xl bg-indigo-500 px-7 py-4 font-bold text-white"
            >
              Кіру →
            </a>

            <a
              href="/ranking"
              className="rounded-xl bg-amber-400 px-7 py-4 font-bold text-slate-900"
            >
              🏆 Рейтинг
            </a>

          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t bg-white px-6 py-8 text-center">

        <h2 className="text-xl font-extrabold text-indigo-700">
          SMART OQYRMAN
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          2025–2026 оқу жылынан бері
        </p>

        <p className="mt-1 text-sm text-slate-400">
          Кітап оқы. Ойлан. Талда. Дамы.
        </p>

      </footer>

    </main>
  );
}