import type { ReactNode } from "react";
import { FiArrowLeft, FiGlobe, FiShield, FiUsers } from "react-icons/fi";
import { Link } from "react-router-dom";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export default function AuthLayout({ eyebrow, title, description, children }: Props) {
  return (
    <main className="min-h-screen bg-[#f7f9fc] pt-[78px]">
      <div className="grid min-h-[calc(100vh-78px)] lg:grid-cols-[0.95fr_1.05fr]">
        <section className="relative hidden overflow-hidden bg-[#031837] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.22),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.24),transparent_36%)]" />
          <div className="relative">
            <Link to="/" className="inline-flex items-center gap-3">
              <img src="/images/logo.png" alt="GLS Alliance" className="h-14 w-44 rounded-lg bg-white object-contain p-1" />
            </Link>
            <div className="mt-24 max-w-md">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">GLS Alliance member portal</p>
              <h2 className="mt-5 text-4xl font-semibold leading-tight xl:text-5xl">
                Your global logistics network starts here.
              </h2>
              <p className="mt-5 text-base leading-7 text-white/65">
                Connect with trusted partners, manage your profile, and discover new opportunities across international markets.
              </p>
            </div>
          </div>
          <div className="relative grid grid-cols-3 gap-3">
            <AuthHighlight icon={<FiGlobe />} label="Global reach" />
            <AuthHighlight icon={<FiUsers />} label="Trusted network" />
            <AuthHighlight icon={<FiShield />} label="Member support" />
          </div>
        </section>

        <section className="flex items-center justify-center p-5 py-12 sm:p-8 lg:p-12">
          <div className="w-full max-w-md">
            <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[var(--color-accent)] lg:hidden">
              <FiArrowLeft /> Back to GLS Alliance
            </Link>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(1,30,79,0.08)] sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent-light)]">{eyebrow}</p>
              <h1 className="mt-3 text-3xl font-semibold text-[var(--color-accent)]">{title}</h1>
              <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
              {children}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function AuthHighlight({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.06] p-3">
      <span className="text-emerald-300">{icon}</span>
      <p className="mt-2 text-xs font-medium text-white/70">{label}</p>
    </div>
  );
}
