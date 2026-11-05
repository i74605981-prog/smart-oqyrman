"use client";

import { FormEvent, useState } from "react";
import { createClient } from "../../utils/supabase/client";

export default function LoginPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const cleanLogin = login
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "");

    const cleanPassword = password.trim();

    if (!cleanLogin || !cleanPassword) {
      alert("Логин мен құпиясөзді енгізіңіз.");
      return;
    }

    setLoading(true);

    const supabase = createClient();

    const internalEmail =
      `${cleanLogin}@smart-oqyrman.local`;

    const {
      data,
      error,
    } = await supabase.auth.signInWithPassword({
      email: internalEmail,
      password: cleanPassword,
    });

    if (error || !data.user) {
      setLoading(false);

      alert(
        "Логин немесе құпиясөз қате. Қайта тексеріңіз."
      );

      return;
    }

    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from("profiles")
      .select(
        "id, login, full_name, grade, school, region, district, role"
      )
      .eq("id", data.user.id)
      .single();

    if (profileError || !profile) {
      setLoading(false);

      alert(
        "Пайдаланушы профилін жүктеу кезінде қате шықты."
      );

      return;
    }

    /*
      Тіркелу кезінде Auth metadata-ға сақталған
      рөлді тексереміз.
    */
    const metadataRole =
      data.user.user_metadata?.role;

    let finalRole =
      profile.role || "student";

    /*
      Егер мұғалім ретінде тіркелген,
      бірақ profiles ішінде student болып қалып қойса,
      автоматты түрде teacher қыламыз.
    */
    if (
      metadataRole === "teacher" &&
      profile.role !== "teacher"
    ) {
      finalRole = "teacher";

      const {
        error: roleUpdateError,
      } = await supabase
        .from("profiles")
        .update({
          role: "teacher",
          grade: null,
        })
        .eq("id", data.user.id);

      if (roleUpdateError) {
        console.error(
          "Мұғалім рөлін сақтау қатесі:",
          roleUpdateError
        );
      }
    }

    /*
      Admin рөлін profiles кестесінен аламыз.
    */
    if (profile.role === "admin") {
      finalRole = "admin";
    }

    const currentUser = {
      id: profile.id,
      name: profile.full_name,

      grade:
        finalRole === "student" &&
        profile.grade
          ? `${profile.grade}-сынып`
          : "",

      school: profile.school,
      region: profile.region,
      district: profile.district,
      login: profile.login,
      role: finalRole,
    };

    /*
      Барлық қолданушыға ортақ дерек
    */
    localStorage.setItem(
      "smartOqyrmanCurrentUser",
      JSON.stringify(currentUser)
    );

    /*
      Оқушы болса ғана бұрынғы student
      деректерін сақтаймыз.
    */
    if (finalRole === "student") {
      localStorage.setItem(
        "smartOqyrmanStudent",
        JSON.stringify(currentUser)
      );

      localStorage.setItem(
        "smartOqyrmanActiveStudentId",
        profile.id
      );
    } else {
      /*
        Мұғалім кірсе бұрынғы оқушы
        деректерін тазалаймыз.
      */
      localStorage.removeItem(
        "smartOqyrmanStudent"
      );

      localStorage.removeItem(
        "smartOqyrmanActiveStudentId"
      );
    }

    setLoading(false);

    /*
      ӘКІМШІ
    */
    if (finalRole === "admin") {
      window.location.href = "/admin";
      return;
    }

    /*
      МҰҒАЛІМ
    */
    if (finalRole === "teacher") {
      window.location.href = "/teacher";
      return;
    }

    /*
      ОҚУШЫ
    */
    window.location.href = "/profile";
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-violet-50 px-5 py-10">

      <div className="mx-auto max-w-md">

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
        <section className="mt-8 rounded-[2rem] bg-white p-7 shadow-xl sm:p-9">

          <div className="text-center">

            <div className="text-5xl">
              🔐
            </div>

            <h1 className="mt-4 text-3xl font-extrabold text-slate-900">
              Жүйеге кіру
            </h1>

            <p className="mt-2 leading-6 text-slate-500">
              Оқушы немесе мұғалім ретінде
              тіркелген логиніңізбен кіріңіз
            </p>

          </div>

          {/* ROLE INFO */}
          <div className="mt-6 grid grid-cols-2 gap-3">

            <div className="rounded-2xl bg-indigo-50 p-4 text-center">

              <div className="text-3xl">
                🎓
              </div>

              <p className="mt-2 font-extrabold text-indigo-700">
                Оқушы
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Кітап оқу және тапсырма
              </p>

            </div>

            <div className="rounded-2xl bg-violet-50 p-4 text-center">

              <div className="text-3xl">
                👩‍🏫
              </div>

              <p className="mt-2 font-extrabold text-violet-700">
                Мұғалім
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Сынып және нәтиже
              </p>

            </div>

          </div>

          {/* FORM */}
          <form
            onSubmit={handleLogin}
            className="mt-7 space-y-5"
          >

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
                placeholder="Логиніңізді енгізіңіз"
                autoComplete="username"
                className="w-full rounded-xl border border-slate-200 px-4 py-4 outline-none transition focus:border-indigo-500"
              />

            </div>

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
                placeholder="Құпиясөз"
                autoComplete="current-password"
                className="w-full rounded-xl border border-slate-200 px-4 py-4 outline-none transition focus:border-indigo-500"
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-indigo-600 px-6 py-4 text-lg font-extrabold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Кіруде..."
                : "SMART OQYRMAN-ға кіру →"}
            </button>

          </form>

          {/* REGISTER */}
          <div className="mt-7 border-t border-slate-100 pt-6 text-center">

            <p className="text-sm text-slate-500">
              Әлі тіркелмедіңіз бе?
            </p>

            <a
              href="/register"
              className="mt-3 inline-block rounded-xl bg-indigo-50 px-6 py-3 font-bold text-indigo-700"
            >
              Тіркелу →
            </a>

          </div>

        </section>

        <p className="mt-5 text-center text-sm text-slate-400">
          SMART OQYRMAN · 2026–2027
        </p>

      </div>

    </main>
  );
}