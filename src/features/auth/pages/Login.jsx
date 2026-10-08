import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const { loading, handleLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await handleLogin({ email, password });
    if (ok) navigate("/");
  };

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center">
        <div className="size-8 animate-spin rounded-full border-2 border-ink-700 border-t-brand-400" />
      </main>
    );
  }

  return (
    <main className="grid min-h-screen place-items-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-ink-400">
            Log in to see your interview plans.
          </p>
        </div>

        <div className="card p-6 sm:p-7">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="field-label">
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                id="email"
                name="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="field-input"
              />
            </div>
            <div>
              <label htmlFor="password" className="field-label">
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                id="password"
                name="password"
                required
                autoComplete="current-password"
                placeholder="Enter your password"
                className="field-input"
              />
            </div>
            <button className="btn-primary w-full">Log in</button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-ink-400">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-brand-400 hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
