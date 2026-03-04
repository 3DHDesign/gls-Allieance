import { useEffect, useMemo, useState } from "react";
import type { Settings } from "react-slick";
import Slider from "react-slick";
import { motion, type Variants } from "framer-motion";
import { getHomeHeroes, type HomeHeroApiItem } from "../../api/homeHeroes";

type Slide = {
  id: number;
  image: string;
  title: string;
  subtitle: string;
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

function buildImageUrl(path?: string | null) {
  if (!path) return "";
  if (path.startsWith("http")) return path;

  const apiBase = import.meta.env.VITE_API_BASE_URL as string;
  const siteBase = apiBase.replace(/\/api\/?$/, "");
  return `${siteBase}${path.startsWith("/") ? "" : "/"}${path}`;
}

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [items, setItems] = useState<HomeHeroApiItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await getHomeHeroes();
        const active = res.data
          .filter((h) => h.is_active)
          .sort((a, b) => a.sort_order - b.sort_order);

        if (mounted) setItems(active);
      } catch (err) {
        console.error("Hero load failed", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const slides: Slide[] = useMemo(
    () =>
      items.map((h) => ({
        id: h.id,
        image: buildImageUrl(h.image_desktop_url),
        title: h.title,
        subtitle: h.subtitle,
      })),
    [items]
  );

  const settings: Settings = {
    dots: true,
    arrows: false,
    infinite: slides.length > 1,
    autoplay: slides.length > 1,
    autoplaySpeed: 4200,
    speed: 800,
    fade: true,
    pauseOnHover: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (_old, next) => setCurrent(next),
    appendDots: (dots) => (
      <div style={{ bottom: 22 }}>
        <ul style={{ margin: 0 }}>{dots}</ul>
      </div>
    ),
  };

  if (loading || slides.length === 0) {
    return (
      <section className="min-h-[60vh] md:min-h-[80vh] flex items-center justify-center">
        <div className="text-[var(--color-muted)]">Loading...</div>
      </section>
    );
  }

  const slide = slides[current];

  return (
    <section className="relative min-h-[68vh] md:min-h-[80vh]">
      {/* background slider */}
      <div className="absolute inset-0">
        <Slider {...settings} className="h-full">
          {slides.map((s) => (
            <div key={s.id} className="h-[68vh] md:h-[80vh]">
              <div
                className="h-full w-full bg-no-repeat bg-center bg-cover"
                style={{ backgroundImage: `url(${s.image})` }}
              />
            </div>
          ))}
        </Slider>

        {/* overlay for readability */}
        <div className="absolute inset-0 bg-black/55" />
        {/* extra subtle gradient for “premium” feel */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
      </div>

      {/* content */}
      <div className="relative z-10 h-[68vh] md:h-[80vh] flex items-center">
        <div className="container-wide w-full px-4">
          <motion.div
            key={slide.id}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="mx-auto max-w-3xl text-center"
          >
            {/* Override global h1 sizes with responsive Tailwind */}
            <h1
              className="text-[30px] leading-[38px] sm:text-[36px] sm:leading-[44px] md:text-[48px] md:leading-[56px] font-bold text-white"
              style={{ textShadow: "0 2px 18px rgba(0,0,0,0.45)" }}
            >
              {slide.title}
            </h1>

            {/* Override global p sizes too */}
            <motion.p
              variants={fadeUp}
              transition={{ delay: 0.18 }}
              className="mt-3 text-[15px] leading-[22px] sm:text-[16px] sm:leading-[24px] md:text-[20px] md:leading-[30px] text-white/90 font-normal"
              style={{ textShadow: "0 2px 12px rgba(0,0,0,0.35)" }}
            >
              {slide.subtitle}
            </motion.p>

            {/* Optional CTA (remove if you don’t want) */}
            <div className="mt-6 flex items-center justify-center gap-3">
              <a href="/directory" className="btn-accent">
                Browse Directory
              </a>
              <a
                href="/member-registration"
                className="px-6 py-3 rounded-lg border border-white/35 text-white font-medium hover:bg-white/10 transition"
              >
                Become a Member
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}