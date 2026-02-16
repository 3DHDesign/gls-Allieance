import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestPasswordOtp } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import DashboardShell from "../components/DashboardShell";

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
      nav(`/reset-password?email=${encodeURIComponent(cleanEmail)}`);
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
      <h1 className="text-3xl font-bold text-[#0b1f3b]">Account</h1>
      <p className="mt-1 text-[var(--color-muted)]">
        Request OTP to reset your password.
      </p>

      <div className="mt-6 bg-white border rounded-2xl p-6 shadow-sm max-w-md">
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <form onSubmit={onSubmit} className="grid gap-4">
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
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>
      </div>
    </DashboardShell>
  );
}
