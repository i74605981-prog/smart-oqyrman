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

    const { data: profile, error: profileError } =
      await supabase
        .from("profiles")
        .select(
          "id, login, full_name, grade, school, role"
        )
        .eq("id", data.user.id)
        .single();

    if (profileError || !profile) {
      setLoading(false);

      alert(
        "Оқушы профилін жүктеу кезінде қате шықты."
      );

      return;
    }

    const currentStudent = {
      id: profile.id,
      name: profile.full_name,
      grade: profile.grade
        ? `${profile.grade}-сынып`
        : "",
      school: profile.school,
      login: profile.login,
      role: profile.role,
    };

    localStorage.setItem(
      "smartOqyrmanStudent",
      JSON.stringify(currentStudent)
    );

    localStorage.setItem(
      "smartOqyrmanActiveStudentId",
      profile.id
    );

    setLoading(false);

    if (
      profile.role === "teacher" ||
      profile.role === "admin"
    ) {
      window.location.href = "/admin";
      return;
    }

    window.location.href = "/profile";
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10">
      <div className="mx-auto max-w-md">

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

        <section className="mt-8 rounded-[2rem] bg-white p-7 shadow-lg sm:p-9">

          <div className="text-center">
            <div className="text-5xl">
              👤
            </div>

            <h1 className="mt-4 text-3xl font-extrabold text-slate-900">
              Жеке кабинетке кіру
            </h1>

            <p className="mt-2 text-slate-500">
              Логин мен құпиясөзді енгізіңіз
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
                placeholder="Логин"
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
                className="w-full rounded-xl border border-slate-200 px-4 py-4 outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-indigo-600 px-6 py-4 text-lg font-extrabold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Кіруде..."
                : "Кіру →"}
            </button>

          </form>

          <div className="mt-7 border-t border-slate-100 pt-6 text-center">

            <p className="text-sm text-slate-500">
              Әлі тіркелмедіңіз бе?
            </p>

            <a
              href="/register"
              className="mt-3 inline-block rounded-xl bg-indigo-50 px-6 py-3 font-bold text-indigo-700"
            >
              Тіркелу
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