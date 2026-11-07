import Link from "next/link";

const journey = [
  {
    icon: "📚",
    title: "Кітап таңдау",
    text: "Оқушы өзіне қызықты көркем шығарманы таңдайды.",
  },
  {
    icon: "📖",
    title: "Оқу",
    text: "Кітапты жүйелі оқып, мазмұнын түсінеді.",
  },
  {
    icon: "📝",
    title: "Тест",
    text: "Оқыған шығармасы бойынша білімін тексереді.",
  },
  {
    icon: "🎨",
    title: "Шығармашылық",
    text: "Хат, эссе немесе шығармашылық тапсырма орындайды.",
  },
  {
    icon: "💬",
    title: "Пікір",
    text: "Кітап туралы жеке ойын және қорытындысын жазады.",
  },
  {
    icon: "⭐",
    title: "Нәтиже",
    text: "Жинаған ұпайы мен оқу белсенділігін бақылайды.",
  },
  {
    icon: "🏆",
    title: "Марапат",
    text: "Үздік нәтиже мәдени-танымдық марапатқа жеткізеді.",
  },
];

const rewards = [
  {
    icon: "🏛️",
    title: "Музейге жолдама",
    text: "Үздік оқырмандарға танымдық және мәдени саяхат.",
  },
  {
    icon: "🎬",
    title: "Киноға жолдама",
    text: "Аудандық мәдениет үйіндегі кино көрсетіліміне қатысу.",
  },
  {
    icon: "🎭",
    title: "Концертке жолдама",
    text: "Мәдени-көркем іс-шараға қатысу мүмкіндігі.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#FCFAF5] text-slate-900">

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-violet-100/70 bg-[#FCFAF5]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">

          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 text-xl shadow-lg">
              📖
            </div>

            <div>
              <p className="text-lg font-black tracking-tight text-[#25104E]">
                SMART OQYRMAN
              </p>

              <p className="text-[9px] font-bold tracking-[0.2em] text-violet-400">
                ЦИФРЛЫҚ ОҚУ ПЛАТФОРМАСЫ
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-bold text-slate-600 xl:flex">

            <Link href="/" className="text-violet-700">
              Басты бет
            </Link>

            <Link href="/books" className="transition hover:text-violet-700">
              Кітаптар
            </Link>

            <Link href="/ranking" className="transition hover:text-violet-700">
              Рейтинг
            </Link>

            <Link
              href="/2025-2026"
              className="transition hover:text-violet-700"
            >
              2025–2026 нәтижелері
            </Link>

            <Link href="/media" className="transition hover:text-violet-700">
              Медиа
            </Link>

            <a href="#research" className="transition hover:text-violet-700">
              Жоба туралы
            </a>

          </nav>

          <div className="flex items-center gap-2">

            <Link
              href="/login"
              className="hidden rounded-xl border border-violet-200 bg-white px-4 py-2.5 text-sm font-black text-violet-700 sm:block"
            >
              Кіру
            </Link>

            <Link
              href="/register"
              className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-700 px-4 py-2.5 text-sm font-black text-white shadow-lg"
            >
              Тіркелу
            </Link>

          </div>

        </div>
      </header>

      {/* HERO */}
      <section className="relative px-5 pb-20 pt-8">

        <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-violet-200/40 blur-3xl" />
        <div className="absolute -right-28 top-32 h-96 w-96 rounded-full bg-amber-200/40 blur-3xl" />

        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[3rem] bg-gradient-to-br from-[#EEE7FF] via-[#FFF9FD] to-[#FFF0C8] shadow-[0_40px_100px_rgba(77,37,150,0.18)]">

          <div className="grid min-h-[650px] items-center gap-12 px-7 py-14 lg:grid-cols-2 lg:px-16">

            {/* LEFT */}
            <div className="relative z-10">

              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-black tracking-[0.15em] text-violet-700 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                КІТАП · ОЙ · НӘТИЖЕ
              </div>

              <h1 className="mt-7 text-5xl font-black leading-[0.9] tracking-[-0.05em] text-[#26104F] sm:text-6xl lg:text-[82px]">
                SMART

                <span className="block bg-gradient-to-r from-violet-700 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent">
                  OQYRMAN
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-xl font-bold leading-8 text-[#3D2468]">
                Цифрлық орта арқылы оқушылардың көркем әдебиет оқуға
                қызығушылығын арттыру
              </p>

              <p className="mt-4 max-w-xl leading-7 text-slate-600">
                Оқушының кітап таңдауынан бастап, оқу нәтижесі мен
                марапатына дейінгі әрекетін бір цифрлық ортада
                ұйымдастыратын интерактивті платформа.
              </p>

              <div className="mt-5 inline-flex rounded-xl border border-violet-200 bg-white/80 px-4 py-3 text-sm font-bold text-violet-700 shadow-sm">
                2025–2026 оқу жылында іске қосылған жоба
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                <Link
                  href="/books"
                  className="rounded-2xl bg-gradient-to-r from-violet-700 to-indigo-700 px-7 py-4 text-center font-black text-white shadow-xl"
                >
                  📚 Кітаптарды көру →
                </Link>

                <a
                  href="#journey"
                  className="rounded-2xl border border-violet-200 bg-white/80 px-7 py-4 text-center font-black text-violet-700"
                >
                  Қалай жұмыс істейді?
                </a>

              </div>
            </div>

            {/* HERO PHOTO */}
            <div className="relative mx-auto w-full max-w-[560px]">

              <div className="absolute -inset-6 rounded-[3rem] bg-violet-300/30 blur-2xl" />

              <div className="relative overflow-hidden rounded-[2.7rem] border-[6px] border-white bg-white shadow-2xl">

                <img
                  src="/media/hero-reader.jpg"
                  alt="SMART OQYRMAN оқырмандары"
                  className="h-[520px] w-full object-cover object-top"
                />

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#281052]/80 via-[#281052]/20 to-transparent px-6 pb-6 pt-20 text-white">

                  <p className="text-xs font-black tracking-[0.18em] text-violet-200">
                    SMART OQYRMAN
                  </p>

                  <p className="mt-1 text-xl font-black">
                    Кітап оқуға қызығушылықтан — нақты нәтижеге
                  </p>

                </div>
              </div>

              <div className="absolute -right-3 top-7 rounded-2xl bg-amber-300 px-5 py-4 shadow-2xl">

                <p className="text-[10px] font-black tracking-[0.12em] text-amber-900/60">
                  ОҚЫЛҒАН КІТАП
                </p>

                <p className="mt-1 text-3xl font-black text-amber-950">
                  50
                </p>

              </div>

              <div className="absolute -right-3 bottom-7 rounded-2xl bg-[#281052] px-5 py-4 text-white shadow-2xl">

                <p className="text-[10px] font-black tracking-[0.12em] text-violet-200">
                  БАҒАЛАУ
                </p>

                <p className="mt-1 text-2xl font-black">
                  100 ұпай
                </p>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* MAIN IDEAS */}
      <section className="px-5">

        <div className="mx-auto grid max-w-6xl gap-4 rounded-[2.4rem] border border-violet-100 bg-white p-4 shadow-xl sm:grid-cols-2 lg:grid-cols-4">

          {[
            ["📖", "Оқу", "Көркем әдебиетті жүйелі оқу"],
            ["🧠", "Талдау", "Оқығанын түсіну және саралау"],
            ["💬", "Пікір", "Өз ойын дәлелдеп жеткізу"],
            ["📈", "Даму", "Жеке нәтижені бақылау"],
          ].map(([icon, title, text]) => (
            <div
              key={title}
              className="rounded-[1.8rem] bg-gradient-to-br from-[#FAF7FF] to-white p-6"
            >

              <div className="text-4xl">
                {icon}
              </div>

              <h3 className="mt-4 text-xl font-black text-[#281052]">
                {title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {text}
              </p>

            </div>
          ))}

        </div>
      </section>

      {/* PROJECT HISTORY */}
      <section className="px-5 py-24">

        <div className="mx-auto max-w-7xl">

          <div className="text-center">

            <p className="text-xs font-black tracking-[0.22em] text-violet-500">
              ЖОБА ТАРИХЫ
            </p>

            <h2 className="mt-4 text-4xl font-black text-[#281052] sm:text-5xl">
              SMART OQYRMAN қалай дамыды?
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Жоба бір оқу жылымен шектелмей, тәжірибелік жұмыс пен
              нақты нәтижелер негізінде жалғасып келеді.
            </p>

          </div>

          <div className="relative mx-auto mt-14 max-w-5xl">

            <div className="absolute bottom-0 left-1/2 top-0 hidden w-[2px] -translate-x-1/2 bg-violet-200 md:block" />

            <div className="grid gap-8 md:grid-cols-2">

              {/* 2025-2026 */}
              <div className="rounded-[2.5rem] border border-violet-100 bg-white p-8 shadow-xl shadow-violet-100/50">

                <div className="inline-flex rounded-full bg-violet-100 px-4 py-2 text-sm font-black text-violet-700">
                  2025–2026
                </div>

                <h3 className="mt-6 text-3xl font-black text-[#281052]">
                  Жобаның басталуы
                </h3>

                <p className="mt-4 leading-8 text-slate-600">
                  SMART OQYRMAN платформасы 2025–2026 оқу жылында
                  іске қосылып, оқушылардың көркем әдебиет оқуға
                  қызығушылығын арттыруға бағытталған алғашқы
                  тәжірибелік жұмыстар жүргізілді.
                </p>

                <Link
                  href="/2025-2026"
                  className="mt-7 inline-flex rounded-xl bg-violet-600 px-6 py-3.5 font-black text-white shadow-lg"
                >
                  2025–2026 нәтижелерін көру →
                </Link>

              </div>

              {/* 2026-2027 */}
              <div className="rounded-[2.5rem] bg-[#281052] p-8 text-white shadow-xl">

                <div className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-black text-amber-300">
                  2026–2027
                </div>

                <h3 className="mt-6 text-3xl font-black">
                  Жобаның жалғасы
                </h3>

                <p className="mt-4 leading-8 text-violet-100">
                  Жоба 2026–2027 оқу жылында жалғасын тауып,
                  платформаның мүмкіндіктері кеңейтілді.
                  Қазіргі кезеңде платформаға
                  <b className="text-amber-300"> 30 оқушы </b>
                  тіркеліп, оқылған кітап саны
                  <b className="text-amber-300"> 50-ге жетті.</b>
                </p>

                <div className="mt-7 grid grid-cols-2 gap-3">

                  <div className="rounded-2xl bg-white/10 p-5 text-center">
                    <p className="text-4xl font-black text-amber-300">
                      30
                    </p>
                    <p className="mt-1 text-sm font-bold text-violet-100">
                      оқушы
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-5 text-center">
                    <p className="text-4xl font-black text-amber-300">
                      50
                    </p>
                    <p className="mt-1 text-sm font-bold text-violet-100">
                      кітап
                    </p>
                  </div>

                </div>

              </div>

            </div>
          </div>
        </div>
      </section>

      {/* RESEARCH */}
      <section id="research" className="bg-[#F7F3FF] px-5 py-24">

        <div className="mx-auto max-w-7xl">

          <div className="text-center">

            <p className="text-xs font-black tracking-[0.22em] text-violet-500">
              ЗЕРТТЕУ НЕГІЗІ
            </p>

            <h2 className="mt-4 text-4xl font-black text-[#281052] sm:text-5xl">
              Ғылыми жобаның өзегі
            </h2>

          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">

            <div className="rounded-[2rem] bg-[#281052] p-8 text-white">

              <div className="text-4xl">
                ❓
              </div>

              <h3 className="mt-5 text-2xl font-black">
                Зерттеу сұрағы
              </h3>

              <p className="mt-4 leading-8 text-violet-100">
                Цифрлық оқу ортасы оқушылардың көркем әдебиетті
                жүйелі оқу белсенділігіне қалай әсер етеді?
              </p>

            </div>

            <div className="rounded-[2rem] bg-white p-8 shadow-sm">

              <div className="text-4xl">
                🎯
              </div>

              <h3 className="mt-5 text-2xl font-black text-[#281052]">
                Зерттеу мақсаты
              </h3>

              <p className="mt-4 leading-8 text-slate-600">
                Цифрлық оқу платформасының оқушылардың көркем әдебиет
                оқуға қызығушылығы мен оқу белсенділігіне ықпалын
                анықтау және оқу әрекетін жүйелеудің тиімді моделін ұсыну.
              </p>

            </div>

            <div className="rounded-[2rem] bg-amber-50 p-8">

              <div className="text-4xl">
                💡
              </div>

              <h3 className="mt-5 text-2xl font-black text-[#281052]">
                Жобаның жаңалығы
              </h3>

              <p className="mt-4 leading-8 text-slate-600">
                Кітап оқу, тест, шығармашылық жұмыс, пікір,
                ұпай және мұғалім бақылауын бір цифрлық ортаға біріктіреді.
              </p>

            </div>

            <div className="rounded-[2rem] bg-emerald-50 p-8">

              <div className="text-4xl">
                🏫
              </div>

              <h3 className="mt-5 text-2xl font-black text-[#281052]">
                Практикалық маңызы
              </h3>

              <p className="mt-4 leading-8 text-slate-600">
                Платформаны басқа мектеп мұғалімдері де өз сыныбын
                ашып, арнайы код арқылы оқушыларын қосу үшін
                пайдалана алады.
              </p>

            </div>

          </div>
        </div>
      </section>

      {/* 100 POINT SYSTEM */}
      <section className="px-5 py-20">

        <div className="mx-auto max-w-6xl">

          <div className="text-center">

            <p className="text-xs font-black tracking-[0.22em] text-violet-500">
              БАҒАЛАУ ЖҮЙЕСІ
            </p>

            <h2 className="mt-4 text-4xl font-black text-[#281052]">
              100 ұпайлық оқу моделі
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-slate-600">
              Әр кітап бойынша оқушының оқу белсенділігі
              100 ұпайлық жүйемен бағаланады.
            </p>

          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-3xl bg-violet-50 p-6 text-center shadow-sm">
              <p className="text-4xl">📖</p>
              <p className="mt-4 font-black text-[#281052]">Оқу</p>
              <p className="mt-2 text-4xl font-black text-indigo-600">20</p>
            </div>

            <div className="rounded-3xl bg-violet-50 p-6 text-center shadow-sm">
              <p className="text-4xl">📝</p>
              <p className="mt-4 font-black text-[#281052]">Тест</p>
              <p className="mt-2 text-4xl font-black text-violet-600">50</p>
            </div>

            <div className="rounded-3xl bg-violet-50 p-6 text-center shadow-sm">
              <p className="text-4xl">🎨</p>
              <p className="mt-4 font-black text-[#281052]">
                Шығармашылық
              </p>
              <p className="mt-2 text-4xl font-black text-fuchsia-600">10</p>
            </div>

            <div className="rounded-3xl bg-violet-50 p-6 text-center shadow-sm">
              <p className="text-4xl">💬</p>
              <p className="mt-4 font-black text-[#281052]">Пікір</p>
              <p className="mt-2 text-4xl font-black text-emerald-600">20</p>
            </div>

          </div>

          <div className="mx-auto mt-6 max-w-2xl rounded-2xl bg-[#281052] p-5 text-center text-white">

            <p className="font-black">
              20 + 50 + 10 + 20 = 100 ұпай
            </p>

          </div>

        </div>
      </section>

      {/* JOURNEY */}
      <section id="journey" className="bg-[#F8F6FC] px-5 py-24">

        <div className="mx-auto max-w-7xl">

          <div className="text-center">

            <p className="text-xs font-black tracking-[0.22em] text-violet-500">
              ОҚУ ЖОЛЫ
            </p>

            <h2 className="mt-4 text-4xl font-black text-[#281052] sm:text-5xl">
              Кітаптан нәтижеге дейін
            </h2>

          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-7">

            {journey.map((step, index) => (
              <div
                key={step.title}
                className="rounded-[1.7rem] border border-violet-100 bg-white p-5 shadow-sm"
              >

                <div className="text-3xl">
                  {step.icon}
                </div>

                <p className="mt-5 text-[10px] font-black tracking-[0.15em] text-violet-400">
                  ҚАДАМ 0{index + 1}
                </p>

                <h3 className="mt-2 font-black text-[#281052]">
                  {step.title}
                </h3>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {step.text}
                </p>

              </div>
            ))}

          </div>

        </div>
      </section>

      {/* CURRENT RESULTS */}
      <section className="px-5 py-20">

        <div className="mx-auto max-w-7xl rounded-[3rem] bg-[#281052] p-8 text-white sm:p-12">

          <div className="grid items-center gap-10 lg:grid-cols-2">

            <div>

              <p className="text-xs font-black tracking-[0.22em] text-amber-300">
                АҒЫМДАҒЫ НӘТИЖЕ
              </p>

              <h2 className="mt-4 text-4xl font-black sm:text-5xl">
                2026–2027 оқу жылы
              </h2>

              <p className="mt-5 text-lg leading-8 text-violet-100">
                SMART OQYRMAN платформасына
                <b className="text-amber-300"> 30 оқушы </b>
                тіркеліп, оқылған кітап саны
                <b className="text-amber-300"> 50-ге жетті.</b>
              </p>

              <Link
                href="/2025-2026"
                className="mt-7 inline-flex rounded-xl bg-white px-6 py-3.5 font-black text-violet-700"
              >
                Алдыңғы оқу жылының нәтижелері →
              </Link>

            </div>

            <div className="grid grid-cols-2 gap-4">

              <div className="rounded-[2rem] bg-white/10 p-8 text-center">

                <p className="text-4xl">
                  👥
                </p>

                <p className="mt-3 text-6xl font-black text-amber-300">
                  30
                </p>

                <p className="mt-2 font-bold">
                  оқушы
                </p>

              </div>

              <div className="rounded-[2rem] bg-white/10 p-8 text-center">

                <p className="text-4xl">
                  📚
                </p>

                <p className="mt-3 text-6xl font-black text-amber-300">
                  50
                </p>

                <p className="mt-2 font-bold">
                  оқылған кітап
                </p>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* PROJECT LIFE */}
      <section className="px-5 py-24">

        <div className="mx-auto max-w-7xl">

          <div className="text-center">

            <p className="text-xs font-black tracking-[0.22em] text-violet-500">
              НАҚТЫ ТӘЖІРИБЕ
            </p>

            <h2 className="mt-4 text-4xl font-black text-[#281052] sm:text-5xl">
              SMART OQYRMAN өмірде
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-600">
              Жоба цифрлық платформамен ғана шектелмейді.
              Оқырмандармен кездесулер, кітапханамен байланыс және
              шығармашылық жұмыстар арқылы тәжірибеде жүзеге асырылады.
            </p>

          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">

            <div className="overflow-hidden rounded-[2.5rem] bg-white shadow-xl">

              <img
                src="/media/project-life-1.jpg"
                alt="SMART OQYRMAN жобасы"
                className="h-[400px] w-full object-cover object-top"
              />

              <div className="p-6">

                <h3 className="text-xl font-black text-[#281052]">
                  Оқырмандармен жұмыс
                </h3>

                <p className="mt-2 leading-7 text-slate-600">
                  Оқушылардың кітап оқу мәдениетін қалыптастыруға
                  бағытталған практикалық жұмыстар.
                </p>

              </div>
            </div>

            <div className="overflow-hidden rounded-[2.5rem] bg-white shadow-xl">

              <img
                src="/media/project-life-2.jpg"
                alt="SMART OQYRMAN жобасының іс-шарасы"
                className="h-[400px] w-full object-cover object-top"
              />

              <div className="p-6">

                <h3 className="text-xl font-black text-[#281052]">
                  Жобаға қатысушылар
                </h3>

                <p className="mt-2 leading-7 text-slate-600">
                  Кітап кейіпкерлерін талдау, пікір алмасу және
                  шығармашылық жұмыстар.
                </p>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* LIBRARY INTERVIEW */}
      <section className="bg-violet-50 px-5 py-24">

        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">

          <div className="overflow-hidden rounded-[2.5rem] border-[6px] border-white shadow-2xl">

            <img
              src="/media/library-interview.jpg"
              alt="Кітапханадағы сұхбат"
              className="h-[450px] w-full object-cover object-top"
            />

          </div>

          <div>

            <p className="text-xs font-black tracking-[0.22em] text-violet-500">
              СЕРІКТЕСТІК
            </p>

            <h2 className="mt-4 text-4xl font-black text-[#281052]">
              Кітапханадағы сұхбат
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              SMART OQYRMAN жобасы кітапхана ортасындағы нақты
              жұмыстармен, оқырман кездесулерімен және тәжірибе
              алмасумен толықтырылады.
            </p>

            <Link
              href="/media"
              className="mt-7 inline-flex rounded-2xl bg-violet-600 px-7 py-4 font-black text-white"
            >
              📸 Медиа бөлімін көру →
            </Link>

          </div>

        </div>
      </section>

      {/* REWARDS */}
      <section className="bg-[#FFF8E9] px-5 py-24">

        <div className="mx-auto max-w-7xl">

          <div className="mx-auto max-w-3xl text-center">

            <p className="text-xs font-black tracking-[0.22em] text-amber-500">
              МАРАПАТТАУ ЖҮЙЕСІ
            </p>

            <h2 className="mt-4 text-4xl font-black text-[#281052] sm:text-5xl">
              Үздік нәтиже — нақты марапат
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Әр тоқсан қорытындысы бойынша үздік нәтиже көрсеткен
              оқушылар мәдени-танымдық жолдамалармен марапатталады.
            </p>

          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">

            <div className="overflow-hidden rounded-[2.5rem] bg-white shadow-xl">

              <img
                src="/media/reward-readers.jpg"
                alt="SMART OQYRMAN үздік оқырмандары"
                className="h-[440px] w-full object-cover object-top"
              />

              <div className="p-6">

                <p className="text-xs font-black tracking-[0.18em] text-amber-500">
                  НАҚТЫ МАРАПАТ
                </p>

                <h3 className="mt-2 text-2xl font-black text-[#281052]">
                  Үздік оқырмандар
                </h3>

              </div>

            </div>

            <div className="grid gap-4">

              {rewards.map((reward) => (
                <div
                  key={reward.title}
                  className="flex items-start gap-5 rounded-[2rem] bg-white p-6 shadow-lg"
                >

                  <div className="text-4xl">
                    {reward.icon}
                  </div>

                  <div>

                    <h3 className="text-xl font-black text-[#281052]">
                      {reward.title}
                    </h3>

                    <p className="mt-2 leading-7 text-slate-500">
                      {reward.text}
                    </p>

                  </div>

                </div>
              ))}

            </div>

          </div>
        </div>
      </section>

      {/* STUDENT / TEACHER */}
      <section className="px-5 py-24">

        <div className="mx-auto max-w-6xl">

          <div className="text-center">

            <p className="text-xs font-black tracking-[0.22em] text-violet-500">
              БІР ПЛАТФОРМА — ЕКІ МҮМКІНДІК
            </p>

            <h2 className="mt-4 text-4xl font-black text-[#281052]">
              Оқушы оқиды. Мұғалім бағыттайды.
            </h2>

          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">

            <div className="rounded-[2.5rem] bg-[#281052] p-8 text-white">

              <div className="text-5xl">
                🎓
              </div>

              <h3 className="mt-5 text-3xl font-black">
                Оқушы кабинеті
              </h3>

              <p className="mt-4 leading-7 text-violet-100">
                Оқушы кітап таңдап, тапсырма орындап, пікір жазып,
                өзінің оқу нәтижесін бақылайды.
              </p>

              <Link
                href="/profile"
                className="mt-7 inline-flex rounded-xl bg-white px-6 py-3.5 font-black text-violet-700"
              >
                Оқушы кабинетіне кіру →
              </Link>

            </div>

            <div className="rounded-[2.5rem] bg-violet-50 p-8">

              <div className="text-5xl">
                👩‍🏫
              </div>

              <h3 className="mt-5 text-3xl font-black text-[#281052]">
                Мұғалім кабинеті
              </h3>

              <p className="mt-4 leading-7 text-slate-600">
                Мұғалім сынып ашып, арнайы код арқылы оқушыларды
                қосып, олардың оқу белсенділігі мен нәтижесін бақылайды.
              </p>

              <Link
                href="/teacher"
                className="mt-7 inline-flex rounded-xl bg-violet-600 px-6 py-3.5 font-black text-white"
              >
                Мұғалім кабинетіне кіру →
              </Link>

            </div>

          </div>

        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-5 pb-24">

        <div className="mx-auto max-w-6xl rounded-[3rem] bg-gradient-to-br from-violet-700 via-fuchsia-500 to-indigo-700 px-8 py-16 text-center text-white shadow-2xl">

          <div className="text-6xl">
            📚✨
          </div>

          <h2 className="mt-6 text-4xl font-black sm:text-5xl">
            Кітап оқы. Ойлан. Талда. Дамы.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-violet-100">
            SMART OQYRMAN — цифрлық қызығушылықтан саналы оқуға
            бастайтын оқу ортасы.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            <Link
              href="/register"
              className="rounded-2xl bg-white px-8 py-4 font-black text-violet-700"
            >
              Тіркелу →
            </Link>

            <Link
              href="/login"
              className="rounded-2xl border border-white/30 bg-white/10 px-8 py-4 font-black text-white"
            >
              Жүйеге кіру
            </Link>

          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-violet-100 bg-white px-5 py-9">

        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-center sm:flex-row sm:items-center sm:justify-between">

          <Link href="/" className="font-black text-[#281052]">
            📖 SMART OQYRMAN
          </Link>

          <div className="flex flex-wrap justify-center gap-4 text-sm font-bold text-slate-500">

            <Link href="/2025-2026" className="hover:text-violet-700">
              2025–2026 нәтижелері
            </Link>

            <Link href="/media" className="hover:text-violet-700">
              Медиа
            </Link>

          </div>

          <p className="text-sm text-slate-400">
            2026–2027 оқу жылы
          </p>

        </div>

      </footer>

    </main>
  );
}