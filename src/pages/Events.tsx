import { useMemo, useState } from "react";
import { EVENTS } from "../utils/events";
import EventsFilter from "../components/Events/EventsFilter";
import EventCard from "../components/Events/EventCard";

export default function EventsPage() {
  const [country, setCountry] = useState<string>("");
  const [month, setMonth] = useState<string>(""); // "YYYY-MM"
  const [keyword, setKeyword] = useState<string>("");

  const filtered = useMemo(() => {
    let list = [...EVENTS];
    if (country) list = list.filter(e => e.country === country);
    if (month) list = list.filter(e => e.date.startsWith(month));
    if (keyword.trim()) {
      const q = keyword.toLowerCase();
      list = list.filter(e =>
        e.title.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q)
      );
    }
    // future-first, then soonest
    list.sort((a, b) => +new Date(a.date) - +new Date(b.date));
    return list;
  }, [country, month, keyword]);

  const onReset = () => {
    setCountry("");
    setMonth("");
    setKeyword("");
  };

  return (
    <main className="min-h-[70vh] pb-16 bg-green-100">
      <section className="container pt-10 md:pt-14">
        <h1 className="text-[28px] md:text-[42px] leading-tight font-bold text-[var(--color-accent)]">
          Events & Meetups
        </h1>
        <p className="mt-2 max-w-2xl text-muted">
          Discover upcoming GLS Alliance gatherings, workshops, and expos.
        </p>
      </section>

      <EventsFilter
        country={country} setCountry={setCountry}
        month={month} setMonth={setMonth}
        keyword={keyword} setKeyword={setKeyword}
        onReset={onReset}
      />

      <section className="container mt-6">
        {filtered.length === 0 ? (
          <div className="rounded-2xl bg-white border border-gray-100 p-10 text-center text-muted">
            No events match your filters.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((e) => (
              <EventCard key={e.id} item={e} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
