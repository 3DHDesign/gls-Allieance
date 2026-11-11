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
    <main className="bg-[#f7f9fc] pt-[78px] text-[var(--color-muted)]">
      <section className="relative isolate overflow-hidden bg-[#061a35]">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero_about.jpg')" }}
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(3,24,55,0.96),rgba(3,24,55,0.76),rgba(3,24,55,0.42))]" />
        <div className="container relative flex min-h-[280px] items-center py-12 md:min-h-[320px]">
          <div className="max-w-2xl text-white">
            <div className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
              <span className="h-px w-9 bg-emerald-300" />
              We are here to help
            </div>
            <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
              Let&apos;s move your business forward.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-white/80 md:text-lg">
              Connect with the GLS Alliance team for partnership opportunities,
              membership support, and global logistics solutions.
            </p>
          </div>
          <div className="absolute bottom-8 right-6 hidden rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-white backdrop-blur-md lg:block">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200">
              Global network
            </p>
            <p className="mt-1 text-sm text-white/80">People. Businesses. Solutions.</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section>
        <div className="container py-14 md:py-16">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-light)]">
              Reach out to us
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-[var(--color-accent)] md:text-4xl">
              Our offices are ready to connect
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-500">
              Find the office closest to you and speak with our team directly.
            </p>
          </div>
          {loading && (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center text-[var(--color-muted)]/80 shadow-sm">
              Loading contact details...
            </div>
          )}

          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-center text-red-600">
              {error}
            </div>
          )}

          {!loading && !error && data && (
            <div className="space-y-10">
              {offices.map((office) => (
                <div
                  key={office.title}
                  className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]"
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
    <div className="h-full rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_10px_35px_rgba(1,30,79,0.06)]">
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
      <div className="mb-6 flex items-start gap-4">
        <span className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-sm font-bold text-[var(--color-accent)]">
          GLS
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-light)]">
            Alliance office
          </p>
          <h3 className="mt-1 text-xl font-semibold text-[var(--color-black)]">
            {office.title}
          </h3>
        </div>
      </div>

      <address className="not-italic text-[15px] leading-7 text-slate-500">
        {office.address.map((line, i) => (
          <div key={i}>{line}</div>
        ))}

        {office.phones.length > 0 && (
          <div className="mt-4">
            <div className="font-semibold text-[var(--color-black)]">
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
            <div className="font-semibold text-[var(--color-black)]">
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
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_10px_35px_rgba(1,30,79,0.06)]">
      <iframe
        title={title}
        src={src}
        className="h-[320px] w-full rounded-xl md:h-[380px]"
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}