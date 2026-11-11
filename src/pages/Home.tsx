 
import { FiArrowRight, FiGlobe, FiShield, FiUsers } from "react-icons/fi";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import Hero from '../components/Home/Hero'
// import PopularCategories from '../components/Home/PopularCategories'

import HowItWorks from '../components/Home/HowItWorks'
//import NewsEvents from '../components/Home/NewsEvents'
import TestimonialSlider from '../components/Home/TestimonialSlider'
//import LogisticsBanner from '../components/Home/LogisticsBanner'
import DirectoryActions from '../components/Home/DirectoryActions'
// import CountryFlags from '../components/Home/CountryFlags'

const Home = () => {
  return (
    <main className="overflow-hidden bg-[#f7f9fc]">
        <Hero/>
        <DirectoryActions/>
        <section className="container py-20 md:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent-light)]">
                One network. Many possibilities.
              </p>
              <h2 className="mt-3 max-w-2xl text-3xl font-semibold leading-tight text-[var(--color-accent)] md:text-5xl">
                Build stronger connections across global logistics.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-slate-500">
                GLS Alliance brings trusted freight forwarders, exporters, and
                importers together to create practical opportunities for
                collaboration and sustainable growth.
              </p>
              <Link
                to="/about"
                className="group mt-7 inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(1,30,79,0.16)] transition hover:-translate-y-0.5 hover:bg-[var(--color-accent-mid)]"
              >
                Discover GLS Alliance
                <FiArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="relative">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-100/70 blur-2xl" />
              <div className="relative grid gap-4 sm:grid-cols-2">
                <HomeValueCard
                  icon={<FiGlobe />}
                  title="Global reach"
                  body="Find relevant partners across markets and regions."
                />
                <HomeValueCard
                  icon={<FiShield />}
                  title="Trusted network"
                  body="Connect through a structured and professional community."
                />
                <HomeValueCard
                  icon={<FiUsers />}
                  title="Real collaboration"
                  body="Turn introductions into valuable business relationships."
                  featured
                />
              </div>
            </div>
          </div>
        </section>

        <TestimonialSlider/>
        <HowItWorks/>
    </main>
  )
}

export default Home

function HomeValueCard({
  icon,
  title,
  body,
  featured = false,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  featured?: boolean;
}) {
  return (
    <article
      className={`rounded-2xl border p-6 shadow-[0_10px_30px_rgba(1,30,79,0.06)] transition duration-300 hover:-translate-y-1 ${
        featured
          ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white sm:col-span-2"
          : "border-slate-200 bg-white"
      }`}
    >
      <span
        className={`grid h-11 w-11 place-items-center rounded-xl text-xl ${
          featured
            ? "bg-white/15 text-emerald-300"
            : "bg-blue-50 text-[var(--color-accent)]"
        }`}
      >
        {icon}
      </span>
      <h3 className={`mt-5 text-lg font-semibold ${featured ? "text-white" : "text-[var(--color-accent)]"}`}>
        {title}
      </h3>
      <p className={`mt-2 text-sm leading-6 ${featured ? "text-white/75" : "text-slate-500"}`}>
        {body}
      </p>
    </article>
  );
}