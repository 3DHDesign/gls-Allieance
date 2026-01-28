import { useEffect, useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import { getTestimonials, type TestimonialApiItem } from "../../api/testimonials";

type UiTestimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
};

function buildImageUrl(path?: string | null) {
  if (!path) return "/images/avatar-placeholder.png"; // add your placeholder
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  // base URL without /api
  const apiBase = (import.meta.env.VITE_API_BASE_URL as string) || "";
  const siteBase = apiBase.replace(/\/api\/?$/, "");
  return `${siteBase}${path.startsWith("/") ? "" : "/"}${path}`;
}

function TCard({ t }: { t: UiTestimonial }) {
  return (
    <article className="ts-card rounded-2xl bg-[var(--color-primary)] border border-black/5 shadow-md overflow-hidden">
      <div className="p-6 md:p-8">
        <p className="text-[var(--color-muted)] text-lg md:text-xl leading-relaxed">
          “{t.quote}”
        </p>

        <div className="mt-6 flex items-center gap-4">
          <img
            src={t.avatar}
            alt={t.name}
            className="h-12 w-12 md:h-14 md:w-14 rounded-full object-cover ring-2 ring-[var(--color-accent)]/20"
            loading="lazy"
          />
          <div>
            <div className="text-base md:text-lg font-semibold text-[var(--color-accent)]">
              {t.name}
            </div>
            <div className="text-[var(--color-muted)]/80 text-sm">
              {t.role} • {t.company}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function TestimonialSlider() {
  const [items, setItems] = useState<TestimonialApiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getTestimonials();
        const active = (data.data || []).filter((t) => t.status === "active");

        if (mounted) setItems(active);
      } catch (e: any) {
        if (mounted) setError(e?.message || "Failed to load testimonials");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const testimonials: UiTestimonial[] = useMemo(() => {
    return items.map((t) => ({
      id: String(t.id),
      quote: t.message,
      name: t.name,
      role: t.designation,
      company: t.company,
      avatar: buildImageUrl(t.image_url),
    }));
  }, [items]);

  return (
    <section className="py-14">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--color-muted)]">
            What Members Say
          </h2>
          <p className="mt-2 text-[var(--color-muted)]/80">
            Real results from freight forwarders and logistics teams.
          </p>
          <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-[var(--color-accent)]" />
        </div>

        {loading && (
          <div className="text-center text-[var(--color-muted)]/80">
            Loading testimonials...
          </div>
        )}

        {!loading && error && (
          <div className="text-center text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && testimonials.length === 0 && (
          <div className="text-center text-[var(--color-muted)]/80">
            No testimonials yet.
          </div>
        )}

        {!loading && !error && testimonials.length > 0 && (
          <div className="relative">
            <button
              id="ts-prev"
              className="ts-btn absolute -left-2 md:-left-6 top-1/2 -translate-y-1/2"
              aria-label="Previous"
            >
              ‹
            </button>
            <button
              id="ts-next"
              className="ts-btn absolute -right-2 md:-right-6 top-1/2 -translate-y-1/2"
              aria-label="Next"
            >
              ›
            </button>

            <Swiper
              className="ts-slider"
              modules={[Navigation, Autoplay]}
              navigation={{ prevEl: "#ts-prev", nextEl: "#ts-next" }}
              centeredSlides
              slidesPerView={"auto"}
              spaceBetween={24}
              loop={testimonials.length > 1}
              speed={600}
              autoplay={
                testimonials.length > 1
                  ? { delay: 2600, disableOnInteraction: false, pauseOnMouseEnter: true }
                  : false
              }
              grabCursor
            >
              {testimonials.map((t) => (
                <SwiperSlide key={t.id}>
                  <TCard t={t} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>
    </section>
  );
}
