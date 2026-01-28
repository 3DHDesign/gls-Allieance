import React, { useState } from "react";

type ContainerCategory =
  | "Dry Container"
  | "High Cube"
  | "Reefer"
  | "Open Top"
  | "Flat Rack";

type ContainerType = {
  id: string;
  name: string;
  category: ContainerCategory;
  internal: string;
  payload: string;
  capacity: string;
  use: string;
};

const containers: ContainerType[] = [
  {
    id: "20-dry",
    name: "20' Dry Standard",
    category: "Dry Container",
    internal: "≈ 5.9 m × 2.35 m × 2.39 m",
    payload: "≈ 28,000 kg",
    capacity: "≈ 33 m³",
    use: "General cargo, cartons, pallets.",
  },
  {
    id: "40-dry",
    name: "40' Dry Standard",
    category: "Dry Container",
    internal: "≈ 12.0 m × 2.35 m × 2.39 m",
    payload: "≈ 28,500 kg",
    capacity: "≈ 67 m³",
    use: "High-volume general cargo.",
  },
  {
    id: "40-hc",
    name: "40' High Cube",
    category: "High Cube",
    internal: "≈ 12.0 m × 2.35 m × 2.69 m",
    payload: "≈ 28,500 kg",
    capacity: "≈ 76 m³",
    use: "Voluminous but light cargo, tall loads.",
  },
  {
    id: "20-reefer",
    name: "20' Reefer",
    category: "Reefer",
    internal: "≈ 5.4 m × 2.29 m × 2.27 m",
    payload: "≈ 27,000 kg",
    capacity: "≈ 28 m³",
    use: "Temperature-controlled cargo.",
  },
  {
    id: "40-reefer",
    name: "40' Reefer",
    category: "Reefer",
    internal: "≈ 11.6 m × 2.29 m × 2.27 m",
    payload: "≈ 29,000 kg",
    capacity: "≈ 59 m³",
    use: "Frozen and chilled goods.",
  },
  {
    id: "20-open-top",
    name: "20' Open Top",
    category: "Open Top",
    internal: "Similar to 20' dry internal dimensions",
    payload: "≈ 28,000 kg",
    capacity: "≈ 32–33 m³",
    use: "Top loading: machinery, oversized cargo.",
  },
  {
    id: "40-open-top",
    name: "40' Open Top",
    category: "Open Top",
    internal: "Similar to 40' dry internal dimensions",
    payload: "≈ 28,000 kg",
    capacity: "≈ 65–67 m³",
    use: "Top loading long / heavy cargo.",
  },
  {
    id: "flat-rack",
    name: "20' / 40' Flat Rack",
    category: "Flat Rack",
    internal: "Steel platform, collapsible end walls",
    payload: "High payload tolerance",
    capacity: "N/A (no closed cubic capacity)",
    use: "Heavy machinery, out-of-gauge cargo.",
  },
];

type FilterId = "all" | ContainerCategory;

const containerCategoryChips: { id: FilterId; label: string }[] = [
  { id: "all", label: "All Containers" },
  { id: "Dry Container", label: "Dry Containers" },
  { id: "High Cube", label: "High Cube" },
  { id: "Reefer", label: "Reefer" },
  { id: "Open Top", label: "Open Top" },
  { id: "Flat Rack", label: "Flat Rack" },
];

function getShortLabel(name: string): string {
  const first = name.split(" ")[0];
  return first ?? name;
}

export const ContainersSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");

  const filteredContainers =
    activeFilter === "all"
      ? containers
      : containers.filter((c) => c.category === activeFilter);

  return (
    <div className="container py-10 md:py-14">
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

      <div className="grid gap-6 lg:gap-8 md:grid-cols-2">
        {filteredContainers.map((c) => (
          <article
            key={c.id}
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
                <span className="absolute bottom-1 left-1 rounded-full bg-black/45 px-2 py-[2px] text-[10px] font-medium text-primary">
                  {getShortLabel(c.name)}
                </span>
              </div>
            </div>

            {/* text block */}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-[17px] md:text-lg font-semibold text-[#111827]">
                  {c.name}
                </h3>
                <span className="inline-flex items-center rounded-full border border-[#0A2542] px-3 py-0.5 text-[11px] font-medium text-[#0A2542]">
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
    </div>
  );
};
