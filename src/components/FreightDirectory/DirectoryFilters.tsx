// src/components/FreightDirectory/DirectoryFilters.tsx
import { FiRefreshCcw, FiSearch } from "react-icons/fi";
import { CITY_MAP, COUNTRIES } from "../../utils/forwarders";

type SimpleOption = { label: string; value: string };

type Props = {
  country: string; setCountry: (v: string) => void;
  city: string; setCity: (v: string) => void;
  keyword: string; setKeyword: (v: string) => void;
  orderBy: string; setOrderBy: (v: string) => void;
  onReset: () => void;
  onInteract: () => void;

  // ✅ optional category filters (for importer/exporter page)
  mainCategoryId?: string;
  setMainCategoryId?: (v: string) => void;
  subCategoryId?: string;
  setSubCategoryId?: (v: string) => void;
  mainCategories?: SimpleOption[];
  subCategories?: SimpleOption[];
};

export default function DirectoryFilters(p: Props) {
  const cities =
    p.country ? ["All Cities", ...(CITY_MAP[p.country as keyof typeof CITY_MAP] ?? [])] : [];

  const hasCategoryFilters =
    typeof p.setMainCategoryId === "function" &&
    typeof p.setSubCategoryId === "function";

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

        {/* controls */}
        <div className="flex flex-col lg:flex-row lg:items-end gap-4 flex-wrap">
          {/* Country */}
          <div className="flex-1 min-w-[220px]">
            <label className="block text-sm mb-1 text-muted">Country</label>
            <select
              value={p.country}
              onChange={(e) => { p.onInteract(); p.setCountry(e.target.value); p.setCity(""); }}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            >
              <option value="" disabled hidden>Select country</option>
              {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
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
              <option value="" disabled hidden>Select city</option>
              {cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* ✅ Main Category */}
          {hasCategoryFilters && (
            <div className="flex-1 min-w-[240px]">
              <label className="block text-sm mb-1 text-muted">Main Category</label>
              <select
                value={p.mainCategoryId || ""}
                onChange={(e) => {
                  p.onInteract();
                  p.setMainCategoryId?.(e.target.value);
                  p.setSubCategoryId?.(""); // reset sub when main changes
                }}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              >
                <option value="">All</option>
                {(p.mainCategories ?? []).map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          )}

          {/* ✅ Sub Category */}
          {hasCategoryFilters && (
            <div className="flex-1 min-w-[240px]">
              <label className="block text-sm mb-1 text-muted">Sub Category</label>
              <select
                value={p.subCategoryId || ""}
                onChange={(e) => { p.onInteract(); p.setSubCategoryId?.(e.target.value); }}
                disabled={!p.mainCategoryId}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <option value="">All</option>
                {(p.subCategories ?? []).map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          )}

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
              <option value="" disabled hidden>Order by</option>
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