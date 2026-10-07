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

type StudentProgress = {
  history: unknown[];
  readingResults: Record<string, unknown>;
  testResults: Record<string, unknown>;
  creativeResults: Record<string, unknown>;
  reviewResults: Record<string, unknown>;
};

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [school, setSchool] = useState("");
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
      currentStudent.id ||
      currentStudent.login?.toLowerCase();

    if (!currentId) {
      return;
    }

    const allProgress = JSON.parse(
      localStorage.getItem("smartOqyrmanStudentData") || "{}"
    );

    allProgress[currentId] = {
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

  function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanName = name.trim();
    const cleanGrade = grade.trim();
    const cleanSchool = school.trim();
    const cleanLogin = login.trim().toLowerCase();
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

    if (cleanPassword.length < 4) {
      alert("Құпиясөз кемінде 4 таңбадан тұруы керек.");
      return;
    }

    const students: StudentAccount[] = JSON.parse(
      localStorage.getItem("smartOqyrmanStudents") || "[]"
    );

    const loginExists = students.some(
      (student) => student.login.toLowerCase() === cleanLogin
    );

    if (loginExists) {
      alert(
        "Бұл логин бұрын тіркелген. Басқа логин таңдаңыз."
      );
      return;
    }

    // Бұрын кіріп тұрған оқушының нәтижесін сақтаймыз
    saveCurrentStudentProgress();

    const studentId =
      `${cleanLogin}-${Date.now()}`;

    const newStudent: StudentAccount = {
      id: studentId,
      name: cleanName,
      grade: cleanGrade,
      school: cleanSchool,
      login: cleanLogin,
      password: cleanPassword,
    };

    students.push(newStudent);

    localStorage.setItem(
      "smartOqyrmanStudents",
      JSON.stringify(students)
    );

    // Жаңа оқушыға жеке бос оқу кеңістігін дайындаймыз
    const allProgress: Record<string, StudentProgress> =
      JSON.parse(
        localStorage.getItem("smartOqyrmanStudentData") || "{}"
      );

    allProgress[studentId] = {
      history: [],
      readingResults: {},
      testResults: {},
      creativeResults: {},
      reviewResults: {},
    };

    localStorage.setItem(
      "smartOqyrmanStudentData",
      JSON.stringify(allProgress)
    );

    // Жаңа оқушы белсенді оқушы болады
    const currentStudent: CurrentStudent = {
      id: studentId,
      name: cleanName,
      grade: cleanGrade,
      school: cleanSchool,
      login: cleanLogin,
    };

    localStorage.setItem(
      "smartOqyrmanStudent",
      JSON.stringify(currentStudent)
    );

    localStorage.setItem(
      "smartOqyrmanActiveStudentId",
      studentId
    );

    // Жаңа оқушы бұрынғы оқушының нәтижесін көрмеуі керек
    clearCurrentProgress();

    alert(
      `${cleanName}, SMART OQYRMAN платформасына сәтті тіркелдіңіз!`
    );

    window.location.href = "/profile";
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

                <option value="5-сынып">
                  5-сынып
                </option>

                <option value="6-сынып">
                  6-сынып
                </option>

                <option value="7-сынып">
                  7-сынып
                </option>

                <option value="8-сынып">
                  8-сынып
                </option>

                <option value="9-сынып">
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
                placeholder="Кемінде 4 таңба"
                className="w-full rounded-xl border border-slate-200 px-4 py-4 outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-indigo-600 px-6 py-4 text-lg font-extrabold text-white hover:bg-indigo-700"
            >
              ✅ Тіркелу
            </button>

          </form>

          <div className="mt-7 rounded-2xl bg-indigo-50 p-5">

            <p className="font-bold text-indigo-700">
              📖 Тіркелгеннен кейін
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Оқушы жеке кабинетке кіріп, кітап таңдап,
              оқу тапсырмаларын орындай алады.
            </p>

          </div>

        </section>

        <p className="mt-6 text-center text-sm text-slate-400">
          SMART OQYRMAN · 2026–2027
        </p>

      </div>
    </main>
  );
}