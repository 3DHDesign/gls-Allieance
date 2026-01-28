// src/components/PopularCategories.tsx
import  { useState } from "react";

type Item = { title: string; count: number; img: string };

const FALLBACK = (seed: string, w = 900, h = 560) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;

const ITEMS: Item[] = [
  { title: "Air Freight",          count: 122, img: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1400&auto=format&fit=crop" },
  { title: "Sea Freight",          count: 245, img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop" },
  { title: "Customs Clearance",    count: 95,  img: "https://images.unsplash.com/photo-1554475901-4538ddfbccc2?q=80&w=1400&auto=format&fit=crop" },
  { title: "Warehousing",          count: 123, img: "https://images.unsplash.com/photo-1545167622-3a6ac756afa4?q=80&w=1400&auto=format&fit=crop" },
  { title: "Trucking",             count: 92,  img: "https://images.unsplash.com/photo-1534536281715-e28d76689b4d?q=80&w=1400&auto=format&fit=crop" },
  { title: "End-to-End Logistics", count: 92,  img: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?q=80&w=1400&auto=format&fit=crop" },
];

function SafeImage({ src, alt, seed }: { src: string; alt: string; seed: string }) {
  const [imgSrc, setImgSrc] = useState(src);
  return (
    <img
      src={imgSrc}
      alt={alt}
      loading="lazy"
      className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
      onError={() => setImgSrc(FALLBACK(seed))}
    />
  );
}

export default function PopularCategories({
  onCardClick,
}: {
  onCardClick?: (title: string) => void;
}) {
  return (
    <section className="py-12">
      <div className="container">
        {/* heading */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--color-muted)]">
            Popular Categories
          </h2>
          <p className="mt-2 text-[var(--color-muted)]/80">
            We move your world — reliably and fast.
          </p>
          <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-[var(--color-accent)]" />
        </div>

        {/* grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((it) => (
            <button
              key={it.title}
              type="button"
              onClick={() => onCardClick?.(it.title)}
              className="group relative overflow-hidden rounded-xl shadow-md bg-[var(--color-primary)] text-left focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40"
            >
              <SafeImage src={it.img} alt={it.title} seed={it.title} />

              {/* bottom gradient */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-5">
                <span className="inline-block rounded-md bg-[var(--color-accent)] px-2.5 py-1 text-xs font-semibold text-white shadow">
                  {it.count} Locations
                </span>
                <h3 className="mt-3 text-2xl font-extrabold text-white drop-shadow">
                  {it.title}
                </h3>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
