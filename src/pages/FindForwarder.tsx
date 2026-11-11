import { useEffect, useMemo, useRef, useState } from "react";
import DirectoryFilters from "../components/FreightDirectory/DirectoryFilters";
import ResultRow from "../components/FreightDirectory/ResultRow";
import {
  getMemberDirectory,
  normalizeMembers,
  parsePagination,
  type MemberRow,
} from "../api/memberDirectory";

type ForwarderUI = {
  id: string;
  name: string;
  country: string;
  city: string;
  years?: number;
  tags?: string[];
};

function mapToUI(m: MemberRow): ForwarderUI {
  return {
    id: String(m.id),
    name: m.company_name ?? m.name ?? "Unnamed Company",
    country: m.country ?? "-",
    city: m.city ?? "-",
    years: typeof m.years === "number" ? m.years : undefined,
    tags: m.tags ?? [],
  };
}

export default function FindForwarder() {
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [keyword, setKeyword] = useState("");
  const [orderBy, setOrderBy] = useState("");

  const [rows, setRows] = useState<ForwarderUI[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // ✅ pagination states
  const [page, setPage] = useState(1);
  const perPage = 20;
  const [lastPage, setLastPage] = useState<number | null>(null);
  const [total, setTotal] = useState<number | null>(null);

  // ✅ small debounce for keyword (prevents API spam)
  const [debouncedKeyword, setDebouncedKeyword] = useState(keyword);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedKeyword(keyword), 350);
    return () => clearTimeout(t);
  }, [keyword]);

  // ✅ detect "no filters" (to show label "Latest members")
  const hasAnyFilter = useMemo(() => {
    return !!country || (!!city && city !== "All Cities") || !!debouncedKeyword.trim();
  }, [country, city, debouncedKeyword]);

  // ✅ when filters change → reset to page 1
  const firstRunRef = useRef(true);
  useEffect(() => {
    if (firstRunRef.current) return; // skip on initial mount
    setPage(1);
  }, [country, city, debouncedKeyword]);

  // ✅ fetch (initial load + filters + page)
  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setMsg(null);

        const data = await getMemberDirectory({
          profile_type: "freight_forwarder",
          country: country || undefined,
          city: city && city !== "All Cities" ? city : undefined,
          key_word: debouncedKeyword.trim() ? debouncedKeyword.trim() : undefined,
          per_page: perPage,
          page,
        });

        const list = normalizeMembers(data).map(mapToUI);
        const pg = parsePagination(data);

        setRows(list);
        setLastPage(pg.last_page);
        setTotal(pg.total);

        // if API doesn't send last_page, we can still infer later
        if (!pg.last_page) {
          setLastPage(list.length < perPage ? page : null);
        }

        firstRunRef.current = false;
      } catch (e) {
        setMsg("Failed to load directory. Please try again.");
        setRows([]);
        setLastPage(null);
        setTotal(null);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [country, city, debouncedKeyword, page]);

  // sorting (frontend)
  const sorted = useMemo(() => {
    const list = [...rows];
    const sortKey = orderBy || "Years (Newest)";
    switch (sortKey) {
      case "A - Z":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "Years (Newest)":
        list.sort((a, b) => (b.years ?? 0) - (a.years ?? 0));
        break;
      case "Years (Oldest)":
        list.sort((a, b) => (a.years ?? 0) - (b.years ?? 0));
        break;
      default:
        list.sort((a, b) => a.city.localeCompare(b.city) || a.name.localeCompare(b.name));
    }
    return list;
  }, [rows, orderBy]);

  const onReset = () => {
    setCountry("");
    setCity("");
    setKeyword("");
    setOrderBy("");
    setPage(1);
    setMsg(null);
  };

  const canPrev = page > 1 && !loading;
  const canNext =
    !loading &&
    (lastPage ? page < lastPage : rows.length === perPage); // if lastPage unknown, infer by result size

  return (
    <main className="min-h-[70vh] bg-[#f7f9fc] pb-16 pt-[78px]">
      <section className="relative isolate overflow-hidden bg-[#061a35]">
        <div className="absolute inset-0 -z-10 bg-cover bg-center" style={{ backgroundImage: "url('/images/hero_image_01.avif')" }} />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(3,24,55,0.96),rgba(3,24,55,0.7),rgba(3,24,55,0.3))]" />
        <div className="container py-14 md:py-16">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">Global directory</p>
          <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">Find your next trusted partner</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/80 md:text-lg">
          Browse the latest members or use filters to refine your search.
          </p>
        </div>
      </section>

      <DirectoryFilters
        profileType="freight_forwarder"
        country={country} setCountry={setCountry}
        city={city} setCity={setCity}
        keyword={keyword} setKeyword={setKeyword}
        orderBy={orderBy} setOrderBy={setOrderBy}
        onReset={onReset}
        onInteract={() => { /* keep for UI if needed */ }}
      />

      <section className="container mt-6">
        {/* ✅ Top info bar */}
        <div className="mb-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div className="text-sm text-muted">
            {!hasAnyFilter ? (
              <span>
                Showing <span className="font-medium text-gray-900">latest members</span>
              </span>
            ) : (
              <span>
                Showing results for your filters
              </span>
            )}
            {typeof total === "number" && (
              <span className="ml-2">• Total: <span className="font-medium text-gray-900">{total}</span></span>
            )}
          </div>

          {/* ✅ Pagination controls (top) */}
          <div className="flex items-center gap-2">
            <button
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!canPrev}
            >
              Prev
            </button>
            <div className="text-sm text-muted">
              Page <span className="font-medium text-gray-900">{page}</span>
              {lastPage ? (
                <span> / <span className="font-medium text-gray-900">{lastPage}</span></span>
              ) : null}
            </div>
            <button
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
              onClick={() => setPage((p) => p + 1)}
              disabled={!canNext}
            >
              Next
            </button>
          </div>
        </div>

        {/* Content states */}
        {loading ? (
          <div className="rounded-2xl bg-white border border-gray-100 p-10 text-center text-muted">
            Loading...
          </div>
        ) : msg ? (
          <div className="rounded-2xl bg-white border border-gray-100 p-10 text-center text-muted">
            {msg}
          </div>
        ) : sorted.length === 0 ? (
          <div className="rounded-2xl bg-white border border-gray-100 p-10 text-center text-muted">
            No results. Try adjusting filters.
          </div>
        ) : (
          <>
            <div className="grid gap-3 md:gap-4">
              {sorted.map((f) => (
                <ResultRow key={f.id} f={f as any} />
              ))}
            </div>

            {/* ✅ Pagination controls (bottom) */}
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!canPrev}
              >
                Prev
              </button>
              <div className="text-sm text-muted">
                Page <span className="font-medium text-gray-900">{page}</span>
                {lastPage ? (
                  <span> / <span className="font-medium text-gray-900">{lastPage}</span></span>
                ) : null}
              </div>
              <button
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
                onClick={() => setPage((p) => p + 1)}
                disabled={!canNext}
              >
                Next
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}