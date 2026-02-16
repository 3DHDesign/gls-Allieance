import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyPasswordOtp } from "../api/auth";

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
    <main className="min-h-screen bg-[#f7f8fb]">
      <section className="container pt-24 pb-14">
        <div className="mx-auto max-w-md rounded-2xl bg-white border border-gray-200 shadow p-6 md:p-7">
          <h1 className="text-2xl font-semibold text-[var(--color-accent)]">
            Verify OTP
          </h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Enter the OTP sent to your email.
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

            <div>
              <label className="block text-sm mb-1">OTP</label>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-3"
                placeholder="Enter OTP"
                inputMode="numeric"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-accent disabled:opacity-50"
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
        </div>
      </section>
    </main>
  );
}
