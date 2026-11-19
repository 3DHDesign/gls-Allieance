import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestPasswordOtp } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import DashboardShell from "../components/DashboardShell";
import {
  FiCheckCircle,
  FiLock,
  FiMail,
  FiShield,
  FiUser,
} from "react-icons/fi";

export default function AccountPage() {
  const nav = useNavigate();
  const { user } = useAuth();

  const [email, setEmail] = useState(user?.email || "");
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
      setSuccess(data?.message || "OTP sent to your email.");

      // go to reset password page with email
      nav(`/verify-otp?email=${encodeURIComponent(cleanEmail)}`);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to send OTP.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardShell>
      <div className="py-2">
        <div className="mb-7">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-accent-light)]">
            Member settings
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[#0b1f3b] sm:text-4xl">
            Account
          </h1>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Manage your account security and password.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-6">
            <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_16px_45px_rgba(15,35,75,0.08)]">
              <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--color-accent)] text-white">
                    <FiShield />
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-[#0b1f3b]">Account security</h2>
                    <p className="text-xs text-[var(--color-muted)]">
                      Reset your password using secure email verification
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-7">
                {error && (
                  <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {success}
                  </div>
                )}

                <form onSubmit={onSubmit} className="space-y-5">
                  <div>
                    <label
                      htmlFor="account-email"
                      className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600"
                    >
                      Registered email
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        id="account-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-[var(--color-accent)] focus:ring-4 focus:ring-blue-50"
                        placeholder="you@company.com"
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-5 py-3.5 text-sm font-bold text-white shadow-[0_12px_28px_rgba(1,30,79,0.18)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <FiLock />
                    {loading ? "Sending secure OTP..." : "Continue to password reset"}
                  </button>
                </form>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    ["01", "Request OTP"],
                    ["02", "Verify email"],
                    ["03", "Set new password"],
                  ].map(([step, label]) => (
                    <div
                      key={step}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                    >
                      <span className="text-xs font-bold text-[var(--color-accent-light)]">
                        {step}
                      </span>
                      <p className="mt-1 text-xs font-semibold text-slate-700">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_12px_35px_rgba(15,35,75,0.06)] sm:p-7">
              <h2 className="text-lg font-bold text-[#0b1f3b]">Password guidelines</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  "Use at least 8 characters",
                  "Include uppercase and lowercase letters",
                  "Add a number or symbol",
                  "Avoid passwords used elsewhere",
                ].map((guideline) => (
                  <div
                    key={guideline}
                    className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600"
                  >
                    <FiCheckCircle className="shrink-0 text-emerald-600" />
                    {guideline}
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <div className="overflow-hidden rounded-[24px] bg-[linear-gradient(145deg,#071d42,#0a3767)] text-white shadow-[0_18px_45px_rgba(7,29,66,0.20)]">
              <div className="p-6">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-xl text-emerald-300">
                  <FiUser />
                </div>
                <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-blue-200">
                  Signed-in member
                </p>
                <p className="mt-2 text-xl font-bold">{user?.name || "GLS Member"}</p>
                <p className="mt-1 break-all text-sm text-blue-100">{user?.email || "—"}</p>

                <div className="mt-6 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3">
                  <div>
                    <p className="text-xs text-blue-200">Account status</p>
                    <p className="mt-1 text-sm font-semibold capitalize">
                      {user?.status || "Active"}
                    </p>
                  </div>
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_0_5px_rgba(52,211,153,0.12)]" />
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_12px_35px_rgba(15,35,75,0.06)]">
              <div className="flex gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-[var(--color-accent)]">
                  <FiLock />
                </span>
                <div>
                  <p className="text-sm font-bold text-[#0b1f3b]">Secure recovery</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    A one-time code is required before a new password can be set.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </DashboardShell>
  );
}
