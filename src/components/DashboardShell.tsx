import type { ReactNode } from "react";
import { FiCreditCard, FiGrid, FiLogOut, FiUser } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DashboardShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();

  const onLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc] pt-[78px]">
      <div className="flex min-h-[calc(100vh-78px)] flex-col lg:h-[calc(100vh-78px)] lg:flex-row lg:overflow-hidden">
        <aside className="bg-[#031837] text-white lg:h-full lg:w-[282px] lg:shrink-0 lg:overflow-y-auto">
          <div className="relative flex items-center justify-between overflow-hidden p-5 lg:block lg:min-h-full lg:p-6">
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-blue-400/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 -left-20 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />
            {/* <Link to="/" className="inline-flex items-center gap-3">
              <img src="/images/logo.png" alt="GLS Alliance" className="h-11 w-36 rounded-lg bg-white object-contain p-1" />
            </Link> */}
            <div className="relative hidden border-b border-white/10 pb-6 pt-10 lg:block">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-300">Member portal</p>
              <div className="mt-5 flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-400 text-sm font-bold text-[#031837]">
                  {(user?.name || "GLS").slice(0, 2).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{user?.name || "GLS Member"}</p>
                  <p className="mt-1 truncate text-xs text-white/45">{user?.email || "Welcome back"}</p>
                </div>
              </div>
            </div>
            <nav className="relative hidden space-y-2 pt-7 lg:block" aria-label="Dashboard navigation">
              <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">Workspace</p>
              <SideLink to="/dashboard" label="Overview" icon={<FiGrid />} />
              <SideLink to="/profile" label="My profile" icon={<FiUser />} />
              <SideLink to="/payment" label="Payments" icon={<FiCreditCard />} />
              <SideLink to="/account" label="Account settings" icon={<FiUser />} />
            </nav>
            <button type="button" onClick={onLogout} className="relative hidden items-center gap-3 pt-12 text-sm text-white/45 transition hover:text-white lg:flex">
              <FiLogOut /> Sign out
            </button>
          </div>
          <nav className="grid grid-cols-4 gap-1 border-t border-white/10 px-3 pb-3 pt-2 lg:hidden" aria-label="Dashboard navigation">
            <MobileSideLink to="/dashboard" label="Overview" icon={<FiGrid />} />
            <MobileSideLink to="/profile" label="Profile" icon={<FiUser />} />
            <MobileSideLink to="/payment" label="Payments" icon={<FiCreditCard />} />
            <MobileSideLink to="/account" label="Account" icon={<FiUser />} />
          </nav>
        </aside>

        <main className="min-h-0 flex-1 p-5 sm:p-8 lg:overflow-y-auto lg:p-10">
          <div className="mx-auto max-w-[1180px]">{children}</div>
        </main>
      </div>
    </div>
  );
}

function SideLink({ to, label, icon }: { to: string; label: string; icon: ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => (
        `group flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition ${
          isActive
            ? "border-white/10 bg-white text-[var(--color-accent)] shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
            : "border-transparent text-white/60 hover:border-white/10 hover:bg-white/10 hover:text-white"
        }`
      )}
    >
      {({ isActive }) => (
        <>
          <span className={`text-lg transition-transform group-hover:scale-110 ${isActive ? "text-[var(--color-accent-light)]" : ""}`}>{icon}</span>
          {label}
        </>
      )}
    </NavLink>
  );
}

function MobileSideLink({ to, label, icon }: { to: string; label: string; icon: ReactNode }) {
  return (
    <NavLink to={to} className={({ isActive }) => `flex flex-col items-center gap-1 rounded-lg px-1 py-2 text-[10px] ${isActive ? "bg-white/15 text-white" : "text-white/55"}`}>
      <span className="text-base">{icon}</span>{label}
    </NavLink>
  );
}
