// src/components/FreightDirectory/DirectoryFilters.tsx
import { useEffect, useMemo, useState } from "react";
import {
  getMemberDirectory,
  normalizeMembers,
  type GetMemberDirectoryParams,
} from "../../api/memberDirectory";
import { FiRotateCcw, FiSearch } from "react-icons/fi";

type Props = {
  profileType: GetMemberDirectoryParams["profile_type"];

  country: string;
  setCountry: (v: string) => void;

  city: string;
  setCity: (v: string) => void;

  keyword: string;
  setKeyword: (v: string) => void;

  orderBy: string;
  setOrderBy: (v: string) => void;

  onReset: () => void;
  onInteract?: () => void;
};

export default function DirectoryFilters({
  profileType,
  country,
  setCountry,
  city,
  setCity,
  keyword,
  setKeyword,
  orderBy,
  setOrderBy,
  onReset,
  onInteract,
}: Props) {
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [allRows, setAllRows] = useState<{ country?: string; city?: string }[]>(
    []
  );

  // ✅ fetch all members (small dataset now)
  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        setLoadingOptions(true);

        const data = await getMemberDirectory({
          profile_type: profileType,
          per_page: 2000, // safe for "few members" now
          page: 1,
        });

        const members = normalizeMembers(data);

        if (!mounted) return;

        setAllRows(
          members.map((m: any) => ({
            country: (m?.country ?? "").trim(),
            city: (m?.city ?? "").trim(),
          }))
        );
      } catch (e) {
        if (!mounted) return;
        setAllRows([]);
      } finally {
        if (mounted) setLoadingOptions(false);
      }
    };

    run();

    return () => {
      mounted = false;
    };
  }, [profileType]);

  // ✅ unique countries from API
  const countries = useMemo(() => {
    const set = new Set<string>();
    for (const r of allRows) {
      if (r.country) set.add(r.country);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [allRows]);

  // ✅ cities depend on selected country
  const cities = useMemo(() => {
    const set = new Set<string>();

    for (const r of allRows) {
      if (!r.city) continue;

      // If no country selected, allow all cities (optional)
      if (!country) {
        set.add(r.city);
        continue;
      }

      if ((r.country || "").toLowerCase() === country.toLowerCase()) {
        set.add(r.city);
      }
    }

    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [allRows, country]);

  // ✅ if country changes and current city not valid -> reset city
  useEffect(() => {
    if (!city) return;
    if (city === "All Cities") return;
    if (cities.length === 0) return;

    const ok = cities.some((c) => c.toLowerCase() === city.toLowerCase());
    if (!ok) setCity("");
  }, [cities, city, setCity]);

  return (
    <section className="container mt-6">
      <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_12px_35px_rgba(15,35,75,0.06)]">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-[var(--color-accent)]">
              <FiSearch />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">Search directory</p>
              <h2 className="mt-1 text-base font-bold text-[#0b1f3b]">Find a member</h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:border-slate-300"
          >
            <FiRotateCcw /> Reset
          </button>
        </div>

        <div className="grid gap-4 p-5 sm:p-7 md:grid-cols-2 lg:grid-cols-4">
          {/* Country */}
          <div>
            <label className="block text-sm mb-2">Country</label>
            <select
              className="w-full rounded-xl border border-gray-200 px-4 py-3 bg-white"
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
                setCity(""); // reset city when country changes
                onInteract?.();
              }}
              disabled={loadingOptions}
            >
              <option value="">
                {loadingOptions ? "Loading..." : "Select country"}
              </option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* City */}
          <div>
            <label className="block text-sm mb-2">City</label>
            <select
              className="w-full rounded-xl border border-gray-200 px-4 py-3 bg-white"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                onInteract?.();
              }}
              disabled={loadingOptions || (!country && cities.length === 0)}
            >
              <option value="">
                {loadingOptions ? "Loading..." : "Select city"}
              </option>
              <option value="All Cities">All Cities</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Keyword */}
          <div>
            <label className="block text-sm mb-2">Keyword</label>
            <input
              className="w-full rounded-xl border border-gray-200 px-4 py-3"
              placeholder="Company name..."
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                onInteract?.();
              }}
            />
          </div>

          {/* Order By */}
          <div>
            <label className="block text-sm mb-2">Order By</label>
            <select
              className="w-full rounded-xl border border-gray-200 px-4 py-3 bg-white"
              value={orderBy}
              onChange={(e) => {
                setOrderBy(e.target.value);
                onInteract?.();
              }}
            >
              <option value="">Order by</option>
              <option value="A - Z">A - Z</option>
              <option value="Years (Newest)">Years (Newest)</option>
              <option value="Years (Oldest)">Years (Oldest)</option>
              <option value="City">City</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}