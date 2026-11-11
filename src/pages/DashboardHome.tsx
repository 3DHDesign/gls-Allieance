import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import DashboardShell from "../components/DashboardShell";
import { getMemberByUserId } from "../api/member";
import type { MemberRegistration } from "../api/member";
import { FiArrowRight, FiBriefcase, FiMail, FiMapPin } from "react-icons/fi";


function badge(status?: string) {
  const s = (status || "").toLowerCase();
  if (s === "active") return "bg-green-50 text-green-700 border-green-200";
  if (s === "rejected") return "bg-red-50 text-red-700 border-red-200";
  if (s === "pending") return "bg-yellow-50 text-yellow-800 border-yellow-200";
  return "bg-slate-50 text-slate-700 border-slate-200";
}

export default function DashboardHome() {
  const { user } = useAuth();
  const userId = user?.id;

  const [data, setData] = useState<MemberRegistration | null>(null);
  const [loading, setLoading] = useState(true);

  const email = useMemo(() => data?.contacts?.[0]?.email || user?.email || "—", [data, user]);
  const name = useMemo(() => data?.user_name || user?.name || "User", [data, user]);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      setLoading(true);
      const res = await getMemberByUserId(userId);
      setData(res.data);
      setLoading(false);
    })();
  }, [userId]);

  return (
    <DashboardShell>
      <div className="rounded-3xl bg-[linear-gradient(120deg,#031837,#0a3767)] p-6 text-white shadow-[0_16px_40px_rgba(1,30,79,0.16)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">Member overview</p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Welcome back, {name}.</h1>
        <p className="mt-2 text-sm text-white/65">Manage your GLS Alliance membership and stay connected to your network.</p>
      </div>

      {loading ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">Loading your member summary...</div>
      ) : (
        <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(1,30,79,0.06)]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#0b1f3b]">Summary</h2>
            <span className={`border rounded-full px-3 py-1 text-xs font-medium capitalize ${badge(data?.status)}`}>
              {data?.status}
            </span>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <SummaryItem icon={<FiMail />} label="Email" value={email} />
            <SummaryItem icon={<FiBriefcase />} label="Company" value={data?.company_name || "—"} />
            <SummaryItem icon={<FiMapPin />} label="Profile type" value={data?.profile_type || "—"} />
            <SummaryItem icon={<FiArrowRight />} label="Reference code" value={data?.ref_code || "—"} />
          </div>

          {String(data?.status).toLowerCase() === "rejected" && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              Your profile was rejected. Please update documents/details and re-submit.
            </div>
          )}
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(1,30,79,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-light)]">Quick actions</p>
          <h2 className="mt-2 text-xl font-semibold text-[#0b1f3b]">Keep your profile current</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">Update your company details or review your membership payment status.</p>
          <div className="mt-5 grid gap-2">
            <a href="/profile" className="rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-[var(--color-accent)] transition hover:bg-blue-100">Review profile</a>
            <a href="/payment" className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-[var(--color-accent-light)] hover:text-[var(--color-accent)]">View payments</a>
          </div>
        </div>
        </div>
      )}
    </DashboardShell>
  );
}

function SummaryItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
        <span className="text-[var(--color-accent-light)]">{icon}</span>{label}
      </div>
      <p className="mt-2 truncate text-sm font-semibold text-slate-700">{value}</p>
    </div>
  );
}
