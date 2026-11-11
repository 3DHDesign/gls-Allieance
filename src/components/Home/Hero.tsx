import { useEffect, useMemo, useState } from "react";
import type { Settings } from "react-slick";
import Slider from "react-slick";
import { motion, type Variants } from "framer-motion";
import { FiArrowRight, FiGlobe, FiPlay } from "react-icons/fi";
import { getHomeHeroes, type HomeHeroApiItem } from "../../api/homeHeroes";

type Slide = {
  id: number;
  image: string;
  title: string;
  subtitle: string;
};

const fadeUp: Variants = {
  hidden: { opacity: 0, x: -34, filter: "blur(5px)" },
  show: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
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

        <div className="absolute inset-0 bg-[#031837]/20" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(1,14,36,0.9)_0%,rgba(3,24,55,0.62)_28%,rgba(3,24,55,0.22)_58%,rgba(3,24,55,0.04)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#031837]/45 via-transparent to-[#031837]/10" />
      </div>

      {/* content */}
      <div className="relative z-10 flex min-h-[68vh] items-center md:min-h-[80vh]">
        <div className="container-wide w-full px-4 py-20 md:py-24">
          <motion.div
            key={slide.id}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="max-w-3xl text-left"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-200 backdrop-blur-md">
              <FiGlobe className="text-sm" />
              Connecting global logistics
            </div>
            <h1
              className="max-w-3xl text-[38px] font-semibold leading-[1.08] text-white sm:text-[48px] md:text-[64px]"
              style={{ textShadow: "0 3px 24px rgba(0,0,0,0.35)" }}
            >
              {slide.title}
            </h1>

            <motion.p
              variants={fadeUp}
              transition={{ delay: 0.18 }}
              className="mt-5 max-w-2xl text-[16px] font-normal leading-7 text-white/85 sm:text-[18px] md:text-[20px]"
              style={{ textShadow: "0 2px 12px rgba(0,0,0,0.35)" }}
            >
              {slide.subtitle}
            </motion.p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="/find-forwarder"
                className="group inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3.5 text-sm font-semibold text-[#031837] shadow-[0_12px_30px_rgba(16,185,129,0.25)] transition hover:-translate-y-0.5 hover:bg-emerald-400"
              >
                Explore the directory
                <FiArrowRight className="transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="/member-registration"
                className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                <FiPlay className="text-xs" />
                Become a member
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 border-t border-white/20 pt-5 text-white/80">
              <div>
                <p className="text-xl font-semibold text-white">Global</p>
                <p className="mt-1 text-xs uppercase tracking-[0.14em]">Network reach</p>
              </div>
              <div>
                <p className="text-xl font-semibold text-white">Trusted</p>
                <p className="mt-1 text-xs uppercase tracking-[0.14em]">Member community</p>
              </div>
              <div>
                <p className="text-xl font-semibold text-white">Connected</p>
                <p className="mt-1 text-xs uppercase tracking-[0.14em]">Business growth</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}