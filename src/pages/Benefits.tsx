 

/** GLS Alliance – Member Benefits (clean, tag-free design) */
export default function Benefits() {
  return (
    <main className="pt-24 bg-primary text-[var(--color-muted)]">
      {/* HERO */}
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
            <h1 className="text-[var(--color-black)]">Member Benefits</h1>
            {/* <p className="mt-3 text-lg">
              GLS Alliance offers members structured access to a global logistics
              network, along with marketing support, business expansion
              opportunities, and professional protection tools.
            </p> */}

            {/* <div className="mt-6 flex flex-wrap gap-2">
              <BenefitChip>Global Network</BenefitChip>
              <BenefitChip>Business Growth</BenefitChip>
              <BenefitChip>Lower Overheads</BenefitChip>
            </div> */}

            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/member-registration" className="btn-accent">
                Become a Member
              </a>
              <a href="/contact" className="btn-accent">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CORE BENEFITS */}
      <section className="bg-white">
        <div className="container py-12">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[var(--color-accent)]">
              Core Benefits
            </p>
            <h2 className="mt-2 text-[var(--color-black)]">
              Why companies choose GLS Alliance
            </h2>
            <p className="mt-2 max-w-2xl">
              Membership brings strategic networking advantages and reduces
              operational risks—while expanding your business footprint globally.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <BenefitCard
              title="Global access under one alliance"
              body="Connect with exporters, importers, and logistics service providers worldwide within a single structured network."
            />
            <BenefitCard
              title="Marketing & exhibition promotions"
              body="Gain exposure through alliance-led marketing initiatives and participation in global logistics exhibitions."
            />
            <BenefitCard
              title="Two annual 1-to-1 meetings & exhibitions"
              body="Engage directly with relevant partners through GLS-hosted one-to-one business meetings held twice yearly."
            />
            <BenefitCard
              title="Business expansion opportunities"
              body="Collaborate with professional logisticians, vendors, and partners to expand your services and international reach."
            />
            <BenefitCard
              title="Reduced overhead costs"
              body="Meet multiple global vendors and service providers in one place, eliminating unnecessary travel and prospecting expenses."
            />
            <BenefitCard
              title="Implement new software & systems"
              body="Access opportunities to upgrade operational tools, logistics tech, and workflow systems through alliance partners."
            />
            <BenefitCard
              title="Credit monitoring & settlement follow-up"
              body="Benefit from structured credit checks and follow-up systems that help reduce late payments and financial exposure."
            />
            <BenefitCard
              title="Financial protection among members"
              body="Operate with confidence through alliance-supported protection frameworks designed to safeguard member interests."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="border-t border-black/10"
        style={{
          background:
            "linear-gradient(90deg, rgba(1,30,79,.06), rgba(90,138,178,.06))",
        }}
      >
        <div className="container py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-[var(--color-black)]">
              Unlock GLS Alliance Membership Benefits
            </h2>
            <p className="mt-2 max-w-xl">
              Join a global logistics alliance designed to enhance your reach,
              reduce overheads, and support long-term business growth.
            </p>
          </div>
          <div className="flex gap-3">
            <a href="/member-registration" className="btn-accent">
              Apply Now
            </a>
            <a href="/contact" className="btn-accent">
              Learn More
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ---------- Small internal UI components ---------- */

 

function BenefitCard({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <article className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_6px_24px_rgba(0,0,0,.04)]">
      <h3 className="text-[var(--color-black)] font-semibold">{title}</h3>
      <p className="mt-2 text-sm">{body}</p>
    </article>
  );
}
