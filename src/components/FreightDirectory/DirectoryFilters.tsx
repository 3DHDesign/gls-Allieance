import { FiRefreshCcw, FiSearch } from "react-icons/fi"; 
import { CITY_MAP, COUNTRIES } from "../../utils/forwarders";

type Props = {
  country: string; setCountry: (v: string) => void;
  city: string; setCity: (v: string) => void;
  keyword: string; setKeyword: (v: string) => void;
  orderBy: string; setOrderBy: (v: string) => void;
  onReset: () => void;
  onInteract: () => void;
};

export default function DirectoryFilters(p: Props) {
  const cities = p.country
    ? ["All Cities", ...(CITY_MAP[p.country as keyof typeof CITY_MAP] ?? [])]
    : [];

  return (
    <section className="container mt-8">
      <div className="rounded-2xl bg-white shadow-xl border border-gray-100 p-5 md:p-6">
        {/* header */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-xl md:text-2xl font-semibold text-[var(--color-accent)]">
            Member Directory
          </h2>
          <button
            onClick={p.onReset}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
            title="Reset filters"
          >
            <FiRefreshCcw />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>

        {/* ONE ROW controls (wraps on small screens) */}
        <div className="flex flex-col lg:flex-row lg:items-end gap-4">
          {/* Country */}
          <div className="flex-1 min-w-[220px]">
            <label className="block text-sm mb-1 text-muted">Country</label>
            <select
              value={p.country}
              onChange={(e) => { p.onInteract(); p.setCountry(e.target.value); p.setCity(""); }}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <option value="" disabled hidden>
                Select country
              </option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* City */}
          <div className="flex-1 min-w-[220px]">
            <label className="block text-sm mb-1 text-muted">City</label>
            <select
              value={p.city}
              onChange={(e) => { p.onInteract(); p.setCity(e.target.value); }}
              disabled={!p.country}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <option value="" disabled hidden>
                Select city
              </option>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Keyword */}
          <div className="flex-[1.6] min-w-[280px]">
            <label className="block text-sm mb-1 text-muted">Keyword</label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
              <input
                value={p.keyword}
                onChange={(e) => { p.onInteract(); p.setKeyword(e.target.value); }}
                placeholder="Company name…"
                className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-3 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              />
            </div>
          </div>

          {/* Order By */}
          <div className="flex-1 min-w-[220px]">
            <label className="block text-sm mb-1 text-muted">Order By</label>
            <select
              value={p.orderBy}
              onChange={(e) => { p.onInteract(); p.setOrderBy(e.target.value); }}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            >
              <option value="" disabled hidden>
                Order by
              </option>
              <option>Country - City</option>
              <option>A - Z</option>
              <option>Years (Newest)</option>
              <option>Years (Oldest)</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}
