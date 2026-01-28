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
    <div className="w-full flex justify-center">
      <div className="flex items-center gap-4 md:gap-6 bg-[#f6f8fb] px-4 py-3 rounded-full shadow-inner">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={[
                "px-6 md:px-8 py-2 md:py-3 rounded-full font-medium text-sm md:text-base transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-[#0A58FF]",
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
