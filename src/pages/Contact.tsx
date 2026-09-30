import { useEffect, useMemo, useState } from "react";
import {
  getContactDetails,
  type ContactDetailsResponse,
} from "../api/contactDetails";

type OfficeUI = {
  title: string;
  address: string[];
  phones: string[];
  emails: string[];
  mapQuery?: string;
  mapTitle?: string;
};

export default function Contact() {
  const [data, setData] =
    useState<ContactDetailsResponse["data"] | null>(null);

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
        if (mounted) {
          setError(e?.message || "Failed to load contact details");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const offices: OfficeUI[] = useMemo(() => {
    const list = data?.offices ?? [];

    return list.map((o) => {
      const title = `${o.office_name}${
        o.company_name ? ` — ${o.company_name}` : ""
      }`;

      const address = o.address_lines ?? [];
      const addressQuery = address.join(", ");

      const isSriLankaOffice =
        o.office_name?.toLowerCase().includes("colombo") ||
        addressQuery.toLowerCase().includes("sri lanka");

      return {
        title,
        address,
        phones: o.phones ?? [],
        emails: o.emails ?? [],
        mapQuery: isSriLankaOffice
          ? "6.863737,79.884626"
          : addressQuery || undefined,
        mapTitle: `${o.office_name} Map`,
      };
    });
  }, [data]);

  return (
    <main className="bg-primary pt-24 text-[var(--color-muted)]">
      {/* Hero */}
      <section className="border-b border-black/10 bg-white">
        <div className="container py-14">
          <h1 className="text-[var(--color-black)]">
            Contact GLS Alliance
          </h1>
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
            <div className="text-center text-red-600">
              {error}
            </div>
          )}

          {!loading && !error && data && (
            <div className="space-y-8">
              {offices.map((office) => (
                <div
                  key={office.title}
                  className="grid gap-6 lg:grid-cols-2"
                >
                  <OfficeCard office={office} />

                  {office.mapQuery && (
                    <OfficeMap
                      query={office.mapQuery}
                      title={office.mapTitle || "Office Map"}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function Card({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
      {children}
    </div>
  );
}

function OfficeCard({
  office,
}: {
  office: OfficeUI;
}) {
  return (
    <Card>
      <h3 className="mb-4 text-xl font-medium text-[var(--color-black)]">
        {office.title}
      </h3>

      <address className="not-italic leading-7">
        {office.address.map((line, i) => (
          <div key={i}>{line}</div>
        ))}

        {office.phones.length > 0 && (
          <div className="mt-4">
            <div className="font-medium text-[var(--color-black)]">
              Phone:
            </div>

            {office.phones.map((phone) => (
              <a
                key={phone}
                href={`tel:${phone.replace(/\s+/g, "")}`}
                className="block text-[var(--color-accent)] hover:underline"
              >
                {phone}
              </a>
            ))}
          </div>
        )}

        {office.emails.length > 0 && (
          <div className="mt-4">
            <div className="font-medium text-[var(--color-black)]">
              Email:
            </div>

            {office.emails.map((email) => (
              <a
                key={email}
                href={`mailto:${email}`}
                className="block break-all text-[var(--color-accent)] hover:underline"
              >
                {email}
              </a>
            ))}
          </div>
        )}
      </address>
    </Card>
  );
}

function OfficeMap({
  query,
  title,
}: {
  query: string;
  title: string;
}) {
  const src = `https://www.google.com/maps?q=${encodeURIComponent(
    query
  )}&z=16&output=embed`;

  return (
    <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
      <iframe
        title={title}
        src={src}
        className="h-[320px] w-full md:h-[380px]"
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}