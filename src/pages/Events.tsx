import { useEffect, useMemo, useState } from "react";
import EventsFilter from "../components/Events/EventsFilter";
import EventCard from "../components/Events/EventCard";
import { getConferences } from "../api/conferences"; 
import type { EventItemUI } from "../types/events";

function buildPoster(url?: string | null, seed?: string) {
  if (url) return url;
  return `https://picsum.photos/seed/${encodeURIComponent(seed || "event")}/900/600`;
}

export default function EventsPage() {
  const [country, setCountry] = useState("");
  const [month, setMonth] = useState(""); // "YYYY-MM"
  const [keyword, setKeyword] = useState("");

  const [events, setEvents] = useState<EventItemUI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        const res = await getConferences();

        const active = res.data
          .filter((x) => x.status === "active")
          .map<EventItemUI>((x) => ({
            id: x.id,
            slug: x.slug,
            title: x.name,
            intro: x.intro ?? "",
            description: x.description ?? "",
            venue: x.venue ?? "—",
            city: x.city ?? "—",
            country: x.country ?? "—",
            date: x.start_date,
            poster: buildPoster(x.banner_image_url, x.slug),
            dateRange: x.date_range ?? "",
            timeRange: x.time_range ?? "",
            fullAddress: x.full_address ?? "",
            registrationUrl: x.registration_url ?? "",
            website: x.website ?? "",
            contactEmail: x.contact_email ?? "",
            contactPhone: x.contact_phone ?? "",
          }));

        if (mounted) setEvents(active);
      } catch (e) {
        console.error("Events load failed", e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const countries = useMemo(() => {
    const set = new Set<string>();
    events.forEach((e) => e.country && e.country !== "—" && set.add(e.country));
    return Array.from(set).sort();
  }, [events]);

  const months = useMemo(() => {
    const set = new Set<string>();
    events.forEach((e) => {
      if (e.date?.length >= 7) set.add(e.date.slice(0, 7));
    });
    // sort YYYY-MM asc
    return Array.from(set).sort();
  }, [events]);

  const filtered = useMemo(() => {
    let list = [...events];

    if (country) list = list.filter((e) => e.country === country);
    if (month) list = list.filter((e) => e.date.startsWith(month));

    if (keyword.trim()) {
      const q = keyword.toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.venue.toLowerCase().includes(q) ||
          e.city.toLowerCase().includes(q) ||
          e.country.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => +new Date(a.date) - +new Date(b.date));
    return list;
  }, [events, country, month, keyword]);

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
        country={country}
        setCountry={setCountry}
        month={month}
        setMonth={setMonth}
        keyword={keyword}
        setKeyword={setKeyword}
        onReset={onReset}
        countries={countries}
        months={months}
      />

      <section className="container mt-6">
        {loading ? (
          <div className="rounded-2xl bg-white border border-gray-100 p-10 text-center text-muted">
            Loading events...
          </div>
        ) : filtered.length === 0 ? (
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
