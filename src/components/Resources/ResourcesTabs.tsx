// src/components/Resources/ResourcesTabs.tsx
import React from "react";

export type TabId = "containers" | "airfreight" | "useful-links";

type Tab = {
  id: TabId;
  label: string;
};

const tabs: Tab[] = [
  { id: "containers", label: "Containers" },
  { id: "airfreight", label: "Air Freight" },
  { id: "useful-links", label: "Useful Links" },
];

type Props = {
  activeTab: TabId;
  onChange: (id: TabId) => void;
};

export const ResourcesTabs: React.FC<Props> = ({ activeTab, onChange }) => {
  return (
    <div className="flex min-w-max justify-center">
      <div className="flex items-center gap-2 rounded-2xl bg-[#f6f8fb] px-2 py-2 shadow-inner sm:gap-4 sm:rounded-full sm:px-4 sm:py-3 md:gap-6">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={[
                "rounded-full border px-4 py-2 text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-[#0A58FF] sm:px-6 sm:py-2.5 sm:text-sm md:px-8 md:py-3 md:text-base",
                isActive
                  ? "bg-[#0A2542] text-white border-[#0A2542] shadow-md"
                  : "bg-white text-[#1e2c3e] border-gray-300 hover:border-[#0A58FF] hover:text-[#0A58FF]",
              ].join(" ")}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
