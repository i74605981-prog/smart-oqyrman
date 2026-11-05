"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "../../utils/supabase/client";

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
      options: [
        "Әженің",
        "Жаттықтырушының",
        "Дәрігердің",
        "Әншінің",
      ],
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

  "Тұлпардың соңғы тұяғы": [
    {
      question: "«Тұлпардың соңғы тұяғы» шығармасының авторы кім?",
      options: [
        "Оразхан Ахмет",
        "Оралхан Бөкей",
        "Тахауи Ахтанов",
        "Тұрсын Жұртбай",
      ],
      answer: "Оразхан Ахмет",
    },
    {
      question: "«Тұлпардың соңғы тұяғы» қандай жанрдағы шығарма?",
      options: ["Роман", "Өлең", "Мысал", "Драма"],
      answer: "Роман",
    },
    {
      question: "Шығарма атауындағы «тұлпар» сөзі қандай мағына береді?",
      options: [
        "Жүйрік ат",
        "Қыран құс",
        "Жыртқыш аң",
        "Түйе",
      ],
      answer: "Жүйрік ат",
    },
    {
      question: "Оразхан Ахмет қандай қаламгер?",
      options: [
        "Қытайдағы қазақ жазушысы",
        "Ағылшын жазушысы",
        "Орыс жазушысы",
        "Француз жазушысы",
      ],
      answer: "Қытайдағы қазақ жазушысы",
    },
    {
      question: "«Тұлпардың соңғы тұяғы» атауындағы негізгі бейне қайсы?",
      options: ["Тұлпар", "Қасқыр", "Қыран", "Арыстан"],
      answer: "Тұлпар",
    },
  ],

  "Әкең де бала болған": [
    {
      question: "«Әкең де бала болған» шығармасының авторы кім?",
      options: [
        "Бек Тоғысбаев",
        "Оразхан Ахмет",
        "Сайын Мұратбеков",
        "Оралхан Бөкей",
      ],
      answer: "Бек Тоғысбаев",
    },
    {
      question: "«Әкең де бала болған» қандай жанрдағы шығарма?",
      options: ["Әңгіме", "Поэма", "Роман", "Мысал"],
      answer: "Әңгіме",
    },
    {
      question: "Шығарма атауында қандай екі ұрпақ өкілі аталады?",
      options: [
        "Әке мен бала",
        "Ата мен әже",
        "Аға мен іні",
        "Ана мен қыз",
      ],
      answer: "Әке мен бала",
    },
    {
      question: "«Әкең де бала болған» атауы оқырманды не туралы ойландырады?",
      options: [
        "Үлкендердің де кезінде бала болғаны туралы",
        "Табиғат туралы",
        "Соғыс туралы",
        "Ғарыш туралы",
      ],
      answer: "Үлкендердің де кезінде бала болғаны туралы",
    },
    {
      question: "Шығарма атауына сай негізгі құндылықтың бірі қайсы?",
      options: [
        "Ұрпақтар арасындағы түсіністік",
        "Байлық жинау",
        "Спорттық жарыс",
        "Саяхат жасау",
      ],
      answer: "Ұрпақтар арасындағы түсіністік",
    },
  ],

  "Ана туралы новелла": [
    {
      question: "«Ана туралы новелла» шығармасының авторы кім?",
      options: [
        "Ғабит Мүсірепов",
        "Мұхтар Әуезов",
        "Оралхан Бөкей",
        "Тахауи Ахтанов",
      ],
      answer: "Ғабит Мүсірепов",
    },
    {
      question: "Ғабит Мүсіреповтің ана туралы шығармаларындағы негізгі бейне кім?",
      options: ["Ана", "Палуан", "Аңшы", "Саяхатшы"],
      answer: "Ана",
    },
    {
      question: "Ана бейнесі арқылы қандай қасиеттер дәріптеледі?",
      options: [
        "Мейірім мен жанкештілік",
        "Қаталдық пен өшпенділік",
        "Мақтаншақтық",
        "Жалқаулық",
      ],
      answer: "Мейірім мен жанкештілік",
    },
    {
      question: "Ана туралы новеллалардың негізгі құндылығы қайсы?",
      options: [
        "Ананы құрметтеу",
        "Байлыққа ұмтылу",
        "Жарыста жеңу",
        "Даңқ іздеу",
      ],
      answer: "Ананы құрметтеу",
    },
    {
      question: "Автор ана бейнесін қалай танытады?",
      options: [
        "Парасатты әрі перзенті үшін жанкешті тұлға ретінде",
        "Қорқақ адам ретінде",
        "Тек көңілді кейіпкер ретінде",
        "Бәсекелес ретінде",
      ],
      answer: "Парасатты әрі перзенті үшін жанкешті тұлға ретінде",
    },
  ],

  "Бір уыс жусан": [
    {
      question: "«Бір уыс жусан» шығармасының авторы кім?",
      options: [
        "Тұрсын Жұртбай",
        "Сайын Мұратбеков",
        "Оралхан Бөкей",
        "Оразхан Ахмет",
      ],
      answer: "Тұрсын Жұртбай",
    },
    {
      question: "«Бір уыс жусан» шығармасы қандай сипаттағы туынды?",
      options: [
        "Элегиялық әңгіме",
        "Комедия",
        "Ертегі",
        "Детектив",
      ],
      answer: "Элегиялық әңгіме",
    },
    {
      question: "Шығарма қандай тарихи қасіреттің зардабымен байланысты?",
      options: [
        "Ядролық сынақ зардабымен",
        "Теңіз саяхатымен",
        "Спорт жарысымен",
        "Ғарыш сапарымен",
      ],
      answer: "Ядролық сынақ зардабымен",
    },
    {
      question: "Шығармада еске алынатын Төлеу авторға кім болады?",
      options: [
        "Қарындасы",
        "Ұстазы",
        "Досы",
        "Көршісі",
      ],
      answer: "Қарындасы",
    },
    {
      question: "«Бір уыс жусан» шығармасында қандай сезім басым?",
      options: [
        "Сағыныш пен қасірет",
        "Күлкі мен әзіл",
        "Жарыс",
        "Мақтан",
      ],
      answer: "Сағыныш пен қасірет",
    },
  ],

  "Кербұғы": [
    {
      question: "«Кербұғы» шығармасының авторы кім?",
      options: [
        "Оралхан Бөкей",
        "Тұрсын Жұртбай",
        "Тахауи Ахтанов",
        "Мұхтар Әуезов",
      ],
      answer: "Оралхан Бөкей",
    },
    {
      question: "Шығарманың негізгі кейіпкері кім?",
      options: ["Кербұғы", "Қасқыр", "Жылқы", "Қыран"],
      answer: "Кербұғы",
    },
    {
      question: "Шығармада Кербұғының қандай күйі суреттеледі?",
      options: [
        "Қартайып әлсіреуі",
        "Жасарып күш жинауы",
        "Адамға айналуы",
        "Үй жануарына айналуы",
      ],
      answer: "Қартайып әлсіреуі",
    },
    {
      question: "«Кербұғы» шығармасында табиғат бейнесі не үшін маңызды?",
      options: [
        "Кейіпкердің ішкі күйін тереңдету үшін",
        "Тек ауа райын айту үшін",
        "Спортты сипаттау үшін",
        "Қаланың құрылысын көрсету үшін",
      ],
      answer: "Кейіпкердің ішкі күйін тереңдету үшін",
    },
    {
      question: "«Кербұғы» шығармасына қай ой жақын?",
      options: [
        "Өмір мен табиғаттың өткіншілігі туралы толғаныс",
        "Байлық жинау",
        "Ғарышты бағындыру",
        "Мектеп жарысы",
      ],
      answer: "Өмір мен табиғаттың өткіншілігі туралы толғаныс",
    },
  ],

  "Қаһарлы күндер": [
    {
      question: "«Қаһарлы күндер» романының авторы кім?",
      options: [
        "Тахауи Ахтанов",
        "Оралхан Бөкей",
        "Мұхтар Әуезов",
        "Ғабит Мүсірепов",
      ],
      answer: "Тахауи Ахтанов",
    },
    {
      question: "«Қаһарлы күндер» қандай жанрдағы шығарма?",
      options: ["Роман", "Өлең", "Ертегі", "Мысал"],
      answer: "Роман",
    },
    {
      question: "Роман қандай тарихи кезеңді суреттейді?",
      options: [
        "Екінші дүниежүзілік соғыс кезеңін",
        "Қазақ хандығының құрылуын",
        "Ғарыш дәуірін",
        "Тәуелсіздік жылдарын",
      ],
      answer: "Екінші дүниежүзілік соғыс кезеңін",
    },
    {
      question: "Романдағы маңызды шайқастардың бірі қай жерде өтеді?",
      options: [
        "Мәскеу түбінде",
        "Алматыда",
        "Түркістанда",
        "Лондонда",
      ],
      answer: "Мәскеу түбінде",
    },
    {
      question: "Романның негізгі идеясына қайсысы жақын?",
      options: [
        "Отанды қорғау және жауынгер ерлігі",
        "Байлық жинау",
        "Саяхаттау",
        "Спорттық бәсеке",
      ],
      answer: "Отанды қорғау және жауынгер ерлігі",
    },
  ],

  "Қилы заман": [
    {
      question: "«Қилы заман» шығармасының авторы кім?",
      options: [
        "Мұхтар Әуезов",
        "Тахауи Ахтанов",
        "Оралхан Бөкей",
        "Ғабит Мүсірепов",
      ],
      answer: "Мұхтар Әуезов",
    },
    {
      question: "«Қилы заман» қандай жанрдағы шығарма?",
      options: ["Повесть", "Өлең", "Мысал", "Комедия"],
      answer: "Повесть",
    },
    {
      question: "«Қилы заман» қай жылы жазылған?",
      options: [
        "1928 жылы",
        "1956 жылы",
        "1991 жылы",
        "2000 жылы",
      ],
      answer: "1928 жылы",
    },
    {
      question: "Шығармада қандай мәселе көрініс табады?",
      options: [
        "Отарлау саясаты мен халықтың ауыр тұрмысы",
        "Ғарыш зерттеуі",
        "Спорт жарысы",
        "Теңіз саяхаты",
      ],
      answer: "Отарлау саясаты мен халықтың ауыр тұрмысы",
    },
    {
      question: "Шығармадағы негізгі рухани идеялардың бірі қандай?",
      options: [
        "Халықтың еркіндікке ұмтылысы",
        "Байлыққа ұмтылу",
        "Тек жеке бас пайдасы",
        "Ойын-сауық",
      ],
      answer: "Халықтың еркіндікке ұмтылысы",
    },
  ],

  "Өгей бала": [
    {
      question: "«Өгей бала» шығармасының авторы кім?",
      options: [
        "Джеймс Гринвуд",
        "Ж.К. Роулинг",
        "Мұхтар Әуезов",
        "Оралхан Бөкей",
      ],
      answer: "Джеймс Гринвуд",
    },
    {
      question: "«Өгей бала» шығармасының басты кейіпкері кім?",
      options: ["Джим", "Хәрри", "Қожа", "Аян"],
      answer: "Джим",
    },
    {
      question: "Джим не себепті үйінен қашып кетеді?",
      options: [
        "Өгей шешесі мен қатыгез әкесінің қысымынан",
        "Саяхатқа шыққысы келгендіктен",
        "Мектепке барғысы келгендіктен",
        "Спорт жарысына қатысу үшін",
      ],
      answer: "Өгей шешесі мен қатыгез әкесінің қысымынан",
    },
    {
      question: "Шығармада қандай әлеуметтік мәселе көтеріледі?",
      options: [
        "Жоқшылық пен кезбеліктің адам тағдырына әсері",
        "Ғарышқа ұшу",
        "Спорттық жарыс",
        "Табиғатты зерттеу",
      ],
      answer: "Жоқшылық пен кезбеліктің адам тағдырына әсері",
    },
    {
      question: "Джимнің бойындағы жағымды қасиеттердің бірі қандай?",
      options: [
        "Адалдық",
        "Қатыгездік",
        "Мақтаншақтық",
        "Жалқаулық",
      ],
      answer: "Адалдық",
    },
  ],

  "Хәрри Поттер": [
    {
      question: "«Хәрри Поттер» шығармалар сериясының авторы кім?",
      options: [
        "Ж.К. Роулинг",
        "Джеймс Гринвуд",
        "Оралхан Бөкей",
        "Мұхтар Әуезов",
      ],
      answer: "Ж.К. Роулинг",
    },
    {
      question: "Хәрри Поттер қай мектепте білім алады?",
      options: [
        "Хогуартс",
        "Кембридж",
        "Оксфорд",
        "Нарния",
      ],
      answer: "Хогуартс",
    },
    {
      question: "Хәрридің жақын достары кімдер?",
      options: [
        "Рон Уизли мен Хәрмиона Грейнджер",
        "Джим мен Қожа",
        "Аян мен Құрмаш",
        "Тастан мен Салтанат",
      ],
      answer: "Рон Уизли мен Хәрмиона Грейнджер",
    },
    {
      question: "Хәрри Поттердің негізгі қарсыластарының бірі кім?",
      options: [
        "Волдеморт",
        "Дамблдор",
        "Хагрид",
        "Рон Уизли",
      ],
      answer: "Волдеморт",
    },
    {
      question: "«Хәрри Поттер» шығармалары қай жанрға жатады?",
      options: [
        "Қиял-ғажайып",
        "Деректі очерк",
        "Тарихи шежіре",
        "Ғылыми мақала",
      ],
      answer: "Қиял-ғажайып",
    },
  ],
};

function getQuestionsForBook(
  title: string
): Question[] | undefined {
  const cleanedTitle = title
    .trim()
    .replace(/\s+/g, " ");

  if (questionBank[cleanedTitle]) {
    return questionBank[cleanedTitle];
  }

  const aliases: Record<string, string> = {
    "хэри поттер": "Хәрри Поттер",
    "хэри потер": "Хәрри Поттер",
    "хәрри поттер": "Хәрри Поттер",
    "харри поттер": "Хәрри Поттер",
    "гарри поттер": "Хәрри Поттер",
    "harry potter": "Хәрри Поттер",

    "әкеңде бала болған": "Әкең де бала болған",
    "әкең де бала болған": "Әкең де бала болған",
  };

  const canonicalTitle =
    aliases[cleanedTitle.toLowerCase()];

  if (!canonicalTitle) {
    return undefined;
  }

  return questionBank[canonicalTitle];
}

function shuffleArray<T>(items: T[]): T[] {
  const result = [...items];

  for (
    let i = result.length - 1;
    i > 0;
    i--
  ) {
    const j = Math.floor(
      Math.random() * (i + 1)
    );

    [result[i], result[j]] = [
      result[j],
      result[i],
    ];
  }

  return result;
}

export default function TestPage() {
  const [book, setBook] =
    useState<Book | null>(null);

  const [answers, setAnswers] =
    useState<string[]>([]);

  const [score, setScore] =
    useState<number | null>(null);

  const [correctCount, setCorrectCount] =
    useState(0);

  const [saving, setSaving] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const questions = useMemo(() => {
    if (!book) {
      return undefined;
    }

    const originalQuestions =
      getQuestionsForBook(book.title);

    if (!originalQuestions) {
      return undefined;
    }

    return originalQuestions.map(
      (question) => ({
        ...question,
        options: shuffleArray(
          question.options
        ),
      })
    );
  }, [book]);

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

    const savedBook =
      localStorage.getItem(
        "smartOqyrmanCurrentBook"
      );

    if (savedBook) {
      try {
        const parsedBook =
          JSON.parse(savedBook);

        if (
          parsedBook?.id &&
          parsedBook?.title
        ) {
          setBook(parsedBook);
          setLoading(false);
          return;
        }
      } catch {
        localStorage.removeItem(
          "smartOqyrmanCurrentBook"
        );
      }
    }

    const {
      data: progress,
      error: progressError,
    } = await supabase
      .from("reading_progress")
      .select("book_id, updated_at")
      .eq("student_id", user.id)
      .order("updated_at", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();

    if (progressError) {
      console.error(progressError);
      setLoading(false);
      return;
    }

    if (!progress) {
      setLoading(false);
      return;
    }

    const {
      data: selectedBook,
      error: bookError,
    } = await supabase
      .from("books")
      .select("id, title, author")
      .eq("id", progress.book_id)
      .single();

    if (bookError) {
      console.error(bookError);
      setLoading(false);
      return;
    }

    if (selectedBook) {
      setBook(selectedBook);

      localStorage.setItem(
        "smartOqyrmanCurrentBook",
        JSON.stringify(selectedBook)
      );
    }

    setLoading(false);
  }

  function chooseAnswer(
    questionIndex: number,
    option: string
  ) {
    if (
      score !== null ||
      saving
    ) {
      return;
    }

    const newAnswers = [
      ...answers,
    ];

    newAnswers[questionIndex] =
      option;

    setAnswers(newAnswers);
  }

  async function finishTest() {
    if (!book) {
      return;
    }

    if (!questions) {
      alert(
        "Бұл кітапқа тест әзірге қосылмаған."
      );
      return;
    }

    const unanswered =
      questions.some(
        (_, index) =>
          !answers[index]
      );

    if (unanswered) {
      alert(
        "Барлық 5 сұраққа жауап беріңіз."
      );
      return;
    }

    let correct = 0;

    questions.forEach(
      (question, index) => {
        if (
          answers[index] ===
          question.answer
        ) {
          correct += 1;
        }
      }
    );

    const result =
      correct * 10;

    setSaving(true);

    const supabase =
      createClient();

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      setSaving(false);

      alert(
        "Тест нәтижесін сақтау үшін жүйеге қайта кіріңіз."
      );

      window.location.href =
        "/login";

      return;
    }

    const now =
      new Date().toISOString();

    const { error } =
      await supabase
        .from("test_results")
        .upsert(
          {
            student_id:
              user.id,
            book_id:
              book.id,
            correct_answers:
              correct,
            total_questions: 5,
            score: result,
            max_score: 50,
            completed: true,
            updated_at: now,
          },
          {
            onConflict:
              "student_id,book_id",
          }
        );

    if (error) {
      console.error(error);
      setSaving(false);

      alert(
        "Тест нәтижесін сақтау кезінде қате шықты."
      );

      return;
    }

    const oldResults =
      localStorage.getItem(
        "smartOqyrmanTestResults"
      );

    let results: Record<
      string,
      {
        bookId: number;
        book: string;
        author: string;
        correctAnswers: number;
        totalQuestions: number;
        score: number;
        maxScore: number;
        completed: boolean;
      }
    > = {};

    if (oldResults) {
      try {
        results =
          JSON.parse(oldResults);
      } catch {
        results = {};
      }
    }

    results[book.title] = {
      bookId: book.id,
      book: book.title,
      author: book.author,
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
      JSON.stringify(
        results[book.title]
      )
    );

    setCorrectCount(correct);
    setScore(result);
    setSaving(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-5 py-20">
        <p className="text-center text-lg font-bold text-slate-500">
          Тест жүктелуде...
        </p>
      </main>
    );
  }

  if (!book) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="max-w-md rounded-3xl bg-white p-8 text-center shadow-lg">

          <div className="text-5xl">
            📚
          </div>

          <h1 className="mt-4 text-3xl font-extrabold text-indigo-700">
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

  if (!questions) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="max-w-md rounded-3xl bg-white p-8 text-center shadow-lg">

          <div className="text-5xl">
            📝
          </div>

          <h1 className="mt-4 text-3xl font-extrabold text-indigo-700">
            SMART OQYRMAN
          </h1>

          <h2 className="mt-4 text-xl font-extrabold text-slate-900">
            «{book.title}»
          </h2>

          <p className="mt-3 text-slate-500">
            Бұл кітапқа тест әзірге қосылмаған.
          </p>

          <a
            href="/books"
            className="mt-6 inline-block rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white"
          >
            ← Кітаптарға қайту
          </a>

        </div>
      </main>
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
            ТЕСТ
          </p>

          <h2 className="mt-2 text-3xl font-extrabold">
            «{book.title}»
          </h2>

          <p className="mt-2 text-indigo-100">
            {book.author}
          </p>

          <div className="mt-5 rounded-2xl bg-white/10 p-4">
            <p className="font-bold">
              5 сұрақ × 10 ұпай = 50 ұпай
            </p>

            <p className="mt-2 text-sm text-indigo-100">
              Жауап нұсқалары әр тест ашылған сайын автоматты түрде араласады.
            </p>
          </div>

        </section>

        <section className="mt-7 space-y-6">

          {questions.map(
            (
              question,
              questionIndex
            ) => (
              <div
                key={questionIndex}
                className="rounded-3xl bg-white p-6 shadow-sm"
              >

                <p className="text-sm font-bold text-indigo-600">
                  {questionIndex + 1}
                  -сұрақ
                </p>

                <h3 className="mt-2 text-xl font-extrabold leading-8 text-slate-800">
                  {question.question}
                </h3>

                <div className="mt-5 space-y-3">

                  {question.options.map(
                    (option) => {
                      const selected =
                        answers[
                          questionIndex
                        ] === option;

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
                        option ===
                          question.answer
                      ) {
                        style =
                          "border-emerald-500 bg-emerald-50 text-emerald-700";
                      }

                      if (
                        score !== null &&
                        selected &&
                        option !==
                          question.answer
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
                          disabled={
                            saving ||
                            score !== null
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
            disabled={saving}
            className="mt-7 w-full rounded-xl bg-emerald-600 px-6 py-4 text-lg font-extrabold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? "Нәтиже сақталуда..."
              : "✅ Тестті аяқтау"}
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
              Дұрыс жауап:{" "}
              {correctCount} / 5
            </p>

            <p className="mt-2 text-slate-500">
              ✅ Нәтиже деректер базасына сақталды.
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