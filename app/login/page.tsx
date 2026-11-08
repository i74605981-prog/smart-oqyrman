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

    const metadataRole =
      data.user.user_metadata?.role;

    let finalRole =
      profile.role || "student";

    if (
      metadataRole === "teacher" &&
      profile.role !== "teacher" &&
      profile.role !== "admin"
    ) {
      finalRole = "teacher";

      await supabase
        .from("profiles")
        .update({
          role: "teacher",
          grade: null,
        })
        .eq("id", data.user.id);
    }

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

    localStorage.setItem(
      "smartOqyrmanCurrentUser",
      JSON.stringify(currentUser)
    );

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
      localStorage.removeItem(
        "smartOqyrmanStudent"
      );

      localStorage.removeItem(
        "smartOqyrmanActiveStudentId"
      );
    }

    setLoading(false);

    if (finalRole === "admin") {
      window.location.href = "/admin";
      return;
    }

    if (finalRole === "teacher") {
      window.location.href = "/teacher";
      return;
    }

    window.location.href = "/profile";
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-50 px-5 py-10">

      <div className="w-full max-w-md">

        <div className="text-center">

          <a
            href="/"
            className="text-3xl font-black text-indigo-700"
          >
            SMART OQYRMAN
          </a>

          <p className="mt-2 text-slate-500">
            Кітап оқы. Ойлан. Талда. Дамы.
          </p>

        </div>

        <section className="mt-8 rounded-[2rem] border border-indigo-100 bg-white p-8 shadow-xl">

          <div className="text-center">

            <div className="text-5xl">
              🔐
            </div>

            <h1 className="mt-4 text-3xl font-black text-indigo-950">
              Жүйеге кіру
            </h1>

            <p className="mt-3 leading-6 text-slate-500">
              Тіркелген логиніңіз бен
              құпиясөзіңізді енгізіңіз.
            </p>

          </div>

          <form
            onSubmit={handleLogin}
            className="mt-8 space-y-5"
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
                placeholder="Логиніңіз"
                autoComplete="username"
                className="w-full rounded-xl border border-slate-200 px-4 py-4 outline-none focus:border-indigo-500"
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
                className="w-full rounded-xl border border-slate-200 px-4 py-4 outline-none focus:border-indigo-500"
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-4 text-lg font-black text-white shadow-md disabled:opacity-60"
            >
              {loading
                ? "Кіруде..."
                : "Кабинетке кіру →"}
            </button>

          </form>

          <div className="mt-6 rounded-2xl bg-indigo-50 p-4 text-center">

            <p className="text-sm leading-6 text-indigo-700">
              ✨ Жүйе сіздің
              <b> оқушы немесе мұғалім </b>
              екеніңізді автоматты түрде анықтайды.
            </p>

          </div>

          <div className="mt-6 border-t border-slate-100 pt-6 text-center">

            <p className="text-sm text-slate-500">
              SMART OQYRMAN-ға алғаш рет келдіңіз бе?
            </p>

            <a
              href="/register"
              className="mt-3 inline-block font-black text-indigo-600"
            >
              Тіркелу →
            </a>

          </div>

        </section>

      </div>

    </main>
  );
}