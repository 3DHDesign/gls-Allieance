import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    quote:
      "GLS Alliance helped us find reliable partners in two new regions. Onboarding was smooth and comms were crisp.",
    name: "Ava Patel",
    role: "Head of Logistics",
    company: "BlueWing Logistics",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "t2",
    quote:
      "We cut transit times by 18% after discovering a better customs broker from the directory. Highly recommended.",
    name: "Marcus Lee",
    role: "Operations Manager",
    company: "HarborLine Freight",
    avatar:
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "t3",
    quote:
      "The member network is legit—fast responses, fair pricing, and solid execution on air & sea lanes.",
    name: "Sara Kim",
    role: "Global Trade Lead",
    company: "ClearPort Solutions",
    avatar:
      "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "t4",
    quote:
      "Found warehousing in two cities within a day. The reviews and profiles made decisions easy.",
    name: "Diego Alvarez",
    role: "3PL Coordinator",
    company: "RouteMax 3PL",
    avatar:
      "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?q=80&w=300&auto=format&fit=crop",
  },
];

function TCard({ t }: { t: Testimonial }) {
  return (
    <article className="ts-card rounded-2xl bg-[var(--color-primary)] border border-black/5 shadow-md overflow-hidden">
      <div className="p-6 md:p-8">
        {/* quote */}
        <p className="text-[var(--color-muted)] text-lg md:text-xl leading-relaxed">
          “{t.quote}”
        </p>

        {/* person */}
        <div className="mt-6 flex items-center gap-4">
          <img
            src={t.avatar}
            alt={t.name}
            className="h-12 w-12 md:h-14 md:w-14 rounded-full object-cover ring-2 ring-[var(--color-accent)]/20"
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
  return (
    <section className="py-14">
      <div className="container">
        {/* heading */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--color-muted)]">
            What Members Say
          </h2>
          <p className="mt-2 text-[var(--color-muted)]/80">
            Real results from freight forwarders and logistics teams.
          </p>
          <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-[var(--color-accent)]" />
        </div>

        <div className="relative">
          {/* nav buttons */}
          <button id="ts-prev" className="ts-btn absolute -left-2 md:-left-6 top-1/2 -translate-y-1/2" aria-label="Previous">
            ‹
          </button>
          <button id="ts-next" className="ts-btn absolute -right-2 md:-right-6 top-1/2 -translate-y-1/2" aria-label="Next">
            ›
          </button>

          {/* slider */}
          <Swiper
            className="ts-slider"
            modules={[Navigation, Autoplay]}
            navigation={{ prevEl: "#ts-prev", nextEl: "#ts-next" }}
            centeredSlides
            slidesPerView={"auto"}
            spaceBetween={24}
            loop
            speed={600}
            autoplay={{ delay: 2600, disableOnInteraction: false, pauseOnMouseEnter: true }}
            grabCursor
          >
            {TESTIMONIALS.map((t) => (
              <SwiperSlide key={t.id}>
                <TCard t={t} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
