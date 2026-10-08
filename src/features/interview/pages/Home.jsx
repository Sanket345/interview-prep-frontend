import React, { useState, useRef } from "react";
import { useInterview } from "../hooks/useInterview.js";
import { useNavigate } from "react-router";
import { useAuth } from "../../auth/hooks/useAuth";

const scoreBadge = (s) =>
  s >= 80
    ? "bg-emerald-400/10 text-emerald-300 ring-emerald-400/20"
    : s >= 60
      ? "bg-amber-400/10 text-amber-300 ring-amber-400/20"
      : "bg-rose-400/10 text-rose-300 ring-rose-400/20";

const Home = () => {
  const { generateReport, reports } = useInterview();
  const { handleLogout } = useAuth();
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const [generating, setGenerating] = useState(false);
  const resumeInputRef = useRef();

  const navigate = useNavigate();

  const handleGenerateReport = async () => {
    const resumeFile = resumeInputRef.current.files[0];
    setGenerating(true);
    try {
      const data = await generateReport({
        jobDescription,
        selfDescription,
        resumeFile,
      });
      if (data?._id) navigate(`/interview/${data._id}`);
    } finally {
      setGenerating(false);
    }
  };

  const canSubmit =
    jobDescription.trim() && (fileName || selfDescription.trim());

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      {generating && (
        <div className="fixed inset-0 z-10 grid place-items-center bg-ink-950/90 px-4">
          <div className="text-center">
            <div className="mx-auto size-9 animate-spin rounded-full border-2 border-ink-700 border-t-brand-400" />
            <h1 className="mt-5 text-lg font-semibold">
              Building your interview plan
            </h1>
            <p className="mt-1 text-sm text-ink-400">
              This usually takes about 30 seconds.
            </p>
          </div>
        </div>
      )}

      <div className="mb-6 flex justify-end">
        <button
          onClick={handleLogout}
          className="cursor-pointer rounded-lg border border-ink-600 px-3.5 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-brand-500 hover:text-white"
        >
          Log out
        </button>
      </div>

      <header className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Prepare for the interview you actually have
        </h1>
        <p className="mx-auto mt-3.5 max-w-xl text-base leading-relaxed text-ink-400">
          Paste a job description and add your resume. We'll build questions,
          answers, and a day-by-day study plan.
        </p>
      </header>

      <section className="card mt-10 overflow-hidden">
        <div className="grid divide-y divide-ink-700 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
          {/* Job description */}
          <div className="flex flex-col p-6 sm:p-7">
            <div className="mb-3.5 flex items-center justify-between">
              <label htmlFor="jobDescription" className="font-semibold">
                Job description
              </label>
              <span className="rounded-full bg-brand-900 px-2.5 py-0.5 text-xs text-brand-400">
                Required
              </span>
            </div>
            <textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              maxLength={5000}
              placeholder="Paste the full job description here..."
              className="field-input min-h-72 flex-1 resize-none leading-relaxed"
            />
            <p className="mt-2 text-right text-xs text-ink-400">
              {jobDescription.length} / 5000
            </p>
          </div>

          {/* Profile */}
          <div className="p-6 sm:p-7">
            <h2 className="mb-3.5 font-semibold">Your profile</h2>

            <label
              htmlFor="resume"
              className="flex cursor-pointer flex-col items-center rounded-xl border border-dashed border-ink-600 bg-ink-900 px-4 py-8 text-center transition-colors hover:border-brand-500 has-[:focus-visible]:border-brand-500"
            >
              {fileName ? (
                <p className="max-w-full truncate text-sm font-medium text-brand-400">
                  {fileName}
                </p>
              ) : (
                <>
                  <p className="text-sm font-medium">Upload your resume</p>
                  <p className="mt-1 text-xs text-ink-400">
                    PDF or DOCX, up to 5 MB
                  </p>
                </>
              )}
              <input
                ref={resumeInputRef}
                onChange={(e) => setFileName(e.target.files[0]?.name || "")}
                className="sr-only"
                type="file"
                id="resume"
                name="resume"
                accept=".pdf,.docx"
              />
            </label>

            <div className="my-5 flex items-center gap-3 text-xs text-ink-400">
              <span className="h-px flex-1 bg-ink-700" />
              or describe yourself
              <span className="h-px flex-1 bg-ink-700" />
            </div>

            <textarea
              onChange={(e) => setSelfDescription(e.target.value)}
              id="selfDescription"
              name="selfDescription"
              value={selfDescription}
              aria-label="Self description"
              placeholder="Your experience, key skills, and years in the field..."
              className="field-input h-28 resize-none leading-relaxed"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-ink-700 bg-ink-900 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <span className="text-sm text-ink-400">Takes about 30 seconds</span>
          <button
            onClick={handleGenerateReport}
            disabled={!canSubmit}
            className="btn-primary"
          >
            Generate interview plan
          </button>
        </div>
      </section>

      {/* Recent plans */}
      {reports.length > 0 && (
        <section className="mt-14">
          <h2 className="text-lg font-semibold">Your recent plans</h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reports.map((report) => (
              <li key={report._id}>
                <button
                  onClick={() => navigate(`/interview/${report._id}`)}
                  className="card flex h-full w-full cursor-pointer flex-col items-start p-5 text-left transition-colors hover:border-brand-500 focus-visible:outline-2 focus-visible:outline-brand-400"
                >
                  <h3 className="line-clamp-2 font-semibold">
                    {report.title || "Untitled position"}
                  </h3>
                  <p className="mt-1 text-sm text-ink-400">
                    Created {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                  <span
                    className={`mt-4 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${scoreBadge(report.matchScore)}`}
                  >
                    {report.matchScore}% match
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <footer className="mt-16 flex justify-center gap-6 text-sm text-ink-400">
        <a href="#" className="hover:text-slate-200">
          Privacy Policy
        </a>
        <a href="#" className="hover:text-slate-200">
          Terms of Service
        </a>
        <a href="#" className="hover:text-slate-200">
          Help Center
        </a>
      </footer>
    </div>
  );
};

export default Home;
