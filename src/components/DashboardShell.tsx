import type { ReactNode } from "react";
import { FiCreditCard, FiGrid, FiLogOut, FiUser } from "react-icons/fi";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DashboardShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();

  const onLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc] pt-[78px]">
      <div className="flex min-h-[calc(100vh-78px)] flex-col lg:flex-row">
        <aside className="bg-[#031837] text-white lg:w-[272px] lg:shrink-0">
          <div className="flex items-center justify-between p-5 lg:block lg:p-6">
            <Link to="/" className="inline-flex items-center gap-3">
              <img src="/images/logo.png" alt="GLS Alliance" className="h-11 w-36 rounded-lg bg-white object-contain p-1" />
            </Link>
            <div className="hidden border-b border-white/10 pb-6 pt-8 lg:block">
              <p className="text-xs uppercase tracking-[0.16em] text-emerald-300">Member portal</p>
              <p className="mt-2 truncate text-sm font-medium text-white/80">{user?.name || "GLS Member"}</p>
              <p className="mt-1 truncate text-xs text-white/45">{user?.email || "Welcome back"}</p>
            </div>
            <nav className="hidden space-y-2 pt-6 lg:block" aria-label="Dashboard navigation">
              <SideLink to="/dashboard" label="Overview" icon={<FiGrid />} />
              <SideLink to="/profile" label="My profile" icon={<FiUser />} />
              <SideLink to="/payment" label="Payments" icon={<FiCreditCard />} />
              <SideLink to="/account" label="Account settings" icon={<FiUser />} />
            </nav>
            <button type="button" onClick={onLogout} className="hidden items-center gap-3 pt-10 text-sm text-white/55 transition hover:text-white lg:flex">
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

        <main className="flex-1 p-5 sm:p-8 lg:p-10">
          <div className="mx-auto max-w-[1180px]">{children}</div>
        </main>
      </div>
    </div>
  );
}

function SideLink({ to, label, icon }: { to: string; label: string; icon: ReactNode }) {
  return (
    <NavLink to={to} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${isActive ? "bg-white text-[var(--color-accent)] shadow-lg" : "text-white/65 hover:bg-white/10 hover:text-white"}`}>
      <span className="text-lg">{icon}</span>{label}
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
