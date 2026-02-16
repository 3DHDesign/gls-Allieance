import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestPasswordOtp } from "../api/auth"; 


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
    <main className="min-h-screen bg-[#f7f8fb]">
      <section className="container pt-24 pb-14">
        <div className="mx-auto max-w-md rounded-2xl bg-white border border-gray-200 shadow p-6 md:p-7">
          <h1 className="text-2xl font-semibold text-[var(--color-accent)]">
            Forgot Password
          </h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Enter your registered email. We’ll send an OTP.
          </p>

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

          <form onSubmit={onSubmit} className="mt-5 grid gap-4">
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-3"
                placeholder="you@company.com"
                autoComplete="email"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-accent disabled:opacity-50"
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
        </div>
      </section>
    </main>
  );
}
