import { useState } from "react";
import { FiMapPin, FiCalendar } from "react-icons/fi"; 
import { Link } from "react-router-dom";
import type { EventItemUI } from "../../types/events";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export default function EventCard({ item }: { item: EventItemUI }) {
  const [imgSrc, setImgSrc] = useState(item.poster);
  const [loaded, setLoaded] = useState(false);
  const [broken, setBroken] = useState(false);

  const fallback = `https://picsum.photos/seed/${encodeURIComponent(
    item.slug || String(item.id)
  )}/900/600`;

  return (
    <Link to={`/events/${item.slug}`} className="block">
      <article className="rounded-2xl bg-white border border-gray-100 shadow hover:shadow-lg transition overflow-hidden">
        <div className="relative aspect-[16/9]">
          {!loaded && <div className="absolute inset-0 animate-pulse bg-gray-100" />}
          <img
            src={imgSrc}
            alt={item.title}
            className={`h-full w-full object-cover ${
              loaded ? "opacity-100" : "opacity-0"
            } transition-opacity`}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            onError={() => {
              if (!broken) {
                setBroken(true);
                setImgSrc(fallback);
              }
            }}
          />
        </div>

        <div className="p-4 md:p-5">
          <div className="flex flex-wrap items-center gap-2 text-xs mb-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1">
              <FiCalendar /> {formatDate(item.date)}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1">
              <FiMapPin /> {item.city}, {item.country}
            </span>
            {(item.tags ?? []).map((t) => (
              <span key={t} className="rounded-full border border-gray-200 px-2 py-1">
                {t}
              </span>
            ))}
          </div>

          <h3 className="text-lg md:text-xl font-medium text-gray-900">
            {item.title}
          </h3>
          <p className="mt-1 text-sm text-muted">{item.venue}</p>
        </div>
      </article>
    </Link>
  );
}
