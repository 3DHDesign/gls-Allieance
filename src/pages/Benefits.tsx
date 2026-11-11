 

import {
  FiActivity,
  FiBarChart2,
  FiCpu,
  FiDollarSign,
  FiGlobe,
  FiShield,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import type { ReactNode } from "react";

/** GLS Alliance – Member Benefits (clean, tag-free design) */
export default function Benefits() {
  return (
    <main className="pt-[78px] bg-primary text-[var(--color-muted)]">
      <section className="relative isolate overflow-hidden bg-[#061a35]">
        <div className="absolute inset-0 -z-10 bg-cover bg-center" style={{ backgroundImage: "url('/images/hero_about.jpg')" }} />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(3,24,55,0.96),rgba(3,24,55,0.68),rgba(3,24,55,0.35))]" />
        <div className="container relative py-14 md:py-18">
          <div className="max-w-3xl text-white">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">Why GLS Alliance</p>
            <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">Membership built for global growth</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/80 md:text-lg">
              Access trusted partners, practical tools, and meaningful opportunities across the logistics industry.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
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
            {/* <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[var(--color-accent)]">
              Core Benefits
            </p>
            <h2 className="mt-2 text-[var(--color-black)]">
              Why companies choose GLS Alliance
            </h2>
            <p className="mt-2 max-w-2xl">
              Membership brings strategic networking advantages and reduces
              operational risks—while expanding your business footprint globally.
            </p> */}
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <BenefitCard
              icon={<FiGlobe />}
              image="/images/hero_about.jpg"
              title="Global access under one alliance"
              body="Connect with exporters, importers, and logistics service providers worldwide within a single structured network."
            />
            <BenefitCard
              icon={<FiBarChart2 />}
              image="/images/hero_image_01.avif"
              title="Marketing & exhibition promotions"
              body="Gain exposure through alliance-led marketing initiatives and participation in global logistics exhibitions."
            />
            <BenefitCard
              icon={<FiUsers />}
              image="/images/hero_about.jpg"
              title="Two annual 1-to-1 meetings & exhibitions"
              body="Engage directly with relevant partners through GLS-hosted one-to-one business meetings held twice yearly."
            />
            <BenefitCard
              icon={<FiTrendingUp />}
              image="/images/hero_image_01.avif"
              title="Business expansion opportunities"
              body="Collaborate with professional logisticians, vendors, and partners to expand your services and international reach."
            />
            <BenefitCard
              icon={<FiDollarSign />}
              image="/images/hero_about.jpg"
              title="Reduced overhead costs"
              body="Meet multiple global vendors and service providers in one place, eliminating unnecessary travel and prospecting expenses."
            />
            <BenefitCard
              icon={<FiCpu />}
              image="/images/hero_image_01.avif"
              title="Implement new software & systems"
              body="Access opportunities to upgrade operational tools, logistics tech, and workflow systems through alliance partners."
            />
            <BenefitCard
              icon={<FiActivity />}
              image="/images/hero_about.jpg"
              title="Credit monitoring & settlement follow-up"
              body="Benefit from structured credit checks and follow-up systems that help reduce late payments and financial exposure."
            />
            <BenefitCard
              icon={<FiShield />}
              image="/images/hero_image_01.avif"
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
  icon,
  image,
  title,
  body,
}: {
  icon: ReactNode;
  image: string;
  title: string;
  body: string;
}) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(1,30,79,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(1,30,79,0.12)]">
      <div
        className="relative h-28 overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url('${image}')` }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(3,24,55,0.9),rgba(3,24,55,0.38))]" />
        <img
          src="/images/logo.png"
          alt=""
          aria-hidden="true"
          className="absolute right-4 top-3 h-12 w-20 object-contain brightness-0 invert opacity-80 transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute bottom-4 left-5 grid h-11 w-11 place-items-center rounded-xl bg-emerald-400 text-xl text-[#061a35] shadow-lg">
          {icon}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-semibold leading-snug text-[var(--color-black)]">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-500">{body}</p>
      </div>
    </article>
  );
}
