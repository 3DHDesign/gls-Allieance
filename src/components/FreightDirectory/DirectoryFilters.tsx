// src/components/FreightDirectory/DirectoryFilters.tsx
import { useEffect, useMemo, useState } from "react";
import {
  getMemberDirectory,
  normalizeMembers,
  type GetMemberDirectoryParams,
} from "../../api/memberDirectory";

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
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[var(--color-accent)]">
              Member Directory
            </h2>
          </div>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50"
          >
            <span>⟲</span> Reset
          </button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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