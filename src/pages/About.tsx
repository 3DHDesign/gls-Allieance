import React from "react";

/** Fresh, modern About (white-first, subtle gradients, crisp chips & stats) */
export default function About() {
  return (
    <main className="pt-24 bg-primary text-[var(--color-muted)]">
      {/* HERO — light with soft gradient blobs */}
      <section className="relative overflow-hidden bg-white border-b border-black/10">
        <div
          className="pointer-events-none absolute -top-32 -right-24 h-80 w-80 rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, rgba(1,30,79,.14), transparent 70%)",
          }}
        />
        <div
          className="pointer-events-none absolute -bottom-28 -left-20 h-96 w-96 rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, rgba(90,138,178,.15), transparent 70%)",
          }}
        />

        <div className="container relative py-14">
          <div className="max-w-4xl">
            <h1 className="text-[var(--color-black)]">About GLS Alliance</h1>
            {/* <p className="mt-3 text-lg">
              GLS Alliance is a global logistics <strong>directory</strong>{" "}
              connecting freight forwarders, NVOCCs, customs agents, and
              logistics firms across the world. Browse verified members by
              country and continent—fast.
            </p> */}

            {/* chips */}
            {/* <div className="mt-6 flex flex-wrap gap-2">
              <Chip>186+ Countries</Chip>
              <Chip>Member-First</Chip>
              <Chip>Search by Continent &amp; Country</Chip>
            </div> */}

            {/* calls */}
            {/* <div className="mt-8 flex flex-wrap gap-3">
              <a href="/member-registration" className="btn-accent">
                Become a Member
              </a>
              <a href="/find-forwarder" className="btn-accent">
                Browse Directory
              </a>
            </div> */}
          </div>
        </div>
      </section>

      {/* STATS — modern gradient rings */}
      {/* <section className="bg-white">
        <div className="container py-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Stat kpi="186+" label="Countries covered" />
          <Stat kpi="1000s" label="Member searches" />
          <Stat kpi="0%" label="Commission — we’re a directory" />
          <Stat kpi="24/7" label="Anytime access" />
        </div>
      </section> */}

      {/* WHO WE ARE + HOW IT WORKS (split) */}
      <section className="bg-white">
        <div className="container grid gap-10 md:grid-cols-2 py-12">
          <Card>
            <h2 className="text-[var(--color-black)]">Who We Are</h2>
            {/* <p className="mt-3">
              We help logistics companies find reliable partners quickly.
              Profiles highlight real company details, locations, and
              contacts—so you can decide with confidence.
            </p> */}
            <p className="mt-3">
              <strong>GLS Alliance FZ LLC</strong> offers a globally expanded and
              valued business solutions network for global exporters, importers,
              and service providers. The Alliance enables members to exchange
              their business expertise and opportunities efficiently, ensuring
              high-quality and fruitful collaborations while minimizing overhead
              costs. GLS Alliance also facilitates business exhibitions,
              conferences, and protection plans for its members.
            </p>
            {/* <ul className="mt-4 list-disc pl-5 space-y-1">
              <li>Directory-only (we don’t sell freight)</li>
              <li>Browse by continent &amp; country</li>
              <li>Clean, fast, and mobile-friendly</li>
            </ul> */}
          </Card>

          <Card>
            <h2 className="text-[var(--color-black)]">How GLS Alliance Works</h2>
            <div className="mt-4 space-y-4">
              <Step num="01" title="Create / Update Profile">
                Add your company details, locations, and specialties.
              </Step>
              <Step num="02" title="Get Discovered by Country">
                Appear under origin countries and relevant regions.
              </Step>
              <Step num="03" title="Connect &amp; Collaborate">
                Receive inquiries and build partnerships.
              </Step>
            </div>
          </Card>
        </div>
      </section>

      {/* MISSION / VISION — minimal, elegant */}
      <section className="bg-white">
        <div className="container grid gap-8 md:grid-cols-2 py-12">
          <Card>
            <h2 className="text-[var(--color-black)]">Our Mission</h2>
            <p className="mt-3">
              GLS Alliance fosters global partnerships for effective
              development, cooperation, and collaboration to accelerate progress
              on key objectives aligned with the{" "}
              <strong>Sustainable Development Goals (SDGs)</strong> among its
              members.
            </p>
          </Card>
          <Card>
            <h2 className="text-[var(--color-black)]">Our Vision</h2>
            <p className="mt-3">
              To achieve more effective and globally aligned business
              development through close cooperation and strategic alignment.
            </p>
          </Card>
        </div>
      </section>

      {/* VALUES — modern pill headers */}
      {/* <section className="bg-white">
        <div className="container py-12">
          <h2 className="text-[var(--color-black)]">What We Stand For</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Value title="Trust &amp; Verification">
              Real details, real companies. Choose confidently.
            </Value>
            <Value title="Speed to Connect">
              Filters &amp; search that surface partners in seconds.
            </Value>
            <Value title="Transparency">
              Clear info—no fluff, no pay-to-play gimmicks.
            </Value>
            <Value title="Community">
              A helpful network that shares leads &amp; learning.
            </Value>
          </div>
        </div>
      </section> */}

      {/* TIMELINE — sleek vertical line */}
      {/* <section className="bg-white">
        <div className="container py-12">
          <h2 className="text-[var(--color-black)]">Milestones</h2>
          <div className="mt-6 relative pl-6">
            <div className="absolute left-2 top-0 bottom-0 w-[2px] bg-black/10" />
            <TimelineItem
              year="2024"
              text="Directory MVP with country & continent browsing"
            />
            <TimelineItem
              year="2025"
              text="Expanded coverage to 186+ countries"
            />
            <TimelineItem
              year="Next"
              text="Member tools: richer profiles & analytics"
            />
          </div>
        </div>
      </section> */}

      {/* FINAL CTA — accent band */}
      <section
        className="border-t border-black/10"
        style={{
          background:
            "linear-gradient(90deg, rgba(1,30,79,.06), rgba(90,138,178,.06))",
        }}
      >
        <div className="container py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-[var(--color-black)]">Join the Directory</h2>
            <p className="mt-2">
              List your company and get discovered worldwide.
            </p>
          </div>
          <div className="flex gap-3">
            <a href="/member-registration" className="btn-accent">
              Become a Member
            </a>
            <a href="/contact" className="btn-accent">
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ---------- tiny UI bits (no extra libs) ---------- */

 

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_6px_24px_rgba(0,0,0,.04)]">
      {children}
    </div>
  );
}



function Step({
  num,
  title,
  children,
}: {
  num: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-black/10 bg-white p-4">
      <div className="text-xs font-semibold text-[var(--color-accent)]">
        {num}
      </div>
      <div className="mt-1 font-medium text-[var(--color-black)]">
        {title}
      </div>
      <p className="mt-1">{children}</p>
    </div>
  );
}

 