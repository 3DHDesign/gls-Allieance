import React, { useEffect, useState } from "react";
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
          </div>
        </div>
      </section>

      {/* WHO WE ARE + HOW IT WORKS (split) */}
      <section className="bg-white">
        <div className="container grid gap-10 md:grid-cols-2 py-12">
          <Card>
            <h2 className="text-[var(--color-black)]">
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
            <h2 className="text-[var(--color-black)]">
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
            <h2 className="text-[var(--color-black)]">
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
        <div className="container py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-[var(--color-black)]">Join the Directory</h2>
            <p className="mt-2">List your company and get discovered worldwide.</p>
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
      <div className="text-xs font-semibold text-[var(--color-accent)]">{num}</div>
      <div className="mt-1 font-medium text-[var(--color-black)]">{title}</div>
      <p className="mt-1">{children}</p>
    </div>
  );
}
