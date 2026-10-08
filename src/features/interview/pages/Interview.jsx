import React, { useState } from "react";
import { useInterview } from "../hooks/useInterview.js";
import { useParams, Link } from "react-router";
import { useAuth } from "../../auth/hooks/useAuth";

const NAV_ITEMS = [
  { id: "technical", label: "Technical questions" },
  { id: "behavioral", label: "Behavioral questions" },
  { id: "roadmap", label: "Study plan" },
];

const SEVERITY = {
  high: "bg-rose-400/10 text-rose-300 ring-rose-400/20",
  medium: "bg-amber-400/10 text-amber-300 ring-amber-400/20",
  low: "bg-sky-400/10 text-sky-300 ring-sky-400/20",
};

// ── Sub-components ────────────────────────────────────────────────────────────
const QuestionCard = ({ item, index }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-start gap-4 p-5 text-left transition-colors hover:bg-ink-900"
      >
        <span className="mt-0.5 shrink-0 rounded-md bg-brand-900 px-2 py-0.5 text-xs font-semibold text-brand-400">
          Q{index + 1}
        </span>
        <p className="flex-1 font-medium leading-relaxed">{item.question}</p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`mt-1 size-4 shrink-0 text-ink-400 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div className="space-y-5 border-t border-ink-700 bg-ink-900 p-5 text-sm leading-relaxed">
          <div>
            <h4 className="mb-1 font-semibold text-slate-100">
              What they're looking for
            </h4>
            <p className="text-slate-400">{item.intention}</p>
          </div>
          <div>
            <h4 className="mb-1 font-semibold text-slate-100">Model answer</h4>
            <p className="text-slate-400">{item.answer}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const RoadMapDay = ({ day }) => (
  <div className="card p-5">
    <div className="flex items-center gap-3">
      <span className="rounded-md bg-brand-500 px-2.5 py-1 text-xs font-semibold text-ink-950">
        Day {day.day}
      </span>
      <h3 className="font-semibold">{day.focus}</h3>
    </div>
    <ul className="mt-4 space-y-2.5">
      {day.tasks.map((task, i) => (
        <li
          key={i}
          className="flex gap-3 text-sm leading-relaxed text-slate-400"
        >
          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-500" />
          {task}
        </li>
      ))}
    </ul>
  </div>
);

const SectionHeader = ({ title, meta }) => (
  <div className="mb-5 flex items-baseline justify-between gap-4">
    <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
    <span className="text-sm text-ink-400">{meta}</span>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const Interview = () => {
  const [activeNav, setActiveNav] = useState("technical");
  const { report, loading, getResumePdf } = useInterview();
  const { handleLogout } = useAuth();
  const { interviewId } = useParams();

  if (loading || !report) {
    return (
      <main className="grid min-h-screen place-items-center">
        <div className="text-center">
          <div className="mx-auto size-9 animate-spin rounded-full border-2 border-ink-700 border-t-brand-400" />
          <h1 className="mt-5 text-sm font-medium text-ink-400">
            Loading your interview plan...
          </h1>
        </div>
      </main>
    );
  }

  const score = report.matchScore;
  const scoreColor =
    score >= 80 ? "#2bb98a" : score >= 60 ? "#f5b94a" : "#f87a8a";
  const scoreText =
    score >= 80
      ? "Strong match for this role"
      : score >= 60
        ? "Good match with a few gaps"
        : "Needs focused preparation";

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
      <div className="flex items-center justify-between">
        <Link to="/" className="text-sm text-ink-400 hover:text-slate-200">
          ‹ All plans
        </Link>
        <button
          onClick={handleLogout}
          className="cursor-pointer rounded-lg border border-ink-600 px-3.5 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-brand-500 hover:text-white"
        >
          Log out
        </button>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[210px_minmax(0,1fr)_270px]">
        {/* ── Left nav ── */}
        <nav className="lg:sticky lg:top-8 lg:self-start">
          <div className="flex gap-1 overflow-x-auto lg:flex-col">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`shrink-0 cursor-pointer rounded-lg px-3.5 py-2.5 text-left text-sm font-medium transition-colors ${
                  activeNav === item.id
                    ? "bg-brand-900 text-brand-400"
                    : "text-slate-400 hover:bg-ink-800"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => getResumePdf(interviewId)}
            className="btn-primary mt-4 hidden w-full lg:inline-flex"
          >
            Download resume
          </button>
        </nav>

        {/* ── Center content ── */}
        <main className="min-w-0">
          {activeNav === "technical" && (
            <section>
              <SectionHeader
                title="Technical questions"
                meta={`${report.technicalQuestions.length} questions`}
              />
              <div className="space-y-3">
                {report.technicalQuestions.map((q, i) => (
                  <QuestionCard key={i} item={q} index={i} />
                ))}
              </div>
            </section>
          )}

          {activeNav === "behavioral" && (
            <section>
              <SectionHeader
                title="Behavioral questions"
                meta={`${report.behavioralQuestions.length} questions`}
              />
              <div className="space-y-3">
                {report.behavioralQuestions.map((q, i) => (
                  <QuestionCard key={i} item={q} index={i} />
                ))}
              </div>
            </section>
          )}

          {activeNav === "roadmap" && (
            <section>
              <SectionHeader
                title="Study plan"
                meta={`${report.preparationPlan.length} days`}
              />
              <div className="space-y-3">
                {report.preparationPlan.map((day) => (
                  <RoadMapDay key={day.day} day={day} />
                ))}
              </div>
            </section>
          )}
        </main>

        {/* ── Right sidebar ── */}
        <aside className="space-y-4 lg:sticky lg:top-8 lg:self-start">
          <div className="card flex flex-col items-center p-6 text-center">
            <h2 className="mb-4 text-sm font-semibold">Match score</h2>
            <div
              className="grid size-32 place-items-center rounded-full"
              style={{
                background: `conic-gradient(${scoreColor} ${score}%, #232e3c 0)`,
              }}
            >
              <div className="grid size-24 place-items-center rounded-full bg-ink-800">
                <span className="text-3xl font-semibold">
                  {score}
                  <span className="text-base text-ink-400">%</span>
                </span>
              </div>
            </div>
            <p className="mt-4 text-sm text-ink-400">{scoreText}</p>
          </div>

          <div className="card p-6">
            <h2 className="mb-3 text-sm font-semibold">Skill gaps</h2>
            {report.skillGaps.length === 0 ? (
              <p className="text-sm text-ink-400">
                No gaps found for this role.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {report.skillGaps.map((gap, i) => (
                  <span
                    key={i}
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${SEVERITY[gap.severity] || SEVERITY.low}`}
                  >
                    {gap.skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => getResumePdf(interviewId)}
            className="btn-primary w-full lg:hidden"
          >
            Download resume
          </button>
        </aside>
      </div>
    </div>
  );
};

export default Interview;
