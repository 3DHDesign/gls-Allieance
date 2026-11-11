import { FaShip, FaHandshake, FaUserPlus } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";

export default function DirectoryActions() {
  return (
    <div className="relative z-10 mx-auto -mt-9 max-w-5xl px-4">
      <div className="grid gap-2 rounded-2xl border border-white/60 bg-white/95 p-2 shadow-[0_16px_40px_rgba(1,30,79,0.14)] backdrop-blur-xl md:grid-cols-3">
        <ActionCard
          to="/find-forwarder"
          icon={<FaShip />}
          eyebrow="Partner search"
          title="Find a freight forwarder"
          body="Connect with logistics specialists across our network."
        />
        <ActionCard
          to="/find-exporter"
          icon={<FaHandshake />}
          eyebrow="Business discovery"
          title="Find an exporter or importer"
          body="Discover companies ready to build new trade relationships."
        />
        <ActionCard
          to="/member-registration"
          icon={<FaUserPlus />}
          eyebrow="Join the network"
          title="Become a GLS member"
          body="Put your company in front of relevant global partners."
        />
      </div>
    </div>
  );
}

function ActionCard({
  to,
  icon,
  eyebrow,
  title,
  body,
}: {
  to: string;
  icon: ReactNode;
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <Link
      to={to}
      className="group relative overflow-hidden rounded-xl border border-slate-100 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-accent-light)] hover:bg-[var(--color-accent)] hover:shadow-[0_12px_26px_rgba(1,30,79,0.2)] sm:p-5"
    >
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-50 transition-colors group-hover:bg-white/10" />
      <div className="relative flex items-start justify-between gap-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-lg text-[var(--color-accent)] transition-colors group-hover:bg-emerald-400 group-hover:text-[#061a35]">
          {icon}
        </span>
        <FiArrowUpRight className="text-xl text-slate-300 transition-all group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-emerald-300" />
      </div>
      <div className="relative mt-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-light)] group-hover:text-emerald-300">
          {eyebrow}
        </p>
        <h3 className="mt-2 text-sm font-semibold leading-snug text-[var(--color-accent)] group-hover:text-white">
          {title}
        </h3>
        <p className="mt-1.5 text-xs leading-5 text-slate-500 group-hover:text-white/75">{body}</p>
      </div>
    </Link>
  );
}