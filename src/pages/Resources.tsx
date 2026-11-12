// src/pages/Resources.tsx
import React, { useState } from "react";
import { ResourcesTabs } from "../components/Resources/ResourcesTabs";
import type { TabId } from "../components/Resources/ResourcesTabs";

import { ContainersSection } from "../components/Resources/ContainersSection";
import { AirFreightSection } from "../components/Resources/AirFreightSection";
import { UsefulLinksSection } from "../components/Resources/UsefulLinksSection";

const Resources: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>("containers");

  return (
    <main className="min-h-screen bg-primary pt-[78px]">
      <section className="relative isolate overflow-hidden bg-[#061a35]">
        <div className="absolute inset-0 -z-10 bg-cover bg-center" style={{ backgroundImage: "url('/images/hero_image_01.avif')" }} />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(3,24,55,0.96),rgba(3,24,55,0.72),rgba(3,24,55,0.35))]" />
        <div className="container px-4 py-10 sm:px-6 sm:py-14 md:py-16">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300 sm:mb-4 sm:text-xs sm:tracking-[0.24em]">
            Knowledge hub
          </p>
          <h1 className="max-w-3xl text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
            Resources &amp; Equipment Guide
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:mt-4 sm:text-base sm:leading-7 md:text-lg">
            Single reference hub for common ocean container types, air-freight
            ULD equipment, and useful logistics tools.
          </p>
        </div>

        {/* TABS */}
        <div className="border-t border-white/10 bg-black/30">
          <div className="container overflow-x-auto px-3 py-3 sm:px-6">
            <ResourcesTabs activeTab={activeTab} onChange={setActiveTab} />
          </div>
        </div>
      </section>

      {/* CONTENT: only ONE section visible at a time */}
      {activeTab === "containers" && (
        <section className="mt-6 md:mt-8">
          <ContainersSection />
        </section>
      )}

      {activeTab === "airfreight" && (
        <section className="mt-6 md:mt-8">
          <AirFreightSection />
        </section>
      )}

      {activeTab === "useful-links" && (
        <section className="mt-6 md:mt-8 mb-16">
          <UsefulLinksSection />
        </section>
      )}
    </main>
  );
};

export default Resources;
