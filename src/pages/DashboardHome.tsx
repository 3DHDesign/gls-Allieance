import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import DashboardShell from "../components/DashboardShell";
import { getMemberByUserId } from "../api/member";
import type { MemberRegistration } from "../api/member";


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
      <h1 className="text-4xl font-bold text-[#0b1f3b]">Dashboard</h1>
      <p className="mt-1 text-[var(--color-muted)]">Welcome, {name}.</p>

      {loading ? (
        <div className="mt-6 bg-white border rounded-2xl p-6">Loading...</div>
      ) : (
        <div className="mt-6 bg-white border rounded-2xl p-6 shadow-sm max-w-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#0b1f3b]">Summary</h2>
            <span className={`border rounded-full px-3 py-1 text-xs font-medium capitalize ${badge(data?.status)}`}>
              {data?.status}
            </span>
          </div>

          <div className="mt-4 space-y-2 text-sm text-gray-700">
            <p><b>Email:</b> {email}</p>
            <p><b>Profile Type:</b> {data?.profile_type || "—"}</p>
            <p><b>Company:</b> {data?.company_name || "—"}</p>
            <p><b>Reference Code:</b> {data?.ref_code || "—"}</p>
          </div>

          {String(data?.status).toLowerCase() === "rejected" && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              Your profile was rejected. Please update documents/details and re-submit.
            </div>
          )}
        </div>
      )}
    </DashboardShell>
  );
}
