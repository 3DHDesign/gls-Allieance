import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePasswordAfterOtp } from "../api/auth";
import AuthLayout from "../components/AuthLayout";

export default function ResetPassword() {
  const nav = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!password.trim()) return setError("New password is required.");
    if (password.trim().length < 8)
      return setError("Password must be at least 8 characters.");
    if (password !== confirm) return setError("Passwords do not match.");

    const resetToken = sessionStorage.getItem("gls_reset_token") || "";
    if (!resetToken) {
      return setError("Reset token missing. Please verify OTP again.");
    }

    try {
      setLoading(true);

      const data = await changePasswordAfterOtp({
        
        password,
        password_confirmation: confirm,
      });

      setSuccess(data?.message || "Password changed successfully.");
      setTimeout(() => nav("/login"), 700);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Password change failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout eyebrow="New password" title="Create a new password" description="Choose a strong password to keep your GLS Alliance account secure.">

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
              <label className="block text-sm mb-1">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition focus:border-[var(--color-accent-light)] focus:bg-white focus:ring-4 focus:ring-blue-50"
                placeholder="New password"
                autoComplete="new-password"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Confirm Password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition focus:border-[var(--color-accent-light)] focus:bg-white focus:ring-4 focus:ring-blue-50"
                placeholder="Confirm new password"
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[var(--color-accent)] px-4 py-3.5 font-semibold text-white shadow-[0_10px_24px_rgba(1,30,79,0.16)] disabled:opacity-50"
            >
              {loading ? "Changing..." : "Change Password"}
            </button>

            <div className="text-center text-xs text-[var(--color-muted)]">
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
