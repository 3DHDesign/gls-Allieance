import React, { useState } from "react";
import ResourceImageModal from "./ResourceImageModal";

type ContainerCategory =
  | "General Purpose Container"
  | "High Cube General Purpose"
  | "Hardtop Container"
  | "High Cube Hardtop"
  | "Open Top Container"
  | "High Cube Open Top"
  | "Flatrack";

type ContainerType = {
  id: string;
  name: string;
  category: ContainerCategory;
  image: string;
  internal: string;
  payload: string;
  capacity: string;
  use: string;
};

const containers: ContainerType[] = [
  {
    id: "20-gp",
    name: "20' General Purpose Container (22G0 / 22G1)",
    image: "/images/container/erth/GENERAL PURPOSE CONTAINER-20.png",
    category: "General Purpose Container",
    internal: "5,900 mm × 2,352 mm × 2,393 mm (19' 4¼\" × 7' 8⅝\" × 7' 10¼\")",
    payload: "Up to 30,250 kg (66,690 lbs) [Steel floor] / 30,200 kg [Wooden floor]",
    capacity: "33.2 m³ (1,172 ft³)",
    use: "Suitable for any general cargo, hanging garments, and bulk cargo with liner bags.",
  },
  {
    id: "40-gp",
    name: "40' General Purpose Container (42G0 / 42G1)",
    image: "/images/container/erth/GENERAL-PURPOSE-CONTAINER-40.png",
    category: "General Purpose Container",
    internal: "12,032 mm × 2,352 mm × 2,395 mm (39' 5⅝\" × 7' 8⅝\" × 7' 10¼\")",
    payload: "Up to 28,800 kg (63,493 lbs)",
    capacity: "67.7 m³ (2,391 ft³)",
    use: "Suitable for any general cargo and hanging garment equipment.",
  },
  {
    id: "40-hc-gp",
    name: "40' High Cube General Purpose Container (45G0 / 45G1)",
    image: "/images/container/erth/HIGH-CUBE-GENERAL-PURPOSE-CONTAINER-40.png",
    category: "High Cube General Purpose",
    internal: "12,032 mm × 2,352 mm × 2,700 mm (39' 5⅝\" × 7' 8⅝\" × 8' 10¼\")",
    payload: "Up to 28,670 kg (63,206 lbs)",
    capacity: "76.3 m³ – 76.4 m³ (2,695 – 2,698 ft³)",
    use: "Voluminous cargo up to max. 2.70 m height and hanging garment equipment.",
  },
  {
    id: "45-hc-gp",
    name: "45' High Cube General Purpose Container (L5G0 / L5G1)",
    image: "/images/container/erth/HIGH-CUBE-GENERAL-PURPOSE-CONTAINER-45.png",
    category: "High Cube General Purpose",
    internal: "13,556 mm × 2,352 mm × 2,700 mm (44' 5⅝\" × 7' 8⅝\" × 8' 10¼\")",
    payload: "Up to 27,800 kg (61,288 lbs)",
    capacity: "86.0 m³ (3,037 ft³)",
    use: "Extra-long voluminous cargo up to max. 2.70 m height; fitted with 40' and 45' corner castings.",
  },
  {
    id: "20-hardtop",
    name: "20' Hardtop Container (22U6)",
    image: "/images/container/erth/HARDTOP-CONTAINER-20.png",
    category: "Hardtop Container",
    internal: "5,895 mm × 2,350 mm × 2,384 mm middle / 2,309 mm side",
    payload: "Up to 29,650 kg (65,367 lbs)",
    capacity: "32.1 m³ – 33.0 m³ (1,134 – 1,165 ft³)",
    use: "Heavy, high, and over-height loads; removable steel roof (~450 kg) and swing-out door header for crane or forklift loading.",
  },
  {
    id: "40-hardtop",
    name: "40' Hardtop Container (42U6)",
    image: "/images/container/erth/HARDTOP-CONTAINER-40.png",
    category: "Hardtop Container",
    internal: "12,020 mm × 2,342 mm × 2,388 mm middle / 2,313 mm side",
    payload: "Up to 25,780 kg (56,835 lbs)",
    capacity: "65.3 m³ – 67.2 m³ (2,306 – 2,373 ft³)",
    use: "Long, heavy, and excessively high cargo loaded via crane through roof or forklift via door side.",
  },
  {
    id: "40-hc-hardtop",
    name: "40' High Cube Hardtop Container (45U6)",
    image: "/images/container/erth/HIGH-CUBE-HARDTOP-CONTAINER-40.png",
    category: "High Cube Hardtop",
    internal: "12,032 mm × 2,352 mm × 2,695 mm middle / 2,620 mm side",
    payload: "Up to 27,500 kg (60,627 lbs) [Steel floor] / 27,300 kg [Wooden floor]",
    capacity: "73.9 m³ – 76.3 m³ (2,610 – 2,695 ft³)",
    use: "Extra-tall heavy and over-height cargo with removable steel roof sections and hanging garment racks.",
  },
  {
    id: "20-open-top",
    name: "20' Open Top Container (22U1)",
    image: "/images/container/erth/OPEN-TOP-CONTAINER-20.png",
    category: "Open Top Container",
    internal: "5,895 mm × 2,350 mm × 2,380 mm middle / 2,340 mm side",
    payload: "Up to 30,200 kg (66,579 lbs) [Steel floor] / 30,050 kg [Wooden floor]",
    capacity: "32.5 m³ – 32.7 m³ (1,148 – 1,155 ft³)",
    use: "Over-height cargo and heavy loads loaded from top by crane or door side with removable tarpaulin.",
  },
  {
    id: "40-open-top",
    name: "40' Open Top Container (42U1)",
    image: "/images/container/erth/OPEN-TOP-CONTAINER-40.png",
    category: "Open Top Container",
    internal: "12,029 mm × 2,350 mm × 2,380 mm middle / 2,346 mm side",
    payload: "Up to 28,500 kg (62,831 lbs) [Steel floor] / 28,450 kg [Wooden floor]",
    capacity: "66.3 m³ – 66.5 m³ (2,341 – 2,348 ft³)",
    use: "Long over-height and heavy cargo loaded via crane through roof or door side with swing-out header.",
  },
  {
    id: "40-hc-open-top",
    name: "40' High Cube Open Top Container (45U1)",
    image: "/images/container/erth/HIGH-CUBE-OPEN-TOP-CONTAINER-40.png",
    category: "High Cube Open Top",
    internal: "12,029 mm × 2,352 mm × 2,683 mm middle / 2,649 mm side",
    payload: "28,250 kg (62,280 lbs) [Steel floor]",
    capacity: "74.9 m³ (2,645 ft³)",
    use: "Provides 305 mm (1') extra internal loading height and 8 m³ more capacity for tall heavy cargo.",
  },
  {
    id: "20-flatrack",
    name: "20' Flatrack (22P3)",
    image: "/images/container/erth/FLATRACK-20.png",
    category: "Flatrack",
    internal: "5,612–5,638 mm length × 2,227 mm width × 2,219–2,235 mm height (between corner posts)",
    payload: "Up to 42,100 kg (92,814 lbs) [31,260 kg / 37,060 kg / 42,100 kg series]",
    capacity: "N/A (open platform with flushfolding end walls)",
    use: "Heavy loads and oversized cargo; spring-assisted collapsible end walls and 5,000 kg lashing devices.",
  },
];

type FilterId = "all" | ContainerCategory;

const containerCategoryChips: { id: FilterId; label: string }[] = [
  { id: "all", label: "All Containers" },
  { id: "General Purpose Container", label: "General Purpose" },
  { id: "High Cube General Purpose", label: "High Cube General Purpose" },
  { id: "Hardtop Container", label: "Hardtop" },
  { id: "High Cube Hardtop", label: "High Cube Hardtop" },
  { id: "Open Top Container", label: "Open Top" },
  { id: "High Cube Open Top", label: "High Cube Open Top" },
  { id: "Flatrack", label: "Flatrack" },
];

function getShortLabel(name: string): string {
  const first = name.split(" ")[0];
  return first ?? name;
}

export const ContainersSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");
  const [preview, setPreview] = useState<ContainerType | null>(null);

  const filteredContainers =
    activeFilter === "all"
      ? containers
      : containers.filter((c) => c.category === activeFilter);

  return (
    <div className="container px-4 py-8 sm:px-6 sm:py-10 md:py-14">
      <header className="mb-6 md:mb-8">
        <h2>Ocean Container Specifications</h2>
        <p className="mt-2 text-muted max-w-2xl">
          Standard ISO containers commonly used in liner shipping. Dimensions
          and payloads are indicative and may vary slightly by carrier and
          build.
        </p>

        {/* Filter chips */}
        <div className="mt-3 flex flex-wrap gap-2 text-[11px] md:text-xs">
          {containerCategoryChips.map((chip) => {
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

      <div className="grid gap-5 lg:gap-8 xl:grid-cols-2">
        {filteredContainers.map((c) => (
          <article
            key={c.id}
            className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-5 md:flex-row md:gap-5 md:p-6"
          >
            {/* left “image” */}
            <button
              type="button"
              className="w-full flex-shrink-0 text-left hover:cursor-pointer md:w-40 lg:w-48"
              onClick={() => setPreview(c)}
              aria-label={`Expand image for ${c.name}`}
            >
              <div className="relative aspect-[4/3] rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden transition duration-300 hover:scale-105 hover:shadow-lg">
                <img
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  className="h-full w-full rounded-xl object-cover"
                />

                <span className="absolute bottom-1 left-1 rounded-full bg-black/60 px-2 py-[2px] text-[10px] font-medium text-white">
                  {getShortLabel(c.name)}
                </span>
              </div>

              <span className="mt-2 block text-center text-[10px] font-medium text-[var(--color-accent-light)]">
                Click to expand
              </span>
            </button>

            {/* text block */}
            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="min-w-0 flex-1 text-[17px] font-semibold leading-snug text-[#111827] md:text-lg">
                  {c.name}
                </h3>
                <span className="inline-flex shrink-0 items-center rounded-full border border-[#0A2542] px-3 py-1 text-[11px] font-medium text-[#0A2542]">
                  {c.category}
                </span>
              </div>

              <dl className="mt-2 space-y-1 text-[13px] md:text-sm text-[#374151]">
                <div>
                  <dt className="inline font-semibold text-[#111827]">
                    Internal:
                  </dt>{" "}
                  <dd className="inline">{c.internal}</dd>
                </div>
                <div>
                  <dt className="inline font-semibold text-[#111827]">
                    Max payload:
                  </dt>{" "}
                  <dd className="inline">{c.payload}</dd>
                </div>
                <div>
                  <dt className="inline font-semibold text-[#111827]">
                    Capacity:
                  </dt>{" "}
                  <dd className="inline">{c.capacity}</dd>
                </div>
              </dl>

              <p className="mt-2 text-[13px] md:text-sm text-[#6B7280]">
                {c.use}
              </p>
            </div>
          </article>
        ))}
      </div>
      {preview && (
        <ResourceImageModal
          label={preview.name}
          code={getShortLabel(preview.name)}
          imageUrl={preview.image}
          onClose={() => setPreview(null)}
        />
      )}
    </div>
  );
};
