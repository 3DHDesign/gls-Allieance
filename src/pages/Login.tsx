// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim()) return setError("Email is required.");
    if (!password.trim()) return setError("Password is required.");

    try {
      setLoading(true);
      await login(email.trim(), password);

      setSuccess("Login successful.");
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Login failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout eyebrow="Welcome back" title="Sign in to your account" description="Use the email and password associated with your GLS Alliance membership.">

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-6 grid gap-4">
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition focus:border-[var(--color-accent-light)] focus:bg-white focus:ring-4 focus:ring-blue-50"
                placeholder="you@company.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition focus:border-[var(--color-accent-light)] focus:bg-white focus:ring-4 focus:ring-blue-50"
                placeholder="password"
                autoComplete="current-password"
              />
              <div className="mt-2 text-xs text-[var(--color-muted)]">
                Use the secure OTP reset flow if you forgot your password.
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[var(--color-accent)] px-4 py-3.5 font-semibold text-white shadow-[0_10px_24px_rgba(1,30,79,0.16)] transition hover:bg-[var(--color-accent-mid)] disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="text-center text-xs text-[var(--color-muted)]">
              Don’t have an account?{" "}
              <a
                href="/member-registration"
                className="text-[var(--color-accent)] hover:underline"
              >
                Apply for membership
              </a>
            </div>
            <div className="mt-2 text-xs text-[var(--color-muted)]">
              <a
                href="/forgot-password"
                className="text-[var(--color-accent)] hover:underline"
              >
                Forgot password?
              </a>
            </div>
          </form>
    </AuthLayout>
  );
}
