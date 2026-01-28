import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FiArrowLeft, FiCalendar, FiMapPin, FiExternalLink } from "react-icons/fi";
import { getConferenceBySlug } from "../api/conferences"; 
import type { EventItemUI } from "../types/events";

function buildPoster(url?: string | null, seed?: string) {
  if (url) return url;
  return `https://picsum.photos/seed/${encodeURIComponent(seed || "event")}/1200/700`;
}

export default function EventDetail() {
  const { slug } = useParams();
  const [item, setItem] = useState<EventItemUI | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        const x = slug ? await getConferenceBySlug(slug) : null;

        if (!x) {
          if (mounted) setItem(null);
          return;
        }

        const ui: EventItemUI = {
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
        };

        if (mounted) setItem(ui);
      } catch (e) {
        console.error("Event detail load failed", e);
        if (mounted) setItem(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <main className="pt-24 bg-primary">
        <div className="container py-10 text-[var(--color-muted)]">Loading...</div>
      </main>
    );
  }

  if (!item) {
    return (
      <main className="pt-24 bg-primary">
        <div className="container py-10">
          <Link to="/events" className="inline-flex items-center gap-2 text-[var(--color-accent)]">
            <FiArrowLeft /> Back to Events
          </Link>
          <div className="mt-6 rounded-2xl bg-white border border-black/10 p-8 text-[var(--color-muted)]">
            Event not found.
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 bg-primary text-[var(--color-muted)]">
      <section className="bg-white border-b border-black/10">
        <div className="container py-10">
          <Link to="/events" className="inline-flex items-center gap-2 text-[var(--color-accent)]">
            <FiArrowLeft /> Back to Events
          </Link>

          <h1 className="mt-4 text-[var(--color-black)]">{item.title}</h1>
          <p className="mt-2">{item.intro}</p>

          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <span className="inline-flex items-center gap-2 rounded-full bg-black/5 px-3 py-2">
              <FiCalendar /> {item.dateRange || item.date}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-black/5 px-3 py-2">
              <FiMapPin /> {item.venue} • {item.city}, {item.country}
            </span>
          </div>

          <div className="mt-6 rounded-2xl overflow-hidden border border-black/10">
            <img src={item.poster} alt={item.title} className="w-full h-[320px] md:h-[420px] object-cover" />
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container py-12 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-[var(--color-black)]">Details</h2>
            <p className="mt-3 whitespace-pre-line">{item.description || "—"}</p>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-black/10 bg-white p-6">
              <h3 className="text-[var(--color-black)] font-medium">Location</h3>
              <p className="mt-2">{item.fullAddress || `${item.venue}, ${item.city}, ${item.country}`}</p>

              <div className="mt-4 w-full rounded-2xl overflow-hidden border border-black/10">
                <iframe
                  title="Map"
                  className="w-full h-[260px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    item.fullAddress || `${item.venue}, ${item.city}, ${item.country}`
                  )}&output=embed`}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-6">
              <h3 className="text-[var(--color-black)] font-medium">Links</h3>

              {item.registrationUrl ? (
                <a
                  className="mt-3 btn-accent w-full inline-flex items-center justify-center gap-2"
                  href={item.registrationUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Register <FiExternalLink />
                </a>
              ) : (
                <div className="mt-3 text-sm text-[var(--color-muted)]/70">No registration link</div>
              )}

              {item.website && (
                <a
                  className="mt-3 inline-flex items-center gap-2 text-[var(--color-accent)] hover:underline"
                  href={item.website}
                  target="_blank"
                  rel="noreferrer"
                >
                  Website <FiExternalLink />
                </a>
              )}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
