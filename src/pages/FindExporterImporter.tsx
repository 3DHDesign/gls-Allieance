// src/pages/FindExporterImporter.tsx
import { useEffect, useMemo, useState } from "react";
import DirectoryFilters from "../components/FreightDirectory/DirectoryFilters";
import ResultRow from "../components/FreightDirectory/ResultRow";
import ExportCategorySidebar from "../components/FreightDirectory/ExportCategorySidebar";
import {
  getMemberDirectory,
  normalizeMembers,
  parsePagination, // ✅ add this helper in memberDirectory.ts
  type MemberRow,
} from "../api/memberDirectory";

type RowUI = {
  id: string;
  name: string;
  country: string;
  city: string;
  years?: number;
  tags?: string[];
};

function mapToUI(m: MemberRow): RowUI {
  return {
    id: String(m.id),
    name: (m as any).company_name ?? (m as any).name ?? "Unnamed Company",
    country: (m as any).country ?? "-",
    city: (m as any).city ?? "-",
    years: typeof (m as any).years === "number" ? (m as any).years : undefined,
    tags: (m as any).tags ?? [],
  };
}

export default function FindExporterImporter() {
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [keyword, setKeyword] = useState("");
  const [orderBy, setOrderBy] = useState("");

  const [categoryId, setCategoryId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [rows, setRows] = useState<RowUI[]>([]);

  // ✅ pagination
  const [page, setPage] = useState(1);
  const perPage = 20;
  const [lastPage, setLastPage] = useState<number | null>(null);
  const [total, setTotal] = useState<number | null>(null);

  // ✅ debounce keyword (prevents API spam when typing)
  const [debouncedKeyword, setDebouncedKeyword] = useState(keyword);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedKeyword(keyword), 350);
    return () => clearTimeout(t);
  }, [keyword]);

  // ✅ detect filters (for text label)
  const hasAnyFilter = useMemo(() => {
    return (
      !!categoryId ||
      !!country ||
      (!!city && city !== "All Cities") ||
      !!debouncedKeyword.trim()
    );
  }, [categoryId, country, city, debouncedKeyword]);

  // ✅ when filters change -> go back to page 1
  useEffect(() => {
    setPage(1);
  }, [country, city, debouncedKeyword, categoryId]);

  // ✅ AUTO LOAD on first visit (no awkward empty page)
  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setMsg(null);

        const data = await getMemberDirectory({
          profile_type: "importer_exporter",
          country: country || undefined,
          city: city && city !== "All Cities" ? city : undefined,
          key_word: debouncedKeyword.trim() ? debouncedKeyword.trim() : undefined,
          category_id: categoryId ?? undefined,
          per_page: perPage,
          page,
        });

        const list = normalizeMembers(data).map(mapToUI);
        const pg = parsePagination(data);

        setRows(list);
        setLastPage(pg.last_page);
        setTotal(pg.total);

        // if API doesn't give last_page, infer end by list size
        if (!pg.last_page) {
          setLastPage(list.length < perPage ? page : null);
        }
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
  }, [country, city, debouncedKeyword, categoryId, page]);

  const sorted = useMemo(() => {
    const list = [...rows];
    const sortKey = orderBy || "A - Z";
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
        list.sort(
          (a, b) => a.city.localeCompare(b.city) || a.name.localeCompare(b.name)
        );
    }
    return list;
  }, [rows, orderBy]);

  const onReset = () => {
    setCountry("");
    setCity("");
    setKeyword("");
    setOrderBy("");
    setCategoryId(null);
    setRows([]);
    setMsg(null);
    setPage(1);
    setLastPage(null);
    setTotal(null);
  };

  const canPrev = page > 1 && !loading;
  const canNext =
    !loading &&
    (lastPage ? page < lastPage : rows.length === perPage); // if lastPage unknown

  return (
    <main className="min-h-[70vh] pb-16">
      <section className="container pt-10 md:pt-14">
        <h1 className="text-[28px] md:text-[42px] leading-tight font-bold text-[var(--color-accent)]">
          Find Exporter / Importer
        </h1>
        <p className="mt-2 max-w-2xl text-muted">
          Browse the latest members or use filters and categories to refine.
        </p>
      </section>

      {/* Top Filters */}
      <DirectoryFilters
        country={country}
        setCountry={setCountry}
        city={city}
        setCity={setCity}
        keyword={keyword}
        setKeyword={setKeyword}
        orderBy={orderBy}
        setOrderBy={setOrderBy}
        onReset={onReset}
        onInteract={() => {}}
      />

      {/* Sidebar + Results */}
      <section className="container mt-6">
        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          <div className="lg:sticky lg:top-24 h-fit">
            <ExportCategorySidebar
              selectedCategoryId={categoryId}
              onSelectCategory={(id) => setCategoryId(id)}
            />
          </div>

          <div>
            {/* ✅ Top info + pagination */}
            <div className="mb-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div className="text-sm text-muted">
                {!hasAnyFilter ? (
                  <span>
                    Showing <span className="font-medium text-gray-900">latest members</span>
                  </span>
                ) : (
                  <span>Showing results for your filters</span>
                )}
                {typeof total === "number" && (
                  <span className="ml-2">
                    • Total: <span className="font-medium text-gray-900">{total}</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!canPrev}
                >
                  Prev
                </button>

                <div className="text-sm text-muted">
                  Page{" "}
                  <span className="font-medium text-gray-900">{page}</span>
                  {lastPage ? (
                    <span>
                      {" "}
                      / <span className="font-medium text-gray-900">{lastPage}</span>
                    </span>
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

                {/* ✅ Bottom pagination */}
                <div className="mt-6 flex items-center justify-center gap-2">
                  <button
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={!canPrev}
                  >
                    Prev
                  </button>

                  <div className="text-sm text-muted">
                    Page{" "}
                    <span className="font-medium text-gray-900">{page}</span>
                    {lastPage ? (
                      <span>
                        {" "}
                        / <span className="font-medium text-gray-900">{lastPage}</span>
                      </span>
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
          </div>
        </div>
      </section>
    </main>
  );
} 