import { FiArrowRight, FiMapPin, FiShield } from "react-icons/fi";
import type { Forwarder } from "../../utils/forwarders";
import { Link } from "react-router-dom";

export default function ResultRow({
  f,
  isAuthenticated = true,
  loginPath,
}: {
  f: Forwarder;
  isAuthenticated?: boolean;
  loginPath?: string;
}) {
  const content = (
    <div className="flex items-center gap-4">
      <span className="relative grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(135deg,#edf4ff,#dceafd)] text-lg text-[var(--color-accent)] shadow-inner">
        <FiShield />
        <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-base font-bold text-[#0b1f3b] md:text-lg">
          {f.name}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <FiMapPin className="text-[var(--color-accent-light)]" />
          <span className="font-medium">{f.city}, {f.country}</span>
          {typeof f.years === "number" && (
            <span className="rounded-full bg-slate-100 px-2.5 py-1">
              {f.years} {f.years === 1 ? "year" : "years"}
            </span>
          )}
        </div>
        {!isAuthenticated && (
          <div className="mt-2 text-xs font-bold text-[var(--color-accent)]">
            Login to view full profile
          </div>
        )}
      </div>
      <div className="hidden flex-wrap items-center justify-end gap-2 md:flex">
        {(f.tags ?? []).map((tag) => (
          <span key={tag} className="rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-600">
            {tag}
          </span>
        ))}
      </div>
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-slate-200 text-slate-400 transition group-hover:border-[var(--color-accent)] group-hover:text-[var(--color-accent)]">
        <FiArrowRight />
      </span>
    </div>
  );

  if (!isAuthenticated) {
    return (
      <Link
        to={loginPath || "/login"}
        className="group relative block overflow-hidden rounded-2xl border border-slate-200/80 bg-white px-5 py-5 shadow-[0_8px_24px_rgba(15,35,75,0.04)] transition duration-300 hover:-translate-y-1 hover:border-[var(--color-accent-light)] hover:shadow-[0_18px_38px_rgba(15,35,75,0.12)]"
      >
        {content}
      </Link>
    );
  }

  return (
    <Link
      to={`/forwarder/${f.id}`}
      className="group relative block overflow-hidden rounded-2xl border border-slate-200/80 bg-white px-5 py-5 shadow-[0_8px_24px_rgba(15,35,75,0.04)] transition duration-300 hover:-translate-y-1 hover:border-[var(--color-accent-light)] hover:shadow-[0_18px_38px_rgba(15,35,75,0.12)]"
    >
      {content}
    </Link>
  );
}
