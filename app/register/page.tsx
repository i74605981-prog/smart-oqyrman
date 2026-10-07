"use client";

import { FormEvent, useState } from "react";
import { createClient } from "../../utils/supabase/client";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [school, setSchool] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const cleanName = name.trim();
    const cleanGrade = grade.trim();
    const cleanSchool = school.trim();
    const cleanLogin = login
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "");

    const cleanPassword = password.trim();

    if (
      !cleanName ||
      !cleanGrade ||
      !cleanSchool ||
      !cleanLogin ||
      !cleanPassword
    ) {
      alert("Барлық жолды толтырыңыз.");
      return;
    }

    if (cleanPassword.length < 6) {
      alert("Құпиясөз кемінде 6 таңбадан тұруы керек.");
      return;
    }

    setLoading(true);

    const supabase = createClient();

    // Оқушы email енгізбейді.
    // Логин Supabase Auth үшін ішкі email-ға айналады.
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
          grade: cleanGrade,
          school: cleanSchool,
        },
      },
    });

    if (error) {
      setLoading(false);

      if (
        error.message.toLowerCase().includes("already")
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
        "Оқушы тіркелмеді. Қайтадан көріңіз."
      );

      return;
    }

    // Қазіргі сайттағы беттер уақытша жұмысын жалғастыру үшін
    // оқушы туралы негізгі ақпарат localStorage-қа да сақталады.
    const currentStudent = {
      id: data.user.id,
      name: cleanName,
      grade: `${cleanGrade}-сынып`,
      school: cleanSchool,
      login: cleanLogin,
    };

    localStorage.setItem(
      "smartOqyrmanStudent",
      JSON.stringify(currentStudent)
    );

    localStorage.setItem(
      "smartOqyrmanActiveStudentId",
      data.user.id
    );

    setLoading(false);

    // Егер Supabase бірден сессия берсе
    if (data.session) {
      alert(
        `${cleanName}, SMART OQYRMAN платформасына сәтті тіркелдіңіз!`
      );

      window.location.href = "/profile";
      return;
    }

    // Email confirmation қосулы болса
    alert(
      "Оқушы тіркелді. Енді жүйеге кіру бетіне өтеміз."
    );

    window.location.href = "/login";
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10">
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

        {/* CARD */}
        <section className="mt-8 rounded-[2rem] bg-white p-7 shadow-lg sm:p-10">

          <div className="text-center">

            <div className="text-5xl">
              📚
            </div>

            <h1 className="mt-4 text-3xl font-extrabold text-slate-900">
              Оқушыны тіркеу
            </h1>

            <p className="mt-2 text-slate-500">
              2026–2027 оқу жылы
            </p>

          </div>

          <form
            onSubmit={handleRegister}
            className="mt-8 space-y-5"
          >

            {/* NAME */}
            <div>

              <label className="mb-2 block font-bold text-slate-700">
                Оқушының аты-жөні
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Мысалы: Мұхтар Назерке"
                className="w-full rounded-xl border border-slate-200 px-4 py-4 outline-none focus:border-indigo-500"
              />

            </div>

            {/* GRADE */}
            <div>

              <label className="mb-2 block font-bold text-slate-700">
                Сыныбы
              </label>

              <select
                value={grade}
                onChange={(event) =>
                  setGrade(event.target.value)
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

            {/* SCHOOL */}
            <div>

              <label className="mb-2 block font-bold text-slate-700">
                Мектеп
              </label>

              <input
                type="text"
                value={school}
                onChange={(event) =>
                  setSchool(event.target.value)
                }
                placeholder="Мектеп атауы"
                className="w-full rounded-xl border border-slate-200 px-4 py-4 outline-none focus:border-indigo-500"
              />

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
                  setLogin(event.target.value)
                }
                placeholder="Мысалы: nazерке7"
                className="w-full rounded-xl border border-slate-200 px-4 py-4 outline-none focus:border-indigo-500"
              />

              <p className="mt-2 text-sm text-slate-400">
                Әр оқушының логині қайталанбауы керек.
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
                  setPassword(event.target.value)
                }
                placeholder="Кемінде 6 таңба"
                className="w-full rounded-xl border border-slate-200 px-4 py-4 outline-none focus:border-indigo-500"
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-indigo-600 px-6 py-4 text-lg font-extrabold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Тіркелуде..."
                : "✅ Тіркелу"}
            </button>

          </form>

          {/* LOGIN */}
          <div className="mt-7 border-t border-slate-100 pt-6 text-center">

            <p className="text-sm text-slate-500">
              Бұрын тіркелдіңіз бе?
            </p>

            <a
              href="/login"
              className="mt-3 inline-block rounded-xl bg-indigo-50 px-6 py-3 font-bold text-indigo-700"
            >
              Жеке кабинетке кіру →
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