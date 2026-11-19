import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import DashboardShell from "../components/DashboardShell";
import { getMemberByUserId } from "../api/member";
import type { MemberRegistration } from "../api/member";
import { getUserPayments, type UserPayment } from "../api/payment";
import { getUserSubscription, type UserSubscription } from "../api/package";
import { NavLink } from "react-router-dom";
import {
  FiArrowRight,
  FiBriefcase,
  FiCalendar,
  FiCheckCircle,
  FiCreditCard,
  FiGlobe,
  FiMail,
  FiMapPin,
  FiShield,
} from "react-icons/fi";


function badge(status?: string) {
  const s = (status || "").toLowerCase();
  if (s === "active") return "bg-green-50 text-green-700 border-green-200";
  if (s === "rejected") return "bg-red-50 text-red-700 border-red-200";
  if (s === "pending") return "bg-yellow-50 text-yellow-800 border-yellow-200";
  return "bg-slate-50 text-slate-700 border-slate-200";
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function DashboardHome() {
  const { user } = useAuth();
  const userId = user?.id;

  const [data, setData] = useState<MemberRegistration | null>(null);
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<UserPayment[]>([]);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const email = useMemo(() => data?.contacts?.[0]?.email || user?.email || "—", [data, user]);
  const name = useMemo(() => data?.user_name || user?.name || "User", [data, user]);

  useEffect(() => {
    if (!userId) return;
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setLoadError(null);
        const [memberResult, paymentResult, subscriptionResult] =
          await Promise.all([
            getMemberByUserId(userId),
            getUserPayments(userId),
            getUserSubscription(userId),
          ]);

        if (!mounted) return;
        setData(memberResult.data);
        setPayments(paymentResult);
        setSubscription(subscriptionResult);
      } catch (error: unknown) {
        if (!mounted) return;
        if (typeof error === "object" && error !== null && "response" in error) {
          const response = (error as { response?: { data?: { message?: string } } }).response;
          setLoadError(response?.data?.message || "Failed to load your dashboard.");
        } else {
          setLoadError(error instanceof Error ? error.message : "Failed to load your dashboard.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [userId]);

  const completedPayments = payments.filter(
    (payment) => payment.status === "completed",
  ).length;
  const pendingPayments = payments.filter(
    (payment) => payment.status === "pending",
  ).length;

  return (
    <DashboardShell>
      <div className="py-2">
        <section className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(120deg,#061a38,#0a3767)] p-6 text-white shadow-[0_18px_45px_rgba(7,29,66,0.20)] sm:p-8">
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/10 text-lg font-bold text-emerald-300">
                {(data?.company_name || name).slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
                  Member overview
                </p>
                <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                  Welcome back, {name}
                </h1>
                <p className="mt-2 text-sm text-blue-100">
                  Manage your membership and stay connected with GLS Alliance.
                </p>
              </div>
            </div>
            <span className={`flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold ${badge(data?.status)}`}>
              <FiCheckCircle />
              {data?.status || "Profile"}
            </span>
          </div>
        </section>

        {loading ? (
          <div className="mt-6 grid min-h-72 place-items-center rounded-[24px] border border-slate-200 bg-white text-sm text-slate-500 shadow-[0_12px_35px_rgba(15,35,75,0.06)]">
            Loading your member summary...
          </div>
        ) : loadError ? (
          <div className="mt-6 rounded-[24px] border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            {loadError}
          </div>
        ) : (
          <>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                icon={<FiBriefcase />}
                label="Company"
                value={data?.company_name || "Not provided"}
              />
              <StatCard
                icon={<FiShield />}
                label="Profile"
                value={data?.profile_type || "Member"}
              />
              <StatCard
                icon={<FiCreditCard />}
                label="Payments"
                value={`${payments.length} total`}
              />
              <StatCard
                icon={<FiCheckCircle />}
                label="Completed"
                value={`${completedPayments} payment${completedPayments === 1 ? "" : "s"}`}
              />
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
              <div className="space-y-6">
                <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_12px_35px_rgba(15,35,75,0.06)]">
                  <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-7">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                        Account summary
                      </p>
                      <h2 className="mt-1 text-lg font-bold text-[#0b1f3b]">
                        Membership information
                      </h2>
                    </div>
                    <NavLink
                      to="/profile"
                      className="flex items-center gap-2 text-xs font-bold text-[var(--color-accent)]"
                    >
                      View profile <FiArrowRight />
                    </NavLink>
                  </div>
                  <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-7">
                    <SummaryItem icon={<FiMail />} label="Email" value={email} />
                    <SummaryItem icon={<FiBriefcase />} label="Company" value={data?.company_name || "—"} />
                    <SummaryItem icon={<FiMapPin />} label="Location" value={[data?.city, data?.country].filter(Boolean).join(", ") || "—"} />
                    <SummaryItem icon={<FiGlobe />} label="Reference" value={data?.ref_code || "—"} />
                  </div>
                </section>

                {String(data?.status).toLowerCase() === "rejected" && (
                  <div className="rounded-[20px] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                    Your profile was rejected. Please update the required information and submit it again.
                  </div>
                )}

                <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_12px_35px_rgba(15,35,75,0.06)]">
                  <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-7">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                        Recent activity
                      </p>
                      <h2 className="mt-1 text-lg font-bold text-[#0b1f3b]">Payment history</h2>
                    </div>
                    <NavLink
                      to="/payment"
                      className="flex items-center gap-2 text-xs font-bold text-[var(--color-accent)]"
                    >
                      Manage <FiArrowRight />
                    </NavLink>
                  </div>
                  <div className="p-5 sm:p-7">
                    {payments.length === 0 ? (
                      <div className="rounded-xl bg-slate-50 px-4 py-5 text-sm text-slate-500">
                        No payments have been submitted yet.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {payments.slice(0, 4).map((payment) => (
                          <div
                            key={payment.id}
                            className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-[var(--color-accent)] shadow-sm">
                                <FiCreditCard />
                              </span>
                              <div>
                                <p className="text-sm font-bold text-[#0b1f3b]">
                                  {payment.package?.name || "Membership payment"}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                  {payment.reference_code} · {payment.created_at_human || "—"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between gap-4 sm:justify-end">
                              <span className="text-sm font-bold text-[#0b1f3b]">
                                LKR {Number(payment.amount).toLocaleString()}
                              </span>
                              <span
                                className={`rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ${
                                  payment.status === "completed"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : payment.status === "failed"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-amber-100 text-amber-700"
                                }`}
                              >
                                {payment.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              </div>

              <aside className="space-y-6">
                <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_12px_35px_rgba(15,35,75,0.06)]">
                  <div className="border-b border-slate-100 px-5 py-5">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                      Current membership
                    </p>
                  </div>
                  <div className="p-5">
                    <div className="rounded-2xl bg-[#071d42] p-5 text-white">
                      <div className="flex items-start justify-between gap-3">
                        <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-emerald-300">
                          <FiShield />
                        </span>
                        {subscription?.status === "active" && (
                          <span className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-[10px] font-bold text-emerald-300">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="mt-5 text-lg font-bold">
                        {subscription?.status === "active"
                          ? subscription.package?.name || "Membership"
                          : "No active package"}
                      </p>
                      <div className="mt-4 flex items-center gap-2 text-xs text-blue-200">
                        <FiCalendar />
                        {subscription?.status === "active"
                          ? `Expires ${formatDate(subscription.expiration_date)}`
                          : "Choose a package"}
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm">
                      <span className="text-slate-500">Pending payments</span>
                      <span className="font-bold text-[#0b1f3b]">{pendingPayments}</span>
                    </div>
                  </div>
                </section>

                <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_12px_35px_rgba(15,35,75,0.06)]">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                    Quick actions
                  </p>
                  <div className="mt-4 grid gap-3">
                    <NavLink
                      to="/profile"
                      className="flex items-center justify-between rounded-xl bg-blue-50 px-4 py-3 text-sm font-bold text-[var(--color-accent)] transition hover:bg-blue-100"
                    >
                      Review profile <FiArrowRight />
                    </NavLink>
                    <NavLink
                      to="/payment"
                      className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 transition hover:border-[var(--color-accent-light)] hover:text-[var(--color-accent)]"
                    >
                      Make a payment <FiArrowRight />
                    </NavLink>
                    <NavLink
                      to="/account"
                      className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 transition hover:border-[var(--color-accent-light)] hover:text-[var(--color-accent)]"
                    >
                      Account settings <FiArrowRight />
                    </NavLink>
                  </div>
                </section>
              </aside>
            </div>
          </>
        )}
      </div>
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

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 rounded-[20px] border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,35,75,0.05)]">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-lg text-[var(--color-accent)]">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">{label}</p>
        <p className="mt-1 truncate text-sm font-bold text-[#0b1f3b]">{value}</p>
      </div>
    </div>
  );
}
