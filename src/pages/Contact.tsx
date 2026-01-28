import { useMemo } from "react";

type Office = {
  title: string;
  lines: string[];
  mapQuery?: string;
  mapTitle?: string;
};

export default function Contact() {
  const phones = useMemo(
    () => ["+971 586595733", "+94 112 825147", "+94 775286377"],
    []
  );

  const emails = useMemo(
    () => [
      "jeewaka@glsalliance.com",
      "glsalliance@outlook.com",
      "mkt@glsalliance.com",
      "doc@glsalliance.com",
      "ops@glsalliance.com",
    ],
    []
  );

  const dubaiOffice: Office = {
    title: "Dubai (UAE) — Head Office",
    lines: [
      "GLS Alliance FZ LLC.,",
      "Al Jabri Building, 321, Street 2D,",
      "Naif, Deira,",
      "United Arab Emirates",
    ],
    mapQuery: "Al Jabri Building, 321, Street 2D, Naif, Deira, Dubai, United Arab Emirates",
    mapTitle: "Dubai Head Office Map",
  };

  const sriLankaOffice: Office = {
    title: "Sri Lanka — Kohuwala Office",
    lines: [
      "GLS Alliance Pvt Ltd",
      "30/1A, Wijayamangalarama Road,",
      "Kohuwala, Sri Lanka.",
      "Tel: +94 112 825147",
      "Hot Line: +94 775286377",
      "Mail: jeewaka@glsalliance.com",
      "      glsalliance@outlook.com",
    ],
    mapQuery: "30/1A, Wijayamangalarama Road, Kohuwala, Sri Lanka",
    mapTitle: "Sri Lanka Office Map",
  };

  const rakOffice: Office = {
    title: "Registered Office — RAK (UAE)",
    lines: [
      "Ras Al Khaimah Economic Zone (RAKEZ) Compass Building,",
      "Al Shohada Road,",
      "Al Hamra Industrial Zone - FZ,",
      "Ras Al Khaimah, United Arab Emirates,",
      "P.O.Box - 414858",
    ],
  };

  return (
    <main className="bg-primary pt-24 text-[var(--color-muted)]">
      {/* Hero */}
      <section className="bg-white border-b border-black/10">
        <div className="container py-14">
          <h1 className="text-[var(--color-black)]">Contact GLS Alliance</h1>
          <p className="mt-3">
            Reach our team via phone or email. Offices in Dubai (UAE) and Kohuwala (Sri Lanka).
          </p>
        </div>
      </section>

      {/* Content */}
      <section>
        <div className="container py-12 grid gap-8 lg:grid-cols-3">
          {/* Left: Offices */}
          <div className="lg:col-span-2 space-y-6">
            {/* Side-by-side offices */}
            <div className="grid gap-6 lg:grid-cols-2">
              <OfficeCard office={dubaiOffice} />
              <OfficeCard office={sriLankaOffice} />
            </div>

            {/* Side-by-side maps */}
            <div className="grid gap-6 lg:grid-cols-2">
              <OfficeMap
                query={dubaiOffice.mapQuery!}
                title={dubaiOffice.mapTitle!}
              />
              <OfficeMap
                query={sriLankaOffice.mapQuery!}
                title={sriLankaOffice.mapTitle!}
              />
            </div>

            {/* Registered office full width */}
            <OfficeCard office={rakOffice} />
          </div>

          {/* Right: Contact methods */}
          <aside className="space-y-6">
            <Card>
              <h3 className="text-[var(--color-black)] font-medium mb-4">Phone</h3>
              <ul className="space-y-2">
                {phones.map((p) => (
                  <li key={p}>
                    <a
                      href={`tel:${p.replace(/\s+/g, "")}`}
                      className="text-[var(--color-accent)] hover:underline"
                    >
                      {p}
                    </a>
                  </li>
                ))}
              </ul>
            </Card>

            <Card>
              <h3 className="text-[var(--color-black)] font-medium mb-4">Email</h3>
              <ul className="space-y-2">
                {emails.map((e) => (
                  <li key={e}>
                    <a
                      href={`mailto:${e}`}
                      className="text-[var(--color-accent)] hover:underline break-all"
                    >
                      {e}
                    </a>
                  </li>
                ))}
              </ul>
            </Card>

            <Card>
              <h3 className="text-[var(--color-black)] font-medium mb-4">Quick Actions</h3>
              <div className="flex flex-col gap-3">
                <a
                  className="btn-accent text-center"
                  href="mailto:ops@glsalliance.com?subject=Inquiry%20from%20GLS%20Alliance%20Website"
                >
                  Email Operations
                </a>

                <a
                  className="btn-accent text-center"
                  href="https://maps.google.com/?q=Al+Jabri+Building+Naif+Deira+Dubai"
                  target="_blank"
                  rel="noreferrer"
                >
                  Get Directions (Dubai)
                </a>

                <a
                  className="btn-accent text-center"
                  href="https://maps.google.com/?q=Wijayamangalarama+Road+Kohuwala+Sri+Lanka"
                  target="_blank"
                  rel="noreferrer"
                >
                  Get Directions (Sri Lanka)
                </a>
              </div>
            </Card>
          </aside>
        </div>
      </section>
    </main>
  );
}

/* ---------- small internal components ---------- */

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6">
      {children}
    </div>
  );
}

function OfficeCard({ office }: { office: Office }) {
  return (
    <Card>
      <h3 className="text-[var(--color-black)] font-medium">{office.title}</h3>
      <address className="not-italic mt-2 leading-7">
        {office.lines.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </address>
    </Card>
  );
}

/** Google Maps iframe without API key. Uses a search query -> output=embed. */
function OfficeMap({ query, title }: { query: string; title: string }) {
  const src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
  return (
    <Card>
      <h3 className="text-[var(--color-black)] font-medium mb-4">{title}</h3>
      <div className="w-full rounded-2xl overflow-hidden border border-black/10">
        <iframe
          title={title}
          src={src}
          className="w-full h-[320px] md:h-[440px]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </Card>
  );
}
