"use client";

import { useEffect, useState } from "react";

type Book = {
  id: number;
  title: string;
  author: string;
};

type Question = {
  question: string;
  options: string[];
  answer: string;
};

const questionBank: Record<string, Question[]> = {
  "Ауыл шетіндегі үй": [
    {
      question: "«Ауыл шетіндегі үй» шығармасының авторы кім?",
      options: [
        "Әкім Тарази",
        "Дулат Исабеков",
        "Мұхтар Әуезов",
        "Сайын Мұратбеков",
      ],
      answer: "Әкім Тарази",
    },
    {
      question: "Шығармада қандай орта суреттеледі?",
      options: [
        "Ауыл өмірі",
        "Ғарыш әлемі",
        "Теңіз өмірі",
        "Шетелдегі өмір",
      ],
      answer: "Ауыл өмірі",
    },
    {
      question: "Шығармада неге көңіл бөлінеді?",
      options: [
        "Адамдардың қарым-қатынасына",
        "Спорт жарысына",
        "Ғылыми тәжірибеге",
        "Саяхатқа",
      ],
      answer: "Адамдардың қарым-қатынасына",
    },
    {
      question: "Шығармада қандай сезімдер көрініс табады?",
      options: [
        "Мейірімділік пен сағыныш",
        "Тек қуаныш",
        "Тек ашу",
        "Бәсекелестік",
      ],
      answer: "Мейірімділік пен сағыныш",
    },
    {
      question: "Шығарма оқырманды не туралы ойландырады?",
      options: [
        "Туған жер мен жақын адамдардың қадірі",
        "Тек байлық",
        "Жарыста жеңу",
        "Ғарышты зерттеу",
      ],
      answer: "Туған жер мен жақын адамдардың қадірі",
    },
  ],

  "Мәңгілік бала бейнесі": [
    {
      question: "«Мәңгілік бала бейнесі» шығармасының авторы кім?",
      options: [
        "Роза Мұқанова",
        "Мұхтар Мағауин",
        "Әкім Тарази",
        "Дулат Исабеков",
      ],
      answer: "Роза Мұқанова",
    },
    {
      question: "Шығармадағы басты кейіпкер кім?",
      options: ["Ләйлә", "Салтанат", "Аян", "Қожа"],
      answer: "Ләйлә",
    },
    {
      question: "Шығарма қандай тарихи қасіретпен байланысты?",
      options: [
        "Семей ядролық полигоны",
        "Арал теңізі",
        "Ғарышқа ұшу",
        "Спорт жарысы",
      ],
      answer: "Семей ядролық полигоны",
    },
    {
      question: "Ләйлә тағдыры арқылы автор нені көрсетеді?",
      options: [
        "Ядролық сынақтың адамға зардабын",
        "Спорттың пайдасын",
        "Қала өмірін",
        "Мектептегі достықты",
      ],
      answer: "Ядролық сынақтың адамға зардабын",
    },
    {
      question: "Шығарманың тәрбиелік ойына қайсысы жақын?",
      options: [
        "Бейбіт өмірді бағалау",
        "Тек жеңіске ұмтылу",
        "Байлық жинау",
        "Басқалардан озу",
      ],
      answer: "Бейбіт өмірді бағалау",
    },
  ],

  "Көксерек": [
    {
      question: "«Көксерек» шығармасының авторы кім?",
      options: [
        "Мұхтар Әуезов",
        "Бердібек Соқпақбаев",
        "Мұхтар Мағауин",
        "Әкім Тарази",
      ],
      answer: "Мұхтар Әуезов",
    },
    {
      question: "Көксерек қандай жануар?",
      options: ["Қасқыр", "Түлкі", "Жылқы", "Ит"],
      answer: "Қасқыр",
    },
    {
      question: "Көксерекке қамқор болған баланың аты кім?",
      options: ["Құрмаш", "Қожа", "Аян", "Қартқожа"],
      answer: "Құрмаш",
    },
    {
      question: "Шығармадағы негізгі мәселелердің бірі қандай?",
      options: [
        "Адам мен табиғат байланысы",
        "Ғарыш",
        "Спорт",
        "Мектеп өмірі",
      ],
      answer: "Адам мен табиғат байланысы",
    },
    {
      question: "Шығарманың негізгі ойына қайсысы жақын?",
      options: [
        "Табиғат заңдылығын құрметтеу",
        "Жабайы аңды міндетті түрде қолға үйрету",
        "Тек жеңіске жету",
        "Байлыққа ұмтылу",
      ],
      answer: "Табиғат заңдылығын құрметтеу",
    },
  ],

  "Гауһартас": [
    {
      question: "«Гауһартас» шығармасының авторы кім?",
      options: [
        "Дулат Исабеков",
        "Сайын Мұратбеков",
        "Мұхтар Әуезов",
        "Роза Мұқанова",
      ],
      answer: "Дулат Исабеков",
    },
    {
      question: "Шығармадағы негізгі әйел кейіпкер кім?",
      options: ["Салтанат", "Ләйлә", "Гүлсім", "Бәтіш"],
      answer: "Салтанат",
    },
    {
      question: "Салтанаттың жары кім?",
      options: ["Тастан", "Қайыркен", "Қожа", "Аян"],
      answer: "Тастан",
    },
    {
      question: "Шығармада қандай құндылық маңызды орын алады?",
      options: [
        "Отбасы құндылығы",
        "Ғарыш зерттеу",
        "Спорт",
        "Саяхат",
      ],
      answer: "Отбасы құндылығы",
    },
    {
      question: "Салтанат бейнесіне қай сипаттама сәйкес келеді?",
      options: [
        "Мейірімді, ақкөңіл",
        "Қатал, тұйық",
        "Өте тәкаппар",
        "Қорқақ",
      ],
      answer: "Мейірімді, ақкөңіл",
    },
  ],

  "Тұлпардың тағдыры": [
    {
      question: "«Тұлпардың тағдыры» шығармасының авторы кім?",
      options: [
        "Тәкен Әлімқұлов",
        "Әкім Тарази",
        "Дулат Исабеков",
        "Мұхтар Әуезов",
      ],
      answer: "Тәкен Әлімқұлов",
    },
    {
      question: "Шығарма атауындағы «тұлпар» нені білдіреді?",
      options: [
        "Жүйрік жылқыны",
        "Қасқырды",
        "Қыран құсты",
        "Түйені",
      ],
      answer: "Жүйрік жылқыны",
    },
    {
      question: "Шығармадағы негізгі тақырыптардың бірі қандай?",
      options: [
        "Бәйге мен тұлпар тағдыры",
        "Ғарыш сапары",
        "Мектеп өмірі",
        "Теңіз саяхаты",
      ],
      answer: "Бәйге мен тұлпар тағдыры",
    },
    {
      question: "Бәйгеде қандай құбылыс көрініс табады?",
      options: [
        "Бәсеке мен бақталастық",
        "Ғылыми тәжірибе",
        "Мектеп сабағы",
        "Теңіз саяхаты",
      ],
      answer: "Бәсеке мен бақталастық",
    },
    {
      question: "Шығармада қандай ұлттық құндылық көрінеді?",
      options: [
        "Жылқы мен бәйге мәдениеті",
        "Теңіз мәдениеті",
        "Ғарыш мәдениеті",
        "Қала көлігі",
      ],
      answer: "Жылқы мен бәйге мәдениеті",
    },
  ],

  "Менің атым Қожа": [
    {
      question: "«Менің атым Қожа» шығармасының авторы кім?",
      options: [
        "Бердібек Соқпақбаев",
        "Мұхтар Әуезов",
        "Бауыржан Момышұлы",
        "Жүсіпбек Аймауытов",
      ],
      answer: "Бердібек Соқпақбаев",
    },
    {
      question: "Шығарманың басты кейіпкері кім?",
      options: ["Қожа", "Аян", "Құрмаш", "Қартқожа"],
      answer: "Қожа",
    },
    {
      question: "Қожаның мінезіне қай сипаттама сәйкес?",
      options: [
        "Тентектеу, бірақ жүрегі таза",
        "Қатал әрі мейірімсіз",
        "Өте тұйық",
        "Ешқашан қателеспейді",
      ],
      answer: "Тентектеу, бірақ жүрегі таза",
    },
    {
      question: "Қожа өз қателіктеріне қалай қарайды?",
      options: [
        "Түсініп, түзелуге тырысады",
        "Мүлде мойындамайды",
        "Басқаларды кінәлайды",
        "Оған бәрібір",
      ],
      answer: "Түсініп, түзелуге тырысады",
    },
    {
      question: "Шығарманың тәрбиелік мәнінің бірі қандай?",
      options: [
        "Қателіктен сабақ алу",
        "Тек жарыста жеңу",
        "Бай болу",
        "Ешкімді тыңдамау",
      ],
      answer: "Қателіктен сабақ алу",
    },
  ],

  "Бір атаның балалары": [
    {
      question: "«Бір атаның балалары» шығармасының авторы кім?",
      options: [
        "Мұхтар Мағауин",
        "Мұхтар Әуезов",
        "Әкім Тарази",
        "Дулат Исабеков",
      ],
      answer: "Мұхтар Мағауин",
    },
    {
      question: "Шығармада аталған балалардың бірі кім?",
      options: ["Зигфрид", "Құрмаш", "Қожа", "Салтанат"],
      answer: "Зигфрид",
    },
    {
      question: "Шығарма қандай кезеңдегі балалар тағдырын көрсетеді?",
      options: [
        "Соғыс жылдары",
        "Ғарыш дәуірі",
        "Қазіргі спорт әлемі",
        "Ежелгі дәуір",
      ],
      answer: "Соғыс жылдары",
    },
    {
      question: "Қазақ отбасының Зигфридті қабылдауы нені көрсетеді?",
      options: [
        "Мейірімділік пен бауырмалдықты",
        "Қаталдықты",
        "Байлықты",
        "Бәсекені",
      ],
      answer: "Мейірімділік пен бауырмалдықты",
    },
    {
      question: "Шығарманың негізгі ойына қайсысы жақын?",
      options: [
        "Адамдарды ұлтына бөлмей жақсылық жасау",
        "Тек өзіңді ойлау",
        "Басқалардан озу",
        "Қиындықтан қашу",
      ],
      answer: "Адамдарды ұлтына бөлмей жақсылық жасау",
    },
  ],

  "Ұшқан ұя": [
    {
      question: "«Ұшқан ұя» шығармасының авторы кім?",
      options: [
        "Бауыржан Момышұлы",
        "Бердібек Соқпақбаев",
        "Мұхтар Мағауин",
        "Әкім Тарази",
      ],
      answer: "Бауыржан Момышұлы",
    },
    {
      question: "Шығармада автордың қай кезеңі баяндалады?",
      options: [
        "Балалық шағы",
        "Қарттық шағы",
        "Шетелдегі өмірі",
        "Студенттік шағы",
      ],
      answer: "Балалық шағы",
    },
    {
      question: "Шығармада кімнің тәрбиесі ерекше көрінеді?",
      options: ["Әженің", "Жаттықтырушының", "Дәрігердің", "Әншінің"],
      answer: "Әженің",
    },
    {
      question: "Шығармада қандай құндылықтар дәріптеледі?",
      options: [
        "Отбасы тәрбиесі мен салт-дәстүр",
        "Тек спорт",
        "Байлық",
        "Ғарыш",
      ],
      answer: "Отбасы тәрбиесі мен салт-дәстүр",
    },
    {
      question: "Шығарманың негізгі тәрбиелік ойы қандай?",
      options: [
        "Отбасы тәрбиесінің маңызы",
        "Тек атаққа жету",
        "Дәстүрді ұмыту",
        "Жалғыз өмір сүру",
      ],
      answer: "Отбасы тәрбиесінің маңызы",
    },
  ],

  "Жусан иісі": [
    {
      question: "«Жусан иісі» шығармасының авторы кім?",
      options: [
        "Сайын Мұратбеков",
        "Әкім Тарази",
        "Дулат Исабеков",
        "Тәкен Әлімқұлов",
      ],
      answer: "Сайын Мұратбеков",
    },
    {
      question: "Шығармадағы басты балалардың бірі кім?",
      options: ["Аян", "Қожа", "Құрмаш", "Қартқожа"],
      answer: "Аян",
    },
    {
      question: "Шығарма оқиғасы қай кезеңмен байланысты?",
      options: [
        "Соғыс жылдары",
        "Ғарыш дәуірі",
        "Болашақ",
        "Ежелгі дәуір",
      ],
      answer: "Соғыс жылдары",
    },
    {
      question: "Аян балаларды немен қызықтырады?",
      options: [
        "Ертегі айтумен",
        "Футбол ойнаумен",
        "Сурет салумен",
        "Ән айтумен",
      ],
      answer: "Ертегі айтумен",
    },
    {
      question: "Шығарманың негізгі ойына қайсысы жақын?",
      options: [
        "Қиындықта үмітті жоғалтпау",
        "Тек жеңіс маңызды",
        "Байлыққа ұмтылу",
        "Басқаларды жеңу",
      ],
      answer: "Қиындықта үмітті жоғалтпау",
    },
  ],

  "Қартқожа": [
    {
      question: "«Қартқожа» шығармасының авторы кім?",
      options: [
        "Жүсіпбек Аймауытов",
        "Мұхтар Әуезов",
        "Сайын Мұратбеков",
        "Бердібек Соқпақбаев",
      ],
      answer: "Жүсіпбек Аймауытов",
    },
    {
      question: "Романның басты кейіпкері кім?",
      options: ["Қартқожа", "Қожа", "Аян", "Құрмаш"],
      answer: "Қартқожа",
    },
    {
      question: "Қартқожаның басты армандарының бірі қандай?",
      options: [
        "Білім алу",
        "Палуан болу",
        "Саудагер болу",
        "Аңшы болу",
      ],
      answer: "Білім алу",
    },
    {
      question: "Романда қандай мәселе көтеріледі?",
      options: [
        "Әлеуметтік теңсіздік",
        "Ғарышты зерттеу",
        "Спорт жарысы",
        "Теңіз саяхаты",
      ],
      answer: "Әлеуметтік теңсіздік",
    },
    {
      question: "«Қартқожа» қандай жанрдағы шығарма?",
      options: ["Роман", "Өлең", "Ертегі", "Мысал"],
      answer: "Роман",
    },
  ],

  "Қажымұқан": [
    {
      question: "«Қажымұқан» шығармасының авторы кім?",
      options: [
        "Қалмақан Әбдіқадыров",
        "Жүсіпбек Аймауытов",
        "Мұхтар Әуезов",
        "Тәкен Әлімқұлов",
      ],
      answer: "Қалмақан Әбдіқадыров",
    },
    {
      question: "Қажымұқан кім?",
      options: ["Палуан", "Ақын", "Суретші", "Дәрігер"],
      answer: "Палуан",
    },
    {
      question: "Қажымұқанның бойындағы маңызды қасиет қандай?",
      options: [
        "Қайсарлық",
        "Жалқаулық",
        "Қорқақтық",
        "Ұқыпсыздық",
      ],
      answer: "Қайсарлық",
    },
    {
      question: "Қажымұқан жетістікке қалай жетеді?",
      options: [
        "Еңбек пен табандылық арқылы",
        "Еш әрекет жасамай",
        "Кездейсоқ",
        "Тек басқалардың көмегімен",
      ],
      answer: "Еңбек пен табандылық арқылы",
    },
    {
      question: "Қажымұқанның жетістігі нені танытты?",
      options: [
        "Қазақ халқының атын әлемге",
        "Бір мектептің атын",
        "Бір ауылдың атын ғана",
        "Бір ойынның атын",
      ],
      answer: "Қазақ халқының атын әлемге",
    },
  ],
};

export default function TestPage() {
  const [book, setBook] = useState<Book | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
    const savedBook = localStorage.getItem(
      "smartOqyrmanCurrentBook"
    );

    if (savedBook) {
      setBook(JSON.parse(savedBook));
    }
  }, []);

  if (!book) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="rounded-3xl bg-white p-8 text-center shadow-lg">
          <h1 className="text-3xl font-extrabold text-indigo-700">
            SMART OQYRMAN
          </h1>

          <p className="mt-4 text-slate-500">
            Тест тапсыру үшін алдымен кітап таңдаңыз.
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

  const currentBook = book;
  const questions = questionBank[currentBook.title];

  if (!questions) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="rounded-3xl bg-white p-8 text-center shadow-lg">
          <h1 className="text-3xl font-extrabold text-indigo-700">
            SMART OQYRMAN
          </h1>

          <p className="mt-4 text-slate-500">
            Бұл кітапқа тест әзірге табылмады.
          </p>

          <a
            href="/books"
            className="mt-6 inline-block rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white"
          >
            Кітаптарға қайту
          </a>
        </div>
      </main>
    );
  }

  function chooseAnswer(
    questionIndex: number,
    option: string
  ) {
    if (score !== null) return;

    const newAnswers = [...answers];

    newAnswers[questionIndex] = option;

    setAnswers(newAnswers);
  }

  function finishTest() {
    const unanswered = questions.some(
      (_, index) => !answers[index]
    );

    if (unanswered) {
      alert("Барлық 5 сұраққа жауап беріңіз.");
      return;
    }

    let correct = 0;

    questions.forEach((question, index) => {
      if (answers[index] === question.answer) {
        correct++;
      }
    });

    const result = correct * 10;

    setCorrectCount(correct);
    setScore(result);

    const oldResults = localStorage.getItem(
      "smartOqyrmanTestResults"
    );

    const results = oldResults
      ? JSON.parse(oldResults)
      : {};

    results[currentBook.title] = {
      bookId: currentBook.id,
      book: currentBook.title,
      author: currentBook.author,
      correctAnswers: correct,
      totalQuestions: 5,
      score: result,
      maxScore: 50,
      completed: true,
    };

    localStorage.setItem(
      "smartOqyrmanTestResults",
      JSON.stringify(results)
    );

    localStorage.setItem(
      "smartOqyrmanTestResult",
      JSON.stringify(results[currentBook.title])
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8">
      <div className="mx-auto max-w-4xl">

        <header className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h1 className="text-3xl font-extrabold text-indigo-700">
                SMART OQYRMAN
              </h1>

              <p className="mt-2 text-slate-500">
                Кітап бойынша тест
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

        <section className="mt-6 rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 p-7 text-white">

          <p className="text-sm font-bold uppercase tracking-widest text-indigo-200">
            Тест
          </p>

          <h2 className="mt-2 text-3xl font-extrabold">
            «{currentBook.title}»
          </h2>

          <p className="mt-2 text-indigo-100">
            {currentBook.author}
          </p>

          <div className="mt-5 rounded-2xl bg-white/10 p-4">
            <p className="font-bold">
              5 сұрақ × 10 ұпай = 50 ұпай
            </p>
          </div>

        </section>

        <section className="mt-7 space-y-6">

          {questions.map(
            (question, questionIndex) => (
              <div
                key={questionIndex}
                className="rounded-3xl bg-white p-6 shadow-sm"
              >

                <p className="text-sm font-bold text-indigo-600">
                  {questionIndex + 1}-сұрақ
                </p>

                <h3 className="mt-2 text-xl font-extrabold leading-8 text-slate-800">
                  {question.question}
                </h3>

                <div className="mt-5 space-y-3">

                  {question.options.map(
                    (option) => {
                      const selected =
                        answers[questionIndex] === option;

                      let style =
                        "border-slate-200 bg-white text-slate-700";

                      if (
                        score === null &&
                        selected
                      ) {
                        style =
                          "border-indigo-600 bg-indigo-50 text-indigo-700";
                      }

                      if (
                        score !== null &&
                        option === question.answer
                      ) {
                        style =
                          "border-emerald-500 bg-emerald-50 text-emerald-700";
                      }

                      if (
                        score !== null &&
                        selected &&
                        option !== question.answer
                      ) {
                        style =
                          "border-red-400 bg-red-50 text-red-700";
                      }

                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() =>
                            chooseAnswer(
                              questionIndex,
                              option
                            )
                          }
                          className={`w-full rounded-xl border p-4 text-left font-semibold transition ${style}`}
                        >
                          {option}
                        </button>
                      );
                    }
                  )}

                </div>

              </div>
            )
          )}

        </section>

        {score === null ? (
          <button
            type="button"
            onClick={finishTest}
            className="mt-7 w-full rounded-xl bg-emerald-600 px-6 py-4 text-lg font-extrabold text-white hover:bg-emerald-700"
          >
            ✅ Тестті аяқтау
          </button>
        ) : (
          <section className="mt-7 rounded-3xl bg-emerald-50 p-8 text-center">

            <div className="text-5xl">
              {score >= 40
                ? "🏆"
                : score >= 30
                ? "⭐"
                : "📚"}
            </div>

            <p className="mt-4 text-sm font-bold uppercase tracking-widest text-emerald-700">
              Тест аяқталды
            </p>

            <p className="mt-3 text-5xl font-extrabold text-emerald-700">
              {score} / 50
            </p>

            <p className="mt-3 text-lg text-slate-600">
              Дұрыс жауап: {correctCount} / 5
            </p>

            <p className="mt-2 text-slate-500">
              Нәтиже жеке кабинетке сақталды.
            </p>

            <a
              href="/profile"
              className="mt-6 inline-block rounded-xl bg-indigo-600 px-7 py-3 font-bold text-white"
            >
              Жеке кабинетке қайту →
            </a>

          </section>
        )}

      </div>
    </main>
  );
}