"use client";

import { FormEvent, useState } from "react";

type StudentAccount = {
  id: string;
  name: string;
  grade: string;
  school: string;
  login: string;
  password: string;
};

type CurrentStudent = {
  id: string;
  name: string;
  grade: string;
  school: string;
  login: string;
};

type Book = {
  id: number;
  title: string;
  author: string;
};

type StudentProgress = {
  currentBook?: Book | null;
  history: Book[];
  readingResults: Record<string, unknown>;
  testResults: Record<string, unknown>;
  creativeResults: Record<string, unknown>;
  reviewResults: Record<string, unknown>;
};

export default function LoginPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  function saveCurrentStudentProgress() {
    const currentStudentString =
      localStorage.getItem("smartOqyrmanStudent");

    if (!currentStudentString) {
      return;
    }

    const currentStudent = JSON.parse(currentStudentString);

    const currentId =
      localStorage.getItem("smartOqyrmanActiveStudentId") ||
      currentStudent.id;

    if (!currentId) {
      return;
    }

    const allProgress = JSON.parse(
      localStorage.getItem("smartOqyrmanStudentData") || "{}"
    );

    const currentBookString =
      localStorage.getItem("smartOqyrmanCurrentBook");

    allProgress[currentId] = {
      currentBook: currentBookString
        ? JSON.parse(currentBookString)
        : null,

      history: JSON.parse(
        localStorage.getItem("smartOqyrmanBookHistory") || "[]"
      ),

      readingResults: JSON.parse(
        localStorage.getItem("smartOqyrmanReadingResults") || "{}"
      ),

      testResults: JSON.parse(
        localStorage.getItem("smartOqyrmanTestResults") || "{}"
      ),

      creativeResults: JSON.parse(
        localStorage.getItem("smartOqyrmanCreativeResults") || "{}"
      ),

      reviewResults: JSON.parse(
        localStorage.getItem("smartOqyrmanReviewResults") || "{}"
      ),
    };

    localStorage.setItem(
      "smartOqyrmanStudentData",
      JSON.stringify(allProgress)
    );
  }

  function clearCurrentProgress() {
    localStorage.removeItem("smartOqyrmanCurrentBook");
    localStorage.removeItem("smartOqyrmanBookHistory");
    localStorage.removeItem("smartOqyrmanReadingResults");
    localStorage.removeItem("smartOqyrmanTestResults");
    localStorage.removeItem("smartOqyrmanTestResult");
    localStorage.removeItem("smartOqyrmanCreativeResults");
    localStorage.removeItem("smartOqyrmanCreativeResult");
    localStorage.removeItem("smartOqyrmanReviewResults");
    localStorage.removeItem("smartOqyrmanReviewResult");
    localStorage.removeItem("smartOqyrmanReadingStatus");
  }

  function loadStudentProgress(studentId: string) {
    clearCurrentProgress();

    const allProgress: Record<string, StudentProgress> =
      JSON.parse(
        localStorage.getItem("smartOqyrmanStudentData") || "{}"
      );

    const progress = allProgress[studentId];

    if (!progress) {
      return;
    }

    if (progress.currentBook) {
      localStorage.setItem(
        "smartOqyrmanCurrentBook",
        JSON.stringify(progress.currentBook)
      );
    } else if (
      progress.history &&
      progress.history.length > 0
    ) {
      const lastBook =
        progress.history[progress.history.length - 1];

      localStorage.setItem(
        "smartOqyrmanCurrentBook",
        JSON.stringify(lastBook)
      );
    }

    localStorage.setItem(
      "smartOqyrmanBookHistory",
      JSON.stringify(progress.history || [])
    );

    localStorage.setItem(
      "smartOqyrmanReadingResults",
      JSON.stringify(progress.readingResults || {})
    );

    localStorage.setItem(
      "smartOqyrmanTestResults",
      JSON.stringify(progress.testResults || {})
    );

    localStorage.setItem(
      "smartOqyrmanCreativeResults",
      JSON.stringify(progress.creativeResults || {})
    );

    localStorage.setItem(
      "smartOqyrmanReviewResults",
      JSON.stringify(progress.reviewResults || {})
    );
  }

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanLogin = login.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanLogin || !cleanPassword) {
      alert("Логин мен құпиясөзді енгізіңіз.");
      return;
    }

    const students: StudentAccount[] = JSON.parse(
      localStorage.getItem("smartOqyrmanStudents") || "[]"
    );

    const foundStudent = students.find(
      (student) =>
        student.login.toLowerCase() === cleanLogin &&
        student.password === cleanPassword
    );

    if (!foundStudent) {
      alert("Логин немесе құпиясөз дұрыс емес.");
      return;
    }

    // Алдыңғы оқушының нәтижесін сақтаймыз
    saveCurrentStudentProgress();

    // Кіретін оқушының нәтижесін жүктейміз
    loadStudentProgress(foundStudent.id);

    const currentStudent: CurrentStudent = {
      id: foundStudent.id,
      name: foundStudent.name,
      grade: foundStudent.grade,
      school: foundStudent.school,
      login: foundStudent.login,
    };

    localStorage.setItem(
      "smartOqyrmanStudent",
      JSON.stringify(currentStudent)
    );

    localStorage.setItem(
      "smartOqyrmanActiveStudentId",
      foundStudent.id
    );

    alert(
      `Қош келдің, ${foundStudent.name}!`
    );

    window.location.href = "/profile";
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10">
      <div className="mx-auto max-w-lg">

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

        <section className="mt-8 rounded-[2rem] bg-white p-8 shadow-lg">

          <div className="text-center">
            <div className="text-5xl">
              👤
            </div>

            <h1 className="mt-4 text-3xl font-extrabold text-slate-900">
              Жеке кабинетке кіру
            </h1>

            <p className="mt-2 text-slate-500">
              2026–2027 оқу жылы
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
                placeholder="Логиніңізді енгізіңіз"
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
                placeholder="Құпиясөзді енгізіңіз"
                className="w-full rounded-xl border border-slate-200 px-4 py-4 outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-indigo-600 px-6 py-4 text-lg font-extrabold text-white hover:bg-indigo-700"
            >
              Кіру →
            </button>

          </form>

          <div className="mt-7 border-t border-slate-100 pt-6 text-center">

            <p className="text-sm text-slate-500">
              Әлі тіркелмедің бе?
            </p>

            <a
              href="/register"
              className="mt-3 inline-block rounded-xl bg-indigo-50 px-6 py-3 font-bold text-indigo-700"
            >
              Жаңа оқушыны тіркеу
            </a>

          </div>

        </section>

      </div>
    </main>
  );
}