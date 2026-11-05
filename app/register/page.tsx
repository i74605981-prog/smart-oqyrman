"use client";

import { FormEvent, useState } from "react";
import { createClient } from "../../utils/supabase/client";

type UserRole = "student" | "teacher";

export default function RegisterPage() {
  const [role, setRole] =
    useState<UserRole>("student");

  const [name, setName] =
    useState("");

  const [grade, setGrade] =
    useState("");

  const [region, setRegion] =
    useState("");

  const [district, setDistrict] =
    useState("");

  const [school, setSchool] =
    useState("");

  const [login, setLogin] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleRegister(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const cleanName = name.trim();
    const cleanGrade = grade.trim();
    const cleanRegion = region.trim();
    const cleanDistrict = district.trim();
    const cleanSchool = school.trim();

    const cleanLogin = login
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "");

    const cleanPassword =
      password.trim();

    if (
      !cleanName ||
      !cleanRegion ||
      !cleanDistrict ||
      !cleanSchool ||
      !cleanLogin ||
      !cleanPassword
    ) {
      alert(
        "Барлық жолды толтырыңыз."
      );
      return;
    }

    if (
      role === "student" &&
      !cleanGrade
    ) {
      alert(
        "Оқушының сыныбын таңдаңыз."
      );
      return;
    }

    if (cleanPassword.length < 6) {
      alert(
        "Құпиясөз кемінде 6 таңбадан тұруы керек."
      );
      return;
    }

    setLoading(true);

    const supabase =
      createClient();

    const internalEmail =
      `${cleanLogin}@smart-oqyrman.local`;

    const {
      data,
      error,
    } = await supabase.auth.signUp({
      email: internalEmail,
      password: cleanPassword,

      options: {
        data: {
          login: cleanLogin,
          full_name: cleanName,

          grade:
            role === "student"
              ? Number(cleanGrade)
              : null,

          region: cleanRegion,
          district: cleanDistrict,
          school: cleanSchool,
          role: role,
        },
      },
    });

    if (error) {
      setLoading(false);

      if (
        error.message
          .toLowerCase()
          .includes("already")
      ) {
        alert(
          "Бұл логин бұрын тіркелген. Басқа логин таңдаңыз."
        );
        return;
      }

      alert(
        `Тіркелу кезінде қате шықты: ${error.message}`
      );

      return;
    }

    if (!data.user) {
      setLoading(false);

      alert(
        "Тіркелу аяқталмады. Қайтадан көріңіз."
      );

      return;
    }

    /*
      Егер Supabase бірден сессия берсе,
      профильдегі барлық деректі нақтылап сақтаймыз.
    */
    if (data.session) {
      const {
        error: profileError,
      } = await supabase
        .from("profiles")
        .update({
          login: cleanLogin,
          full_name: cleanName,

          grade:
            role === "student"
              ? Number(cleanGrade)
              : null,

          region: cleanRegion,
          district: cleanDistrict,
          school: cleanSchool,
          role: role,
        })
        .eq("id", data.user.id);

      if (profileError) {
        console.error(
          "Профильді жаңарту қатесі:",
          profileError
        );
      }
    }

    /*
      ОҚУШЫНЫҢ уақытша localStorage дерегі
      бұрынғы беттер жұмысын жалғастыру үшін сақталады.
    */
    if (role === "student") {
      const currentStudent = {
        id: data.user.id,
        name: cleanName,
        grade:
          `${cleanGrade}-сынып`,
        region: cleanRegion,
        district: cleanDistrict,
        school: cleanSchool,
        login: cleanLogin,
        role: "student",
      };

      localStorage.setItem(
        "smartOqyrmanStudent",
        JSON.stringify(
          currentStudent
        )
      );

      localStorage.setItem(
        "smartOqyrmanActiveStudentId",
        data.user.id
      );
    }

    /*
      Ортақ қолданушы ақпараты
    */
    const currentUser = {
      id: data.user.id,
      name: cleanName,

      grade:
        role === "student"
          ? `${cleanGrade}-сынып`
          : "",

      region: cleanRegion,
      district: cleanDistrict,
      school: cleanSchool,
      login: cleanLogin,
      role: role,
    };

    localStorage.setItem(
      "smartOqyrmanCurrentUser",
      JSON.stringify(currentUser)
    );

    setLoading(false);

    /*
      ОҚУШЫ
    */
    if (
      role === "student" &&
      data.session
    ) {
      alert(
        `${cleanName}, SMART OQYRMAN платформасына сәтті тіркелдіңіз!`
      );

      window.location.href =
        "/profile";

      return;
    }

    /*
      МҰҒАЛІМ
    */
    if (
      role === "teacher" &&
      data.session
    ) {
      alert(
        `${cleanName}, мұғалім ретінде сәтті тіркелдіңіз!`
      );

      window.location.href =
        "/teacher";

      return;
    }

    /*
      Email confirmation қосулы болса
    */
    alert(
      role === "student"
        ? "Оқушы тіркелді. Енді жүйеге кіріңіз."
        : "Мұғалім тіркелді. Енді жүйеге кіріңіз."
    );

    window.location.href =
      "/login";
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-violet-50 px-5 py-10">

      <div className="mx-auto max-w-2xl">

        {/* HEADER */}
        <div className="text-center">

          <a
            href="/"
            className="text-3xl font-extrabold text-indigo-700"
          >
            SMART OQYRMAN
          </a>

          <p className="mt-2 text-slate-500">
            Кітап оқы. Ойлан. Талда. Дамы.
          </p>

        </div>

        <section className="mt-8 rounded-[2rem] bg-white p-7 shadow-xl sm:p-10">

          <div className="text-center">

            <div className="text-5xl">
              📚
            </div>

            <h1 className="mt-4 text-3xl font-extrabold text-slate-900">
              SMART OQYRMAN-ға тіркелу
            </h1>

            <p className="mt-2 text-slate-500">
              2026–2027 оқу жылы
            </p>

          </div>

          {/* ROLE */}
          <div className="mt-8">

            <p className="mb-3 text-center font-bold text-slate-700">
              Сіз кім ретінде тіркелесіз?
            </p>

            <div className="grid gap-3 sm:grid-cols-2">

              <button
                type="button"
                onClick={() =>
                  setRole("student")
                }
                className={`rounded-2xl border-2 p-5 text-center transition ${
                  role === "student"
                    ? "border-indigo-600 bg-indigo-50 shadow-md"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="text-4xl">
                  🎓
                </div>

                <p className="mt-2 text-lg font-extrabold text-slate-900">
                  Оқушымын
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Кітап оқып, тапсырма орындаймын
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setRole("teacher");
                  setGrade("");
                }}
                className={`rounded-2xl border-2 p-5 text-center transition ${
                  role === "teacher"
                    ? "border-violet-600 bg-violet-50 shadow-md"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="text-4xl">
                  👩‍🏫
                </div>

                <p className="mt-2 text-lg font-extrabold text-slate-900">
                  Мұғаліммін
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Сынып ашып, оқушылардың нәтижесін бақылаймын
                </p>
              </button>

            </div>

          </div>

          <form
            onSubmit={handleRegister}
            className="mt-8 space-y-5"
          >

            {/* NAME */}
            <div>

              <label className="mb-2 block font-bold text-slate-700">
                {role === "student"
                  ? "Оқушының аты-жөні"
                  : "Мұғалімнің аты-жөні"}
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value
                  )
                }
                placeholder={
                  role === "student"
                    ? "Мысалы: Мұхтар Назерке"
                    : "Мысалы: Айгүл Серікқызы"
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-4 outline-none focus:border-indigo-500"
              />

            </div>

            {/* GRADE */}
            {role === "student" && (
              <div>

                <label className="mb-2 block font-bold text-slate-700">
                  Сыныбы
                </label>

                <select
                  value={grade}
                  onChange={(event) =>
                    setGrade(
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-4 outline-none focus:border-indigo-500"
                >

                  <option value="">
                    Сыныпты таңдаңыз
                  </option>

                  <option value="5">
                    5-сынып
                  </option>

                  <option value="6">
                    6-сынып
                  </option>

                  <option value="7">
                    7-сынып
                  </option>

                  <option value="8">
                    8-сынып
                  </option>

                  <option value="9">
                    9-сынып
                  </option>

                </select>

              </div>
            )}

            {/* REGION */}
            <div>

              <label className="mb-2 block font-bold text-slate-700">
                📍 Облыс
              </label>

              <input
                type="text"
                value={region}
                onChange={(event) =>
                  setRegion(
                    event.target.value
                  )
                }
                placeholder="Мысалы: Ақтөбе облысы"
                className="w-full rounded-xl border border-slate-200 px-4 py-4 outline-none focus:border-indigo-500"
              />

            </div>

            {/* DISTRICT */}
            <div>

              <label className="mb-2 block font-bold text-slate-700">
                🏘️ Аудан / қала
              </label>

              <input
                type="text"
                value={district}
                onChange={(event) =>
                  setDistrict(
                    event.target.value
                  )
                }
                placeholder="Мысалы: Шалқар ауданы"
                className="w-full rounded-xl border border-slate-200 px-4 py-4 outline-none focus:border-indigo-500"
              />

            </div>

            {/* SCHOOL */}
            <div>

              <label className="mb-2 block font-bold text-slate-700">
                🏫 Мектеп атауы
              </label>

              <input
                type="text"
                value={school}
                onChange={(event) =>
                  setSchool(
                    event.target.value
                  )
                }
                placeholder="Мектептің толық атауын жазыңыз"
                className="w-full rounded-xl border border-slate-200 px-4 py-4 outline-none focus:border-indigo-500"
              />

              <p className="mt-2 text-sm leading-5 text-slate-400">
                Мектеп атауын өз мектебіңіздегі ресми атауымен жазыңыз.
              </p>

            </div>

            {/* LOGIN */}
            <div>

              <label className="mb-2 block font-bold text-slate-700">
                Логин
              </label>

              <input
                type="text"
                value={login}
                onChange={(event) =>
                  setLogin(
                    event.target.value
                  )
                }
                placeholder={
                  role === "student"
                    ? "Мысалы: nazерке7"
                    : "Мысалы: aigul_teacher"
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-4 outline-none focus:border-indigo-500"
              />

              <p className="mt-2 text-sm text-slate-400">
                Логин басқа қолданушыларда қайталанбауы керек.
              </p>

            </div>

            {/* PASSWORD */}
            <div>

              <label className="mb-2 block font-bold text-slate-700">
                Құпиясөз
              </label>

              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                placeholder="Кемінде 6 таңба"
                className="w-full rounded-xl border border-slate-200 px-4 py-4 outline-none focus:border-indigo-500"
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-xl px-6 py-4 text-lg font-extrabold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                role === "student"
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "bg-violet-600 hover:bg-violet-700"
              }`}
            >
              {loading
                ? "Тіркелуде..."
                : role === "student"
                ? "🎓 Оқушы ретінде тіркелу"
                : "👩‍🏫 Мұғалім ретінде тіркелу"}
            </button>

          </form>

          <div className="mt-7 border-t border-slate-100 pt-6 text-center">

            <p className="text-sm text-slate-500">
              Бұрын тіркелдіңіз бе?
            </p>

            <a
              href="/login"
              className="mt-3 inline-block rounded-xl bg-indigo-50 px-6 py-3 font-bold text-indigo-700"
            >
              Жүйеге кіру →
            </a>

          </div>

        </section>

        <p className="mt-6 text-center text-sm text-slate-400">
          SMART OQYRMAN · 2026–2027
        </p>

      </div>

    </main>
  );
}