import React, { useEffect, useState } from "react";
import { FiArrowUpRight, FiGlobe, FiShield, FiUsers } from "react-icons/fi";
import { getContactDetails, type ContactDetailsResponse } from "../api/contactDetails";

/** Fresh, modern About (white-first, subtle gradients, crisp chips & stats) */
export default function About() {
  const [data, setData] = useState<ContactDetailsResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await getContactDetails(); // ✅ same route
        if (mounted) setData(res.data);
      } catch (e) {
        console.error("About load failed", e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="bg-[#f7f9fc] pt-[78px] text-[var(--color-muted)]">
      <section className="relative isolate overflow-hidden bg-[#061a35]">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero_about.jpg')" }}
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(3,24,55,0.96),rgba(3,24,55,0.72),rgba(3,24,55,0.34))]" />
        <div className="container relative flex min-h-[360px] items-center py-14 md:min-h-[430px]">
          <div className="max-w-3xl text-white">
            <p className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
              <span className="h-px w-9 bg-emerald-300" />
              The GLS Alliance story
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
              Connecting businesses across the world.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/80 md:text-lg">
              A trusted logistics community built to help members discover,
              collaborate, and grow with confidence.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="/member-registration" className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[var(--color-accent)] transition hover:bg-emerald-50">
                Join the network
                <FiArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a href="/contact" className="rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20">
                Talk to our team
              </a>
            </div>
          </div>
          <div className="absolute bottom-8 right-6 hidden w-64 rounded-2xl border border-white/20 bg-white/10 p-5 text-white shadow-2xl backdrop-blur-md lg:block">
            <div className="flex items-center justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-400/20 text-emerald-300">
                <FiGlobe className="h-5 w-5" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200">Our focus</span>
            </div>
            <p className="mt-4 text-lg font-semibold">Stronger connections. Smarter logistics.</p>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-8">
        <div className="container grid gap-3 sm:grid-cols-3">
          <Highlight icon={<FiGlobe />} value="Global" label="Business reach" />
          <Highlight icon={<FiUsers />} value="Trusted" label="Partner network" />
          <Highlight icon={<FiShield />} value="Connected" label="Member support" />
        </div>
      </section>

      {/* WHO WE ARE + HOW IT WORKS (split) */}
      <section className="bg-white">
        <div className="container grid gap-8 py-16 md:grid-cols-2 md:py-20">
          <Card>
            <SectionEyebrow>Our foundation</SectionEyebrow>
            <h2 className="mt-2 text-[var(--color-black)]">
              {data?.who_we_are?.title || "Who We Are"}
            </h2>

            {loading ? (
              <p className="mt-3 text-[var(--color-muted)]/70">Loading...</p>
            ) : (
              <p className="mt-3">
                {data?.who_we_are?.description || "—"}
              </p>
            )}
          </Card>

          <Card>
            <SectionEyebrow>Simple by design</SectionEyebrow>
            <h2 className="mt-2 text-[var(--color-black)]">How GLS Alliance Works</h2>
            <div className="mt-4 space-y-4">
              <Step num="01" title="Create / Update Profile">
              Add your company information, locations, and areas of expertise to showcase your capabilities.
              </Step>
              <Step num="02" title="Get Discovered by Country">
              Be listed under relevant origin countries and regions, making it easier for partners to find you.
              </Step>
              <Step num="03" title="Connect &amp; Collaborate">
              Receive inquiries, engage with potential partners, and build meaningful collaborations.
              </Step>
            </div>
          </Card>
        </div>
      </section>

      {/* MISSION / VISION — minimal, elegant */}
      <section className="bg-[#f7f9fc]">
        <div className="container grid gap-8 py-16 md:grid-cols-2 md:py-20">
          <Card>
            <SectionEyebrow>What guides us</SectionEyebrow>
            <h2 className="mt-2 text-[var(--color-black)]">
              {data?.vision?.title || "Our Mission"}
            </h2>

            {loading ? (
              <p className="mt-3 text-[var(--color-muted)]/70">Loading...</p>
            ) : (
              <p className="mt-3">
                {data?.vision?.description || "—"}
              </p>
            )}
          </Card>

          <Card>
            <SectionEyebrow>Where we are going</SectionEyebrow>
            <h2 className="mt-2 text-[var(--color-black)]">
              {data?.mission?.title || "Our Vision"}
            </h2>

            {loading ? (
              <p className="mt-3 text-[var(--color-muted)]/70">Loading...</p>
            ) : (
              <p className="mt-3">
                {data?.mission?.description || "—"}
              </p>
            )}
          </Card>
        </div>
      </section>

      {/* FINAL CTA — accent band */}
      <section
        className="border-t border-black/10"
        style={{
          background:
            "linear-gradient(90deg, rgba(1,30,79,.06), rgba(90,138,178,.06))",
        }}
      >
        <div className="container flex flex-col items-start justify-between gap-6 py-14 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent-light)]">Be part of something bigger</p>
            <h2 className="mt-2 text-[var(--color-black)]">Put your business on the global map.</h2>
            <p className="mt-2 max-w-xl">Join a community built around trust, collaboration, and meaningful growth.</p>
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
    <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_10px_35px_rgba(1,30,79,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(1,30,79,0.1)]">
      {children}
    </div>
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent-light)]">
      {children}
    </p>
  );
}

function Highlight({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-[0_10px_30px_rgba(1,30,79,0.08)]">
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-[var(--color-accent)]">
        {icon}
      </span>
      <div>
        <p className="text-base font-semibold text-[var(--color-accent)]">{value}</p>
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">{label}</p>
      </div>
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
    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition-colors hover:border-[var(--color-accent-light)] hover:bg-white">
      <div className="text-xs font-semibold tracking-[0.14em] text-[var(--color-accent-light)]">{num}</div>
      <div className="mt-1 font-semibold text-[var(--color-black)]">{title}</div>
      <p className="mt-1 text-[15px] leading-7 text-slate-500">{children}</p>
    </div>
  );
}
