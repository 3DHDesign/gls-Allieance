import React, { useState } from "react";

type ULDType = "Container ULD" | "Pallet ULD" | "Special ULD";

type ULD = {
  id: string;
  code: string;
  name: string;
  type: ULDType;
  base: string;
  height: string;
  aircraft: string;
  maxGross: string;
  use: string;
};

const ulds: ULD[] = [
  {
    id: "ake",
    code: "AKE",
    name: "LD3 Container",
    type: "Container ULD",
    base: "≈ 1.53 m × 1.56 m",
    height: "≈ 1.63 m contour",
    aircraft: "A330, A350, B777 (lower deck)",
    maxGross: "≈ 1,588 kg (indicative)",
    use: "General cargo and baggage on wide-body passenger aircraft.",
  },
  {
    id: "akh",
    code: "AKH",
    name: "LD3 Half-Height",
    type: "Container ULD",
    base: "≈ 1.53 m × 1.56 m",
    height: "Lower height than LD3",
    aircraft: "A320 family, selected narrow-body aircraft",
    maxGross: "≈ 1,134 kg (indicative)",
    use: "Compact unit where hold height is limited.",
  },
  {
    id: "ama",
    code: "AMA",
    name: "LD39 Wide Container",
    type: "Container ULD",
    base: "≈ 2.44 m × 3.18 m",
    height: "Main-deck contour",
    aircraft: "Freighters (B747F, B777F, etc.)",
    maxGross: "≈ 6,800 kg (indicative)",
    use: "Large volume cargo on freighter main decks.",
  },
  {
    id: "pmc",
    code: "PMC",
    name: '96" × 125" Pallet',
    type: "Pallet ULD",
    base: "≈ 2.44 m × 3.18 m",
    height: "Depends on build-up limit",
    aircraft: "B777, A330 and many freighters",
    maxGross: "≈ 6,800–11,300 kg",
    use: "Standard main-deck pallet for built-up loads.",
  },
  {
    id: "pag",
    code: "PAG",
    name: "P1P / PAG Pallet",
    type: "Pallet ULD",
    base: "≈ 2.44 m × 3.18 m",
    height: "Varies by contour",
    aircraft: "Wide-body passenger and freighter",
    maxGross: "≈ 4,600–11,300 kg",
    use: "Flexible pallet used with nets and contour covers.",
  },
  {
    id: "special",
    code: "RKN / RAP",
    name: "Active Temperature-Controlled Unit",
    type: "Special ULD",
    base: "Standard ULD base footprint",
    height: "Container profile",
    aircraft: "Various wide-body aircraft",
    maxGross: "Varies by model",
    use: "High-value pharmaceutical and temperature-sensitive cargo.",
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

  const filteredUlds =
    activeFilter === "all"
      ? ulds
      : ulds.filter((u) => u.type === activeFilter);

  return (
    <div className="container py-10 md:py-14">
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

      <div className="grid gap-6 lg:gap-8 md:grid-cols-2">
        {filteredUlds.map((u) => (
          <article
            key={u.id}
            className="flex gap-4 rounded-2xl border border-gray-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)] p-5 md:p-6"
          >
            {/* left “image” */}
            <div className="w-24 md:w-28 flex-shrink-0">
              <div className="relative aspect-[4/3] rounded-xl bg-gradient-to-br from-[#0A58FF] to-[#1b9fff] flex items-center justify-center overflow-hidden">
                <div className="w-10/12 h-6/12 border-2 border-white/90 rounded-sm relative">
                  <div className="absolute inset-x-1 bottom-1 h-[2px] bg-white/60" />
                  <div className="absolute inset-y-1 left-1 w-[2px] bg-white/50" />
                  <div className="absolute inset-y-1 right-1 w-[2px] bg-white/50" />
                </div>
                <span className="absolute bottom-1 left-1 rounded-full bg-black/45 px-2 py-[2px] text-[10px] font-semibold text-primary">
                  {u.code}
                </span>
              </div>
            </div>

            {/* text block */}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-[17px] md:text-lg font-semibold text-[#111827]">
                  {u.code} – {u.name}
                </h3>
              <span className="inline-flex items-center rounded-full border border-[#0A2542] px-3 py-0.5 text-[11px] font-medium text-[#0A2542]">
                  {u.type}
                </span>
              </div>

              <dl className="mt-2 space-y-1 text-[13px] md:text-sm text-[#374151]">
                <div>
                  <dt className="inline font-semibold text-[#111827]">
                    Base:
                  </dt>{" "}
                  <dd className="inline">{u.base}</dd>
                </div>
                <div>
                  <dt className="inline font-semibold text-[#111827]">
                    Height:
                  </dt>{" "}
                  <dd className="inline">{u.height}</dd>
                </div>
                <div>
                  <dt className="inline font-semibold text-[#111827]">
                    Typical aircraft:
                  </dt>{" "}
                  <dd className="inline">{u.aircraft}</dd>
                </div>
                <div>
                  <dt className="inline font-semibold text-[#111827]">
                    Max gross:
                  </dt>{" "}
                  <dd className="inline">{u.maxGross}</dd>
                </div>
              </dl>

              <p className="mt-2 text-[13px] md:text-sm text-[#6B7280]">
                {u.use}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
