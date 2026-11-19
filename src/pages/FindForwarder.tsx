import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiArrowLeft,
  FiArrowRight,
  FiGlobe,
  FiGrid,
  FiSearch,
  FiTruck,
} from "react-icons/fi";
import DirectoryFilters from "../components/FreightDirectory/DirectoryFilters";
import ResultRow from "../components/FreightDirectory/ResultRow";
import ExportCategorySidebar from "../components/FreightDirectory/ExportCategorySidebar";
import {
  getMemberDirectory,
  normalizeMembers,
  parsePagination,
  type MemberRow,
} from "../api/memberDirectory";

type DirectoryType = "freight_forwarder" | "importer_exporter";

type DirectoryRow = {
  id: string;
  name: string;
  country: string;
  city: string;
  years?: number;
  tags?: string[];
};

function mapToUI(member: MemberRow): DirectoryRow {
  return {
    id: String(member.id),
    name: member.company_name ?? member.name ?? "Unnamed Company",
    country: member.country ?? "-",
    city: member.city ?? "-",
    years: typeof member.years === "number" ? member.years : undefined,
    tags: member.tags ?? [],
  };
}

export default function FindForwarder() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const initialTab: DirectoryType =
    location.pathname === "/find-exporter" ||
    new URLSearchParams(location.search).get("type") === "exporter"
      ? "importer_exporter"
      : "freight_forwarder";

  const [directoryType, setDirectoryType] =
    useState<DirectoryType>(initialTab);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [keyword, setKeyword] = useState("");
  const [orderBy, setOrderBy] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [rows, setRows] = useState<DirectoryRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState<number | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const perPage = 20;

  const [debouncedKeyword, setDebouncedKeyword] = useState(keyword);
  useEffect(() => {
    const timeout = window.setTimeout(
      () => setDebouncedKeyword(keyword),
      350,
    );
    return () => window.clearTimeout(timeout);
  }, [keyword]);

  useEffect(() => {
    const nextType: DirectoryType =
      location.pathname === "/find-exporter" ||
      new URLSearchParams(location.search).get("type") === "exporter"
        ? "importer_exporter"
        : "freight_forwarder";
    setDirectoryType(nextType);
  }, [location.pathname, location.search]);

  const hasAnyFilter = useMemo(
    () =>
      !!country ||
      (!!city && city !== "All Cities") ||
      !!debouncedKeyword.trim() ||
      (directoryType === "importer_exporter" && !!categoryId),
    [country, city, debouncedKeyword, categoryId, directoryType],
  );

  const firstFilterChange = useRef(true);
  useEffect(() => {
    if (firstFilterChange.current) {
      firstFilterChange.current = false;
      return;
    }
    setPage(1);
  }, [country, city, debouncedKeyword, categoryId, directoryType]);

  useEffect(() => {
    let mounted = true;

    const loadDirectory = async () => {
      try {
        setLoading(true);
        setMessage(null);
        const data = await getMemberDirectory({
          profile_type: directoryType,
          country: country || undefined,
          city: city && city !== "All Cities" ? city : undefined,
          key_word: debouncedKeyword.trim() || undefined,
          category_id:
            directoryType === "importer_exporter" && categoryId
              ? categoryId
              : undefined,
          per_page: perPage,
          page,
        });

        if (!mounted) return;
        const list = normalizeMembers(data).map(mapToUI);
        const pagination = parsePagination(data);
        setRows(list);
        setLastPage(pagination.last_page);
        setTotal(pagination.total);
        if (!pagination.last_page) {
          setLastPage(list.length < perPage ? page : null);
        }
      } catch {
        if (!mounted) return;
        setMessage("Failed to load directory. Please try again.");
        setRows([]);
        setLastPage(null);
        setTotal(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadDirectory();
    return () => {
      mounted = false;
    };
  }, [
    directoryType,
    country,
    city,
    debouncedKeyword,
    categoryId,
    page,
    isAuthenticated,
  ]);

  const sorted = useMemo(() => {
    const list = [...rows];
    switch (orderBy || "A - Z") {
      case "A - Z":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "Years (Newest)":
        list.sort((a, b) => (b.years ?? 0) - (a.years ?? 0));
        break;
      case "Years (Oldest)":
        list.sort((a, b) => (a.years ?? 0) - (b.years ?? 0));
        break;
      case "City":
        list.sort(
          (a, b) =>
            a.city.localeCompare(b.city) || a.name.localeCompare(b.name),
        );
        break;
      default:
        list.sort(
          (a, b) =>
            a.city.localeCompare(b.city) || a.name.localeCompare(b.name),
        );
    }
    return list;
  }, [rows, orderBy]);

  const changeDirectoryType = (nextType: DirectoryType) => {
    setDirectoryType(nextType);
    setCountry("");
    setCity("");
    setKeyword("");
    setDebouncedKeyword("");
    setCategoryId(null);
    setOrderBy("");
    setPage(1);
    navigate(
      nextType === "importer_exporter"
        ? "/find-exporter"
        : "/find-forwarder",
      { replace: true },
    );
  };

  const resetFilters = () => {
    setCountry("");
    setCity("");
    setKeyword("");
    setDebouncedKeyword("");
    setCategoryId(null);
    setOrderBy("");
    setPage(1);
    setMessage(null);
  };

  const canPrev = page > 1 && !loading;
  const canNext =
    !loading &&
    (lastPage ? page < lastPage : rows.length === perPage);

  const paginationControls = (
    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
      <button
        type="button"
        className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 disabled:opacity-40"
        onClick={() => setPage((current) => Math.max(1, current - 1))}
        disabled={!canPrev}
        aria-label="Previous page"
      >
        <FiArrowLeft />
      </button>
      <div className="min-w-16 text-center text-xs font-bold text-slate-500">
        {page}{lastPage ? ` / ${lastPage}` : ""}
      </div>
      <button
        type="button"
        className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 disabled:opacity-40"
        onClick={() => setPage((current) => current + 1)}
        disabled={!canNext}
        aria-label="Next page"
      >
        <FiArrowRight />
      </button>
    </div>
  );

  return (
    <main className="min-h-[70vh] bg-[#f7f9fc] pb-16 pt-[78px]">
      <section className="relative isolate min-h-[330px] overflow-hidden bg-[#061a35]">
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero_image_01.avif')" }}
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(105deg,rgba(3,24,55,0.98)_8%,rgba(3,24,55,0.82)_55%,rgba(3,24,55,0.38))]" />
        <div className="absolute -right-24 -top-28 -z-10 h-96 w-96 rounded-full border-[70px] border-emerald-300/[0.06]" />
        <div className="absolute bottom-0 right-[12%] -z-10 h-32 w-32 rounded-full bg-blue-400/[0.08] blur-3xl" />
        <div className="container flex min-h-[330px] flex-col justify-center gap-8 py-12 md:flex-row md:items-center md:justify-between md:py-14">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-emerald-300">
              Global member directory
            </p>
            <h1 className="text-3xl font-bold leading-tight text-white md:text-5xl">
              Find trusted business partners
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/80 md:text-lg">
              Discover freight specialists and international trade members across the GLS network.
            </p>
          </div>
          <div className="hidden items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] px-5 py-4 text-white backdrop-blur-md md:flex">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-400 text-[#061a35]">
              <FiGrid />
            </span>
            <div>
              <p className="text-xs text-blue-200">Directory access</p>
              <p className="mt-1 text-sm font-bold">{typeof total === "number" ? `${total} members found` : "Verified members"}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container relative z-20 -mt-8">
        <div className="grid max-w-[760px] rounded-2xl border border-white/70 bg-white/95 p-2 shadow-[0_18px_45px_rgba(1,30,79,0.16)] backdrop-blur-xl sm:grid-cols-2">
          <button
            type="button"
            onClick={() => changeDirectoryType("freight_forwarder")}
            className={`rounded-xl px-5 py-4 text-sm font-bold transition ${
              directoryType === "freight_forwarder"
                ? "bg-[linear-gradient(135deg,var(--color-accent),var(--color-accent-mid))] text-white shadow-[0_10px_24px_rgba(1,30,79,0.22)]"
                : "text-slate-500 hover:bg-slate-50 hover:text-[var(--color-accent)]"
            }`}
          >
            <FiTruck className="mr-2 inline" /> Freight forwarders
          </button>
          <button
            type="button"
            onClick={() => changeDirectoryType("importer_exporter")}
            className={`rounded-xl px-5 py-4 text-sm font-bold transition ${
              directoryType === "importer_exporter"
                ? "bg-[linear-gradient(135deg,var(--color-accent),var(--color-accent-mid))] text-white shadow-[0_10px_24px_rgba(1,30,79,0.22)]"
                : "text-slate-500 hover:bg-slate-50 hover:text-[var(--color-accent)]"
            }`}
          >
            <FiGlobe className="mr-2 inline" /> Exporters & importers
          </button>
        </div>
      </section>

      <DirectoryFilters
        profileType={directoryType}
        country={country}
        setCountry={setCountry}
        city={city}
        setCity={setCity}
        keyword={keyword}
        setKeyword={setKeyword}
        orderBy={orderBy}
        setOrderBy={setOrderBy}
        onReset={resetFilters}
      />

      <section className="container mt-6">
        <div
          className={
            directoryType === "importer_exporter"
              ? "grid gap-6 lg:grid-cols-[340px_1fr]"
              : ""
          }
        >
          {directoryType === "importer_exporter" && (
            <div className="h-fit lg:sticky lg:top-24">
              <ExportCategorySidebar
                selectedCategoryId={categoryId}
                onSelectCategory={setCategoryId}
              />
            </div>
          )}

          <div className="min-w-0">
            <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-[0_8px_24px_rgba(15,35,75,0.04)] sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-slate-500">
                <span className="font-bold text-[#0b1f3b]">
                  {hasAnyFilter ? "Filtered members" : "Latest members"}
                </span>
                {typeof total === "number" && (
                  <span className="ml-2">
                    · {total} results
                  </span>
                )}
              </div>
              {paginationControls}
            </div>

            {loading ? (
              <div className="grid gap-3">
                {[0, 1, 2, 3].map((item) => (
                  <div key={item} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-slate-100" />
                      <div className="flex-1">
                        <div className="h-4 w-2/5 rounded bg-slate-100" />
                        <div className="mt-3 h-3 w-1/3 rounded bg-slate-100" />
                      </div>
                      <div className="hidden h-8 w-28 rounded-full bg-slate-100 md:block" />
                    </div>
                  </div>
                ))}
              </div>
            ) : message ? (
              <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center text-sm text-slate-500">
                {message}
              </div>
            ) : sorted.length === 0 ? (
              <div className="grid min-h-64 place-items-center rounded-[24px] border border-dashed border-slate-300 bg-white px-6 text-center">
                <div>
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-xl text-[var(--color-accent)]">
                    <FiSearch />
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-[#0b1f3b]">No matching members</h3>
                  <p className="mt-2 text-sm text-slate-500">Try another country, city or keyword.</p>
                </div>
              </div>
            ) : (
              <>
                <div className="grid gap-3 md:gap-4">
                  {sorted.map((member) => (
                    <ResultRow
                      key={member.id}
                      f={member as any}
                      isAuthenticated={isAuthenticated}
                      loginPath={`/login?next=${encodeURIComponent(`/forwarder/${member.id}`)}`}
                    />
                  ))}
                </div>
                <div className="mt-6 flex justify-center">
                  {paginationControls}
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
