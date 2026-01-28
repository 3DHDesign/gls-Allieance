import { useMemo, useState } from "react";
import allCountriesRaw from "world-countries";

type Region = "Africa" | "Americas" | "Asia" | "Europe" | "Oceania" | "Antarctic" | "Other";
type Country = { name: string; iso2: string; region: Region; route: string };

const REGIONS: Array<Region | "All"> = ["All", "Africa", "Americas", "Asia", "Europe", "Oceania", "Antarctic"];

const SHOW_INITIAL = 100;

function normalizeCountries(): Country[] {
  const rows = (allCountriesRaw as any[]).map((c) => {
    const iso2 = String(c.cca2 || "").toLowerCase();
    const name = String(c?.name?.common || iso2.toUpperCase());
    const region = (String(c?.region || "Other") as Region);
    return { name, iso2, region, route: `/directory/${iso2}` } as Country;
  });

  const unique = rows.filter(
    (v, i, arr) => v.iso2 && arr.findIndex((x) => x.iso2 === v.iso2) === i
  );

  unique.sort((a, b) => a.name.localeCompare(b.name));
  return unique;
}

export default function CountryFlags() {
  const countries = useMemo(() => normalizeCountries(), []);

  const [activeRegion, setActiveRegion] = useState<Region | "All">("All");
  const [q, setQ] = useState("");
  const [showAll, setShowAll] = useState(false);

  const counts: Record<Region | "All", number> = useMemo(() => {
    const base: Record<Region | "All", number> = { All: countries.length, Africa: 0, Americas: 0, Asia: 0, Europe: 0, Oceania: 0, Antarctic: 0, Other: 0 };
    countries.forEach((c) => { base[c.region] = (base[c.region] ?? 0) + 1; });
    return base;
  }, [countries]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return countries.filter((c) => {
      const matchR = activeRegion === "All" ? true : c.region === activeRegion;
      const matchQ = term ? c.name.toLowerCase().includes(term) : true;
      return matchR && matchQ;
    });
  }, [countries, q, activeRegion]);

  const list = showAll ? filtered : filtered.slice(0, SHOW_INITIAL);

  return (
    <section id="countries" className="bg-[#0B0F1A]">
      <div className="container py-16 md:py-24">
        <h2>Countries &amp; Flags</h2>
        <p className="text-muted mt-2">
          Browse member origins by continent. Showing {showAll ? filtered.length : Math.min(filtered.length, SHOW_INITIAL)} of {filtered.length}.
        </p>

        {/* Region tabs */}
        <div className="mt-6 flex flex-wrap gap-2">
          {REGIONS.map((r) => {
            const active = r === activeRegion;
            return (
              <button
                key={r}
                onClick={() => { setActiveRegion(r as Region | "All"); setShowAll(false); }}
                className={`px-4 py-2 rounded-full border transition ${
                  active ? "bg-accent text-primary border-accent" : "bg-white/5 border-white/10 text-on-dark"
                }`}
              >
                {r} <span className="opacity-70 text-sm ml-1">({counts[r as keyof typeof counts] ?? 0})</span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="mt-4">
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setShowAll(false); }}
            placeholder="Search country…"
            className="w-full md:w-96 rounded-lg bg-white/10 text-on-dark px-4 py-3 outline-none focus:bg-white/15"
          />
        </div>

        {/* Grid */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {list.map((c) => (
            <a
              key={c.iso2}
              href={c.route}
              className="group rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition"
              aria-label={c.name}
              title={`${c.name} • ${c.region}`}
            >
              <div className="flex items-center gap-3">
                {/* flag-icons: <span class="fi fi-us" /> */}
                <span className={`fi fi-${c.iso2} rounded-sm`} style={{ width: 28, height: 20 }} aria-hidden="true" />
                <div className="flex-1">
                  <p className="text-on-dark text-sm font-medium leading-5">{c.name}</p>
                  <p className="text-muted text-xs">{c.region}</p>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Show all */}
        {!showAll && filtered.length > SHOW_INITIAL && (
          <div className="mt-8">
            <button className="btn-accent" onClick={() => setShowAll(true)}>
              Show all {filtered.length} countries
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
