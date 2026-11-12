import React, { useState } from "react";
import ResourceImageModal from "./ResourceImageModal";

type ULDType = "Container ULD" | "Pallet ULD" | "Special ULD";

type ULD = {
  id: string;
  code: string;
  name: string;
  type: ULDType;
  image: string; // Added image property
  base: string;
  height: string;
  aircraft: string;
  maxGross: string;
  use: string;
};

const ulds: ULD[] = [
  {
    id: "amp",
    code: "AMP",
    name: "AMP",
    image: "/images/container/air/amp.png",
    type: "Container ULD",
    base: "244 cm × 317.5 cm (96\" × 125\")",
    height: "161 cm (63.3\")",
    aircraft: "B777, A380, A350 (lower deck)",
    maxGross: "6,804 kg (Volume: 10.8 m³)",
    use: "Full-width lower-deck container; requires base support (no direct forklift lifting).",
  },
  {
    id: "horse-stall",
    code: "HMC",
    name: "Horse Stall",
    image: "/images/container/air/horsestall.png",
    type: "Special ULD",
    base: "223 cm × 317.5 cm (88\" × 125\")",
    height: "244 cm (96\")",
    aircraft: "B777F, B747F (freighter main deck)",
    maxGross: "3,500 kg (Volume: 15.3 m³)",
    use: "IATA-specified air stable (canvas top or solid roof) designed to safely transport up to 3 horses.",
  },
  {
    id: "ld3-ake-metal",
    code: "AKE",
    name: "LD3 (AKE metal door)",
    image: "/images/container/air/ld3-ake-metal-door.png",
    type: "Container ULD",
    base: "153.4 cm × 156.2 cm (200.7 cm top width)",
    height: "162.5 cm (64\")",
    aircraft: "A380, A350, B777 (lower deck)",
    maxGross: "1,587 kg (Volume: 4.3 m³)",
    use: "Half-length lower-deck container with solid metal door for general cargo and baggage.",
  },
  {
    id: "ld3-ake-canvas",
    code: "AKE",
    name: "LD3 (AKE canvas door)",
    image: "/images/container/air/ld3-ake-canvas-door-.png",
    type: "Container ULD",
    base: "153.4 cm × 156.2 cm (200.7 cm top width)",
    height: "162.5 cm (64\")",
    aircraft: "A380, A350, B777 (lower deck)",
    maxGross: "1,587 kg (Volume: 4.3 m³)",
    use: "Lightweight half-length lower-deck container with zippered canvas door for general cargo and baggage.",
  },
  {
    id: "ld3-rke",
    code: "RKE",
    name: "LD3 RKE",
    image: "/images/container/air/ld3-rke-.png",
    type: "Special ULD",
    base: "153.4 cm × 156.2 cm (200.7 cm top width)",
    height: "162.5 cm (64\")",
    aircraft: "A380, A350, B777 (lower deck)",
    maxGross: "1,587 kg (Volume: 3.9 m³)",
    use: "White insulated LD3 container with internal thermal lining and coolant trays for temperature-sensitive cargo.",
  },
  {
    id: "ld6-alf",
    code: "ALF",
    image: "/images/container/air/ld6-.png",
    name: "LD6",
    type: "Container ULD",
    base: "317.5 cm × 153.4 cm (406.4 cm top width)",
    height: "162.5 cm (64\")",
    aircraft: "A380, A350, B777 (lower deck)",
    maxGross: "3,174 kg (Volume: 8.7 m³)",
    use: "Full-length double-contoured lower-deck container for higher-volume shipments.",
  },
  {
    id: "ld36-amf",
    code: "AMF",
    name: "LD36",
    image: "/images/container/air/ld36-.png",
    type: "Container ULD",
    base: "244 cm × 317.5 cm (406.4 cm top width)",
    height: "162.5 cm (64\")",
    aircraft: "B777, A380, A350 (lower deck)",
    maxGross: "5,000 kg (Volume: 14.5 m³)",
    use: "Full-length contoured lower-deck container designed to maximize wide-body hold volume.",
  },
  {
    id: "pmc-pag",
    code: "PMC / PAG",
    name: "Pallet (PMC / PAG)",
    image: "/images/container/air/pag-.png",
    type: "Pallet ULD",
    base: "244 cm × 317.5 cm / 223 cm × 317.5 cm",
    height: "157.5 cm (62\") lower deck; up to 300 cm (118\") main deck",
    aircraft: "B777, A380, A350 (lower deck) & B777F / B747F (main deck)",
    maxGross: "6,804 kg (restricted by aircraft bay limit)",
    use: "Contoured lower-deck and main-deck pallets secured with cargo nets.",
  },
  {
    id: "pga",
    code: "PGA",
    name: "PGA",
    image: "/images/container/air/pga20.png",
    type: "Pallet ULD",
    base: "244 cm × 605.8 cm (96\" × 238.5\")",
    height: "244 cm–299.7 cm (96\"–118\") main deck contour",
    aircraft: "B777F, B747F (freighter main deck only)",
    maxGross: "13,608 kg (Volume: 38.0 m³)",
    use: "20ft main-deck pallet for oversized and heavy freighter cargo.",
  },
  {
    id: "pkc",
    code: "PKC",
    name: "PKC",
    image: "/images/container/air/pkc.png",
    type: "Pallet ULD",
    base: "153.4 cm × 156.2 cm (60.4\" × 61.5\")",
    height: "157.5 cm (62\")",
    aircraft: "A380, A350, B777 (lower deck)",
    maxGross: "1,587 kg (Volume: 3.6 m³)",
    use: "LD3-base flat pallet with net for compact lower-deck cargo.",
  },
  {
    id: "pla",
    code: "PLA",
    name: "PLA",
    image: "/images/container/air/pla.png",
    type: "Pallet ULD",
    base: "153.4 cm × 317.5 cm (60.4\" × 125\")",
    height: "162.5 cm (64\")",
    aircraft: "B777, A380, A350 (lower deck)",
    maxGross: "3,175 kg (Volume: 7.1 m³)",
    use: "Half-width 10ft thin-edge pallet for lower-deck cargo.",
  },
  {
    id: "pmc",
    code: "PMC",
    name: "PMC",
    image: "/images/container/air/pmc.png",
    type: "Pallet ULD",
    base: "244 cm × 317.5 cm (96\" × 125\")",
    height: "157.5 cm (62\") lower deck",
    aircraft: "B777, A380, A350 (lower deck) & Freighters",
    maxGross: "6,804 kg (Volume: 10.9 m³)",
    use: "Standard 10ft pallet contoured for wide-body lower deck and main deck.",
  },
  {
    id: "pmc-q4",
    code: "PMC Q4",
    name: "PMC Q4",
    image: "/images/container/air/pmc-q4.png",
    type: "Pallet ULD",
    base: "244 cm × 317.5 cm (96\" × 125\")",
    height: "294 cm (116\") max; 132 cm (52\") contour side",
    aircraft: "B777F, B747F (freighter main deck only)",
    maxGross: "6,804 kg (Volume: 17.0 m³)",
    use: "Contoured main-deck freighter pallet (Contour Code L) for stepped upper-fuselage positions.",
  },
  {
    id: "pmc-q5",
    code: "PMC Q5",
    name: "PMC Q5",
    image: "/images/container/air/pmc-q5.png",
    type: "Pallet ULD",
    base: "244 cm × 317.5 cm (96\" × 125\")",
    height: "300 cm (118\") max; 193 cm (76\") contour side",
    aircraft: "B777F, B747F (freighter main deck only)",
    maxGross: "6,804 kg (Volume: 19.0 m³)",
    use: "Contoured main-deck freighter pallet (Contour Code X) for mid-fuselage freighter positions.",
  },
  {
    id: "pmc-q6",
    code: "PMC Q6",
    name: "PMC Q6",
    image: "/images/container/air/pmc-q6.png",
    type: "Pallet ULD",
    base: "244 cm × 317.5 cm (96\" × 125\")",
    height: "300 cm (118\") max; 244 cm (96\") contour side",
    aircraft: "B777F, B747F (freighter main deck only)",
    maxGross: "6,804 kg (Volume: 21.2 m³)",
    use: "High-capacity contoured main-deck freighter pallet.",
  },
  {
    id: "pmc-q7",
    code: "PMC Q7",
    name: "PMC Q7",
    image: "/images/container/air/pmc-q7.png",
    type: "Pallet ULD",
    base: "244 cm × 317.5 cm (96\" × 125\")",
    height: "300 cm (118\") max; 244 cm (96\") contour side",
    aircraft: "B777F, B747F (freighter main deck only)",
    maxGross: "6,804 kg (Volume: 21.5 m³)",
    use: "Contoured main-deck freighter pallet (Contour Code D) maximizing main-deck height.",
  },
  {
    id: "pna",
    code: "PNA",
    name: "PNA",
    image: "/images/container/air/pmck-q6.png",
    type: "Pallet ULD",
    base: "153.4 cm × 244 cm (60.4\" × 96\")",
    height: "162.5 cm (64\")",
    aircraft: "B777, A380, A350 (lower deck)",
    maxGross: "2,449 kg",
    use: "Half-pallet with cargo net for compact lower-deck loads.",
  },
  {
    id: "pyb",
    code: "PYB",
    name: "PYB",
    image: "/images/container/air/pyb.png",
    type: "Pallet ULD",
    base: "139.7 cm × 244 cm (55\" × 96\")",
    height: "244 cm–300 cm (96\"–118\")",
    aircraft: "B777F, B747F (freighter main deck only)",
    maxGross: "3,175 kg",
    use: "Narrow main-deck freighter pallet for specialized cargo configurations.",
  },
  {
    id: "rkn",
    code: "RKN",
    name: "RKN",
    image: "/images/container/air/d.png",
    type: "Special ULD",
    base: "153.4 cm × 156.2 cm (200.7 cm top width)",
    height: "162.5 cm (64\")",
    aircraft: "A380, A350, B777 (lower deck)",
    maxGross: "1,587 kg",
    use: "Active temperature-controlled LD3 container for pharmaceuticals and sensitive cargo.",
  },

];

type FilterId = "all" | ULDType;

const uldFilterChips: { id: FilterId; label: string }[] = [
  { id: "all", label: "All ULDs" },
  { id: "Container ULD", label: "Container ULDs" },
  { id: "Pallet ULD", label: "Pallet ULDs" },
  { id: "Special ULD", label: "Special Units" },
];

export const AirFreightSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");
  const [preview, setPreview] = useState<ULD | null>(null);

  const filteredUlds =
    activeFilter === "all"
      ? ulds
      : ulds.filter((u) => u.type === activeFilter);

  return (
    <div className="container px-4 py-8 sm:px-6 sm:py-10 md:py-14">
      <header className="mb-6 md:mb-8">
        <h2>Air Freight Containers &amp; ULD Equipment</h2>
        <p className="mt-2 text-muted max-w-2xl">
          Overview of common unit load devices (ULDs) used in international air
          cargo operations. Values are indicative and may differ by airline and
          ULD manufacturer.
        </p>

        {/* Filter chips */}
        <div className="mt-3 flex flex-wrap gap-2 text-[11px] md:text-xs">
          {uldFilterChips.map((chip) => {
            const isActive = chip.id === activeFilter;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => setActiveFilter(chip.id)}
                className={[
                  "rounded-full border px-3 py-1 transition-colors",
                  isActive
                    ? "bg-[#0A2542] border-[#0A2542] text-white"
                    : "bg-white border-gray-300 text-[#374151] hover:border-[#0A58FF] hover:text-[#0A58FF]",
                ].join(" ")}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </header>

      <div className="grid gap-5 lg:gap-8 md:grid-cols-2">
        {filteredUlds.map((u) => (
          <article
            key={u.id}
            className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_35px_rgba(15,23,42,0.1)]"
          >
            <button
              type="button"
              className="block w-full text-left"
              onClick={() => setPreview(u)}
              aria-label={`Expand image for ${u.name}`}
            >
              {/* Image Container */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-white sm:aspect-[16/8]">
                <img
                  src={u.image}
                  alt={`${u.code} - ${u.name}`}
                  loading="lazy"
                  className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                />
                {/* Subtle gradient overlay so the badge stays readable on light photos */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-2 rounded-full bg-black/65 px-2.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                  {u.code}
                </span>
              </div>

              <span className="block bg-[#f8fafc] px-4 py-2 text-center text-[10px] font-medium text-[var(--color-accent-light)]">
                Click to expand
              </span>
            </button>

            <div className="p-4 sm:p-5 md:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="min-w-0 flex-1 text-[17px] font-semibold leading-snug text-[#111827] md:text-lg">
                  {u.code} – {u.name}
                </h3>
                <span className="inline-flex shrink-0 items-center rounded-full border border-[#0A2542] px-3 py-1 text-[11px] font-medium text-[#0A2542]">
                  {u.type}
                </span>
              </div>

              <dl className="mt-5 grid gap-x-5 gap-y-4 border-y border-gray-100 py-4 text-[13px] text-[#374151] md:grid-cols-2 md:text-sm">
                <div className="min-w-0">
                  <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#6B7280]">
                    Base
                  </dt>
                  <dd className="mt-1">{u.base}</dd>
                </div>
                <div className="min-w-0">
                  <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#6B7280]">
                    Height
                  </dt>
                  <dd className="mt-1">{u.height}</dd>
                </div>
                <div className="min-w-0">
                  <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#6B7280]">
                    Typical aircraft
                  </dt>
                  <dd className="mt-1">{u.aircraft}</dd>
                </div>
                <div className="min-w-0">
                  <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#6B7280]">
                    Max gross
                  </dt>
                  <dd className="mt-1">{u.maxGross}</dd>
                </div>
              </dl>

              <div className="mt-4 rounded-xl bg-[#f8fafc] p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#0A2542]">
                  Best for
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-[#6B7280] md:text-sm">
                  {u.use}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>

      {preview && (
        <ResourceImageModal
          label={`${preview.code} – ${preview.name}`}
          code={preview.code}
          imageUrl={preview.image} // Pass the image URL to your modal
          onClose={() => setPreview(null)}
        />
      )}
    </div>
  );
};