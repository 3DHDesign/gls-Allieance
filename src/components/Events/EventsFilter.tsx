import { EVENT_MONTHS } from "../../utils/events";
import { useMemo } from "react";
import { FiGlobe, FiCalendar, FiSearch, FiRefreshCcw } from "react-icons/fi";

type Props = {
  country: string; setCountry: (v: string) => void;
  month: string; setMonth: (v: string) => void;   // "YYYY-MM"
  keyword: string; setKeyword: (v: string) => void;
  onReset: () => void;
};

const COUNTRIES = ["Sri Lanka", "China"] as const;

export default function EventsFilter(p: Props) {
  const prettyMonths = useMemo(
    () =>
      EVENT_MONTHS.map((m) => {
        const [y, mm] = m.split("-");
        const date = new Date(Number(y), Number(mm) - 1, 1);
        return {
          value: m,
          label: date.toLocaleDateString(undefined, { month: "long", year: "numeric" }),
        };
      }),
    []
  );

  return (
    <section className="container mt-8">
      <div className="rounded-2xl bg-white shadow-xl border border-gray-100 p-5 md:p-6">
        <h2 className="text-xl md:text-2xl font-semibold text-[var(--color-accent)] mb-4">
          Events
        </h2>

        {/* One-row pill bar (wraps on small screens) */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          {/* Country */}
          <div className="relative flex-1 min-w-[220px]">
            <FiGlobe className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 opacity-60" />
            <select
              value={p.country}
              onChange={(e) => p.setCountry(e.target.value)}
              className="w-full appearance-none rounded-full border border-gray-200 bg-white pl-11 pr-10 py-3
                         focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            >
              <option value="" disabled hidden>Select country</option>
              {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 opacity-40">▾</span>
          </div>

          {/* Month */}
          <div className="relative flex-1 min-w-[220px]">
            <FiCalendar className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 opacity-60" />
            <select
              value={p.month}
              onChange={(e) => p.setMonth(e.target.value)}
              className="w-full appearance-none rounded-full border border-gray-200 bg-white pl-11 pr-10 py-3
                         focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            >
              <option value="" disabled hidden>Select month</option>
              {prettyMonths.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 opacity-40">▾</span>
          </div>

          {/* Keyword */}
          <div className="relative flex-[1.6] min-w-[280px]">
            <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 opacity-60" />
            <input
              value={p.keyword}
              onChange={(e) => p.setKeyword(e.target.value)}
              placeholder="Search title, venue…"
              className="w-full rounded-full border border-gray-200 bg-white pl-11 pr-4 py-3
                         focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
          </div>

          {/* Reset */}
          <div className="flex-none">
            <button
              onClick={p.onReset}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-5 py-3
                         hover:bg-gray-50"
            >
              <FiRefreshCcw /> Reset
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
