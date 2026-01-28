// src/components/FreightListingsSlider.tsx
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, FreeMode } from "swiper/modules";

import "swiper/css";

type Company = {
  id: string;
  title: string;
  image: string;
  blurb: string;
  locations: string;
  services: string[];
};

const DATA: Company[] = [
  { id: "1", title: "BlueWing Logistics", image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1400&auto=format&fit=crop", blurb: "Time‑critical air & multimodal solutions.", locations: "Dubai • Singapore • Hamburg", services: ["Air", "Sea", "Customs"] },
  { id: "2", title: "HarborLine Freight",  image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop", blurb: "FCL/LCL ocean with end‑to‑end visibility.", locations: "Colombo • Rotterdam • Los Angeles", services: ["Sea", "Trucking", "Warehousing"] },
  { id: "3", title: "ClearPort Solutions", image: "https://images.unsplash.com/photo-1554475901-4538ddfbccc2?q=80&w=1400&auto=format&fit=crop", blurb: "Customs brokerage & compliance in 40+ countries.", locations: "Sydney • Toronto • Milan", services: ["Customs", "Air", "Sea"] },
  { id: "4", title: "RouteMax 3PL",       image: "https://images.unsplash.com/photo-1545167622-3a6ac756afa4?q=80&w=1400&auto=format&fit=crop", blurb: "Contract warehousing + nationwide distribution.", locations: "Melbourne • Perth • Brisbane", services: ["Warehousing", "Trucking"] },
  { id: "5", title: "TransRoad Carriers",  image: "https://images.unsplash.com/photo-1534536281715-e28d76689b4d?q=80&w=1400&auto=format&fit=crop", blurb: "FTL/LTL trucking with live tracking.", locations: "Riyadh • Jeddah • Dammam", services: ["Trucking", "Air"] },
];

function Card({ c }: { c: Company }) {
  return (
    <article className="ff-card">
      <div className="relative">
        <img src={c.image} alt={c.title} className="h-44 w-full object-cover" />
        <span className="absolute left-3 top-3 text-[10px] font-semibold tracking-widest text-white bg-black/70 rounded px-2 py-1">
          FREIGHT FORWARDER
        </span>
      </div>

      <div className="p-5">
        <a href="#" className="text-[var(--color-accent)] text-xl font-semibold hover:underline">
          {c.title}
        </a>
        <p className="mt-2 text-[var(--color-muted)]">{c.blurb}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          {c.services.map(s => (
            <span key={s} className="rounded-md bg-black/5 text-[var(--color-muted)] text-xs font-medium px-2.5 py-1">
              {s}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-[var(--color-muted)]/80 text-sm">{c.locations}</span>
          <a href="#" className="btn-accent text-sm px-4 py-2 rounded-md">Get Quote</a>
        </div>
      </div>
    </article>
  );
}

export default function FreightListingsSlider() {
  return (
    <section className="py-14">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--color-muted)]">
            Popular listings
          </h2>
          <p className="mt-2 text-[var(--color-muted)]/80">Discover trusted freight forwarders worldwide.</p>
          <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-[var(--color-accent)]" />
        </div>

        <div className="relative">
          {/* nav zones + buttons */}
          <div className="ff-nav ff-prev pointer-events-none">
            <button id="ff-prev" className="ff-btn pointer-events-auto" aria-label="Previous">‹</button>
          </div>
          <div className="ff-nav ff-next pointer-events-none">
            <button id="ff-next" className="ff-btn pointer-events-auto" aria-label="Next">›</button>
          </div>

          <Swiper
            className="ff-slider"
            modules={[Navigation, Autoplay, FreeMode]}
            navigation={{ prevEl: "#ff-prev", nextEl: "#ff-next" }}
            centeredSlides
            slidesPerView={"auto"}
            spaceBetween={24}
            freeMode={{ enabled: false }}
            loop
            speed={650}
            autoplay={{ delay: 2200, disableOnInteraction: false, pauseOnMouseEnter: true }}
            grabCursor
          >
            {DATA.map((c) => (
              <SwiperSlide key={c.id}>
                <Card c={c} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
