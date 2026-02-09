import { useEffect, useMemo, useState } from "react"; 
import { getContactDetails, type ContactDetailsResponse } from "../api/contactDetails";

type OfficeUI = {
  title: string;
  lines: string[];
  mapQuery?: string;
  mapTitle?: string;
};

export default function Contact() {
  const [data, setData] = useState<ContactDetailsResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getContactDetails();
        if (mounted) setData(res.data);
      } catch (e: any) {
        if (mounted) setError(e?.message || "Failed to load contact details");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const phones = useMemo(() => data?.global_contact?.phones ?? [], [data]);
  const emails = useMemo(() => data?.global_contact?.emails ?? [], [data]);

  const offices: OfficeUI[] = useMemo(() => {
    const list = data?.offices ?? [];
    return list.map((o) => {
      const title = `${o.office_name}${o.company_name ? ` — ${o.company_name}` : ""}`;

      const lines: string[] = [
        ...(o.address_lines ?? []),
        ...(o.phones?.length ? ["", "Phone:", ...o.phones] : []),
        ...(o.emails?.length ? ["", "Email:", ...o.emails] : []),
      ].filter((x) => x !== "");

      const mapQuery = [...(o.address_lines ?? [])].join(", ");
      return {
        title,
        lines,
        mapQuery: mapQuery || undefined,
        mapTitle: `${o.office_name} Map`,
      };
    });
  }, [data]);

  const registeredOffice: OfficeUI | null = useMemo(() => {
    if (!data?.registered_office) return null;
    return {
      title: data.registered_office.title || "Registered Office",
      lines: data.registered_office.address ?? [],
    };
  }, [data]);

  return (
    <main className="bg-primary pt-24 text-[var(--color-muted)]">
      {/* Hero */}
      <section className="bg-white border-b border-black/10">
        <div className="container py-14">
          <h1 className="text-[var(--color-black)]">Contact GLS Alliance</h1>
          <p className="mt-3">
            Reach our team via phone or email. Offices and contact points listed below.
          </p>

          {/* Optional: Who we are / Vision / Mission */}
          {/* {!loading && !error && data && (
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <InfoBlock title={data.who_we_are?.title} desc={data.who_we_are?.description} />
              <InfoBlock title={data.vision?.title} desc={data.vision?.description} />
              <InfoBlock title={data.mission?.title} desc={data.mission?.description} />
            </div>
          )} */}
        </div>
      </section>

      {/* Content */}
      <section>
        <div className="container py-12">
          {loading && (
            <div className="text-center text-[var(--color-muted)]/80">
              Loading contact details...
            </div>
          )}

          {!loading && error && (
            <div className="text-center text-red-600">{error}</div>
          )}

          {!loading && !error && data && (
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Left: Offices */}
              <div className="lg:col-span-2 space-y-6">
                {/* Offices (cards) */}
                {offices.length > 0 && (
                  <div className="grid gap-6 lg:grid-cols-2">
                    {offices.slice(0, 2).map((office) => (
                      <OfficeCard key={office.title} office={office} />
                    ))}
                  </div>
                )}

                {/* Maps for first 2 offices */}
                {offices.length > 0 && (
                  <div className="grid gap-6 lg:grid-cols-2">
                    {offices.slice(0, 2).map((office) =>
                      office.mapQuery ? (
                        <OfficeMap
                          key={`${office.title}-map`}
                          query={office.mapQuery}
                          title={office.mapTitle || "Office Map"}
                        />
                      ) : (
                        <Card key={`${office.title}-map`}>
                          <div className="text-[var(--color-muted)]/80">
                            No map address for {office.title}
                          </div>
                        </Card>
                      )
                    )}
                  </div>
                )}

                {/* If there are more offices, list them full-width */}
                {offices.length > 2 && (
                  <div className="space-y-6">
                    {offices.slice(2).map((office) => (
                      <OfficeCard key={office.title} office={office} />
                    ))}
                  </div>
                )}

                {/* Registered office full width */}
                {registeredOffice && <OfficeCard office={registeredOffice} />}
              </div>

              {/* Right: Contact methods */}
              <aside className="space-y-6">
                <Card>
                  <h3 className="text-[var(--color-black)] font-medium mb-4">Phone</h3>
                  {phones.length === 0 ? (
                    <div className="text-[var(--color-muted)]/70">No phone numbers</div>
                  ) : (
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
                  )}
                </Card>

                <Card>
                  <h3 className="text-[var(--color-black)] font-medium mb-4">Email</h3>
                  {emails.length === 0 ? (
                    <div className="text-[var(--color-muted)]/70">No email addresses</div>
                  ) : (
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
                  )}
                </Card>

                <Card>
                  <h3 className="text-[var(--color-black)] font-medium mb-4">Quick Actions</h3>
                  <div className="flex flex-col gap-3">
                    {emails?.[0] ? (
                      <a
                        className="btn-accent text-center"
                        href={`mailto:${emails[0]}?subject=Inquiry%20from%20GLS%20Alliance%20Website`}
                      >
                        Email Us
                      </a>
                    ) : (
                      <div className="text-[var(--color-muted)]/70">
                        No email configured for quick action
                      </div>
                    )}

                    {offices?.[0]?.mapQuery && (
                      <a
                        className="btn-accent text-center"
                        href={`https://maps.google.com/?q=${encodeURIComponent(offices[0].mapQuery)}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Get Directions (Office 1)
                      </a>
                    )}

                    {offices?.[1]?.mapQuery && (
                      <a
                        className="btn-accent text-center"
                        href={`https://maps.google.com/?q=${encodeURIComponent(offices[1].mapQuery)}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Get Directions (Office 2)
                      </a>
                    )}
                  </div>
                </Card>
              </aside>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

/* ---------- small internal components ---------- */

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-black/10 bg-white p-6">{children}</div>;
}

function OfficeCard({ office }: { office: { title: string; lines: string[] } }) {
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

 
