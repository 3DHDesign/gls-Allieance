import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestPasswordOtp } from "../api/auth"; 
import AuthLayout from "../components/AuthLayout";


export default function ForgotPassword() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) return setError("Email is required.");

    try {
      setLoading(true);
      const data = await requestPasswordOtp(cleanEmail);
      setSuccess(data?.message || "OTP sent. Please check your email.");

      setTimeout(() => {
        nav(`/verify-otp?email=${encodeURIComponent(cleanEmail)}`);
      }, 500);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "OTP request failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout eyebrow="Account recovery" title="Reset your password" description="Enter your registered email and we’ll send a secure one-time code.">

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

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[var(--color-accent)] px-4 py-3.5 font-semibold text-white shadow-[0_10px_24px_rgba(1,30,79,0.16)] disabled:opacity-50"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>

            <div className="text-center text-xs text-[var(--color-muted)]">
              Remembered your password?{" "}
              <a
                href="/login"
                className="text-[var(--color-accent)] hover:underline"
              >
                Back to Login
              </a>
            </div>
          </form>
    </AuthLayout>
  );
}
