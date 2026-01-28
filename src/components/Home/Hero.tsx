import { useState } from "react";
import type { Settings } from "react-slick";
import Slider from "react-slick";
import { motion, type Variants } from "framer-motion";

type Slide = {
  image: string;
  title: string;
  subtitle: string;
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1], // ≈ easeOut
    },
  },
};
const SLIDES: Slide[] = [
  {
    image:
      "https://lot.dhl.com/wp-content/uploads/2021/11/shutterstock_769253206-scaled.jpg",
    title: "Global Logistics Directory",
    subtitle: "Connect with freight forwarders and members around the world.",
  },
  {
    image: "https://images.pexels.com/photos/4484075/pexels-photo-4484075.jpeg",
    title: "Find Members Worldwide",
    subtitle: "Discover trusted companies in every major trade lane.",
  },
  {
    image: "https://images.pexels.com/photos/6169661/pexels-photo-6169661.jpeg",
    title: "Your Freight Network Hub",
    subtitle: "One directory. Multiple partners. Global reach.",
  },
  {
    image: "https://sinay.ai/wp-content/uploads/2025/03/role-of-a-logistic-manager-scaled.jpg",
    title: "Your Freight Network Hub",
    subtitle: "One directory. Multiple partners. Global reach.",
  },
];

 
  
export default function Hero() {
  const [current, setCurrent] = useState<number>(0);

  const settings: Settings = {
    dots: true,
    arrows: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4200,
    speed: 800,
    fade: true,
    pauseOnHover: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (_old, next) => setCurrent(next),
  };

  const slide = SLIDES[current];

  return (
    <section className="relative min-h-[60vh] md:min-h-[80vh]">
      {/* background slider */}
      <div className="absolute inset-0">
        <Slider {...settings} className="h-full">
          {SLIDES.map((s) => (
            <div key={s.image} className="h-[60vh] md:h-[80vh]">
              <div
                className="h-full w-full bg-no-repeat bg-center bg-cover"
                style={{ backgroundImage: `url(${s.image})` }}
              />
            </div>
          ))}
        </Slider>
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* content */}
      <div className="relative z-10 flex items-center justify-center h-[60vh] md:h-[80vh] text-center px-4">
  <motion.div key={current} initial="hidden" animate="show" variants={fadeUp}>
    <h1 className="mb-3" style={{ textShadow: "0 2px 18px rgba(0,0,0,0.45)" }}>
      {slide.title}
    </h1>

    <motion.p
      className="hero-sub"
      style={{ textShadow: "0 2px 12px rgba(0,0,0,0.35)" }}
      variants={fadeUp}
      transition={{ delay: 0.18, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {slide.subtitle}
    </motion.p>
  </motion.div>
</div>

    </section>
  );
}
