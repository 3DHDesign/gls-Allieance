import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyPasswordOtp } from "../api/auth";
import AuthLayout from "../components/AuthLayout";

export default function VerifyOtp() {
  const nav = useNavigate();
  const [sp] = useSearchParams();

  const queryEmail = useMemo(() => sp.get("email") || "", [sp]);

  const [email, setEmail] = useState(queryEmail);
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const cleanEmail = email.trim();
    const cleanOtp = otp.trim();

    if (!cleanEmail) return setError("Email is required.");
    if (!cleanOtp) return setError("OTP is required.");

    try {
      setLoading(true);

      // ✅ this stores reset_token in sessionStorage inside api/auth.ts
      const data = await verifyPasswordOtp({ email: cleanEmail, otp: cleanOtp });

      setSuccess(data?.message || "OTP verified.");

      // ✅ go to reset screen (NO otp in URL)
      setTimeout(() => {
        nav("/reset-password", { replace: true });
      }, 400);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "OTP verification failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout eyebrow="Secure verification" title="Verify your email" description="Enter the one-time password sent to your registered email address.">

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
              <label className="block text-sm mb-1">OTP</label>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition focus:border-[var(--color-accent-light)] focus:bg-white focus:ring-4 focus:ring-blue-50"
                placeholder="Enter OTP"
                inputMode="numeric"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[var(--color-accent)] px-4 py-3.5 font-semibold text-white shadow-[0_10px_24px_rgba(1,30,79,0.16)] disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <div className="text-center text-xs text-[var(--color-muted)]">
              <a
                href="/forgot-password"
                className="text-[var(--color-accent)] hover:underline"
              >
                Back
              </a>
            </div>
          </form>
    </AuthLayout>
  );
}
