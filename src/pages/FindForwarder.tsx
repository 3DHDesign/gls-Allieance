import { useMemo, useState } from "react"; 
import { FORWARDERS } from "../utils/forwarders";
import DirectoryFilters from "../components/FreightDirectory/DirectoryFilters";
import ResultRow from "../components/FreightDirectory/ResultRow";

export default function FindForwarder() {
  // placeholders (empty) on load
  const [country, setCountry] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [keyword, setKeyword] = useState<string>("");
  const [orderBy, setOrderBy] = useState<string>(""); // placeholder

  const [showResults, setShowResults] = useState(false);

  const filtered = useMemo(() => {
    if (!country) return []; // require a country first
    let list = FORWARDERS.filter((f) => f.country === country);
    if (city && city !== "All Cities") list = list.filter((f) => f.city === city);
    if (keyword.trim()) {
      const q = keyword.toLowerCase();
      list = list.filter((f) => f.name.toLowerCase().includes(q));
    }

    const sortKey = orderBy || "Years (Newest)";
    switch (sortKey) {
      case "A - Z": list.sort((a,b)=>a.name.localeCompare(b.name)); break;
      case "Years (Newest)": list.sort((a,b)=>(b.years??0)-(a.years??0)); break;
      case "Years (Oldest)": list.sort((a,b)=>(a.years??0)-(b.years??0)); break;
      default:
        list.sort((a,b)=>a.city.localeCompare(b.city) || a.name.localeCompare(b.name));
    }
    return list;
  }, [country, city, keyword, orderBy]);

  const onReset = () => {
    setCountry("");
    setCity("");
    setKeyword("");
    setOrderBy("");
    setShowResults(false);
  };

  return (
    <main className="min-h-[70vh] pb-16">
      <section className="container pt-10 md:pt-14">
        <h1 className="text-[28px] md:text-[42px] leading-tight font-bold text-[var(--color-accent)]">
          Find a Freight Forwarder
        </h1>
        <p className="mt-2 max-w-2xl text-muted">
          Pick a country, (optionally) a city or keyword. Results update automatically.
        </p>
      </section>

      <DirectoryFilters
        country={country} setCountry={setCountry}
        city={city} setCity={setCity}
        keyword={keyword} setKeyword={setKeyword}
        orderBy={orderBy} setOrderBy={setOrderBy}
        onReset={onReset}
        onInteract={() => setShowResults(true)}
      />

      <section className="container mt-6">
        {!showResults ? (
          <div className="rounded-2xl bg-white border border-gray-100 p-10 text-center text-muted">
            Choose filters to see the directory.
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl bg-white border border-gray-100 p-10 text-center text-muted">
            No results. Try adjusting filters.
          </div>
        ) : (
          <div className="grid gap-3 md:gap-4">
            {filtered.map((f) => <ResultRow key={f.id} f={f} />)}
          </div>
        )}
      </section>
    </main>
  );
}
