 // src/components/DashboardShell.tsx
import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DashboardShell({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  // ✅ If your main site header is fixed, keep this padding-top.
  // Adjust 80px to your real header height (ex: 72px / 90px)
  const HEADER_OFFSET = "pt-[70px]";

  return (
    <div className={`min-h-screen bg-[#f7f8fb] ${HEADER_OFFSET}`}>
      <div className="flex">
        {/* SIDEBAR */}
        <aside className="w-[280px] min-h-screen bg-[#061a35] text-white">
          <div className="p-6">
            <p className="text-sm opacity-70">
              Welcome{user?.name ? `, ${user.name}` : ""}.
            </p>

            <div className="mt-6 space-y-3">
              <SideLink to="/dashboard" label="Dashboard" />
              <SideLink to="/profile" label="Profile" />
              <SideLink to="/payment" label="Payment" />
              <SideLink to="/account" label="Account" />
            </div>
          </div>
        </aside>

        {/* CONTENT */}
        <main className="flex-1 p-8">
          <div className="max-w-[1100px]">{children}</div>
        </main>
      </div>
    </div>
  );
}

function SideLink({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "block rounded-xl px-4 py-3 text-[16px] font-semibold",
          isActive ? "bg-white/10" : "hover:bg-white/10",
        ].join(" ")
      }
    >
      {label}
    </NavLink>
  );
}
