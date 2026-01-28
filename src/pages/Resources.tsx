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
    <main className="bg-primary min-h-screen">
      {/* HERO */}
      <section className="border-b border-gray-800/40">
        <div className="container py-10 md:py-14">
          <h1>Resources &amp; Equipment Guide</h1>
          <p className="mt-3 text-muted max-w-2xl">
            Single reference hub for common ocean container types, air-freight
            ULD equipment, and useful logistics tools.
          </p>
        </div>

        {/* TABS */}
        <div className="border-t border-gray-900/60 bg-black/60">
          <div className="container py-3">
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
