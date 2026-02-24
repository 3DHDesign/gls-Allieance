import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiArrowLeft, FiExternalLink, FiMapPin, FiGlobe } from "react-icons/fi";
import { getMemberById } from "../api/memberProfile";

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-gray-200 bg-white p-5">{children}</div>;
}

function safeDate(d?: string) {
  if (!d) return "";
  const dt = new Date(d);
  return Number.isNaN(dt.getTime()) ? d : dt.toLocaleDateString();
}

export default function ForwarderProfile() {
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    const run = async () => {
      try {
        setLoading(true);
        setMsg(null);

        const res = await getMemberById(id);
        if (!res?.success || !res?.data) {
          setMsg("Company not found.");
          setData(null);
          return;
        }

        setData(res.data);
      } catch (e) {
        setMsg("Failed to load profile. Please try again.");
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [id]);

  const companyName = data?.company_name || data?.name || "Unnamed Company";
  const country = data?.country || "-";
  const city = data?.city || "-";
  const website = data?.website || "";
  const overview = data?.company_profile_overview || "";

  const imageUrl =
    data?.company_profile_image_url ||
    data?.company_profile_image ||
    ""; // depends on backend

  const addressLines = useMemo(() => {
    if (!data) return [];
    const lines: string[] = [];
    if (data.registered_address) lines.push(data.registered_address);
    const line2 = [data.city, data.state_province, data.zip_code].filter(Boolean).join(", ");
    if (line2) lines.push(line2);
    if (data.country) lines.push(data.country);
    return lines;
  }, [data]);

  if (loading) {
    return (
      <main className="container pt-24 pb-10">
        <div className="rounded-2xl bg-white border border-gray-100 p-10 text-center text-muted">
          Loading profile...
        </div>
      </main>
    );
  }

  if (msg || !data) {
    return (
      <main className="container pt-24 pb-10">
        <Link to="/find-forwarder" className="inline-flex items-center gap-2 text-[var(--color-accent)]">
          <FiArrowLeft /> Back to directory
        </Link>
        <h1 className="mt-4 text-2xl font-semibold">{msg || "Company not found"}</h1>
      </main>
    );
  }

  return (
    <main className="pt-24">
      {/* Hero */}
      <section className="bg-white">
        <div className="container py-6">
          <Link to="/find-forwarder" className="inline-flex items-center gap-2 text-[var(--color-accent)]">
            <FiArrowLeft /> Back to directory
          </Link>

          <div className="mt-4 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="min-w-0">
              <h1 className="text-[28px] md:text-[36px] font-bold text-gray-900">
                {companyName}
              </h1>

              <div className="mt-2 flex items-center gap-2 text-sm text-muted">
                <FiMapPin className="opacity-70" />
                <span>{city}, {country}</span>
              </div>

              {data?.ref_code && (
                <div className="mt-2 text-xs text-muted">
                  Ref: <span className="font-medium text-gray-800">{data.ref_code}</span>
                  {data?.status ? (
                    <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5">
                      {String(data.status)}
                    </span>
                  ) : null}
                </div>
              )}
            </div>

            {/* right buttons */}
            <div className="flex items-center gap-2">
              {website ? (
                <a
                  href={website}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-accent inline-flex items-center gap-2"
                >
                  <FiGlobe /> Website
                </a>
              ) : null}
            </div>
          </div>

          {/* optional company image */}
          {imageUrl ? (
            <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <img
                src={imageUrl}
                alt={companyName}
                className="w-full h-[240px] md:h-[320px] object-cover"
                loading="lazy"
              />
            </div>
          ) : null}
        </div>
      </section>

      {/* Body */}
      <section>
        <div className="container grid gap-6 lg:grid-cols-3 py-6">
          {/* Left column */}
          <div className="space-y-6 lg:col-span-2">
            {/* Overview */}
            <Card>
              <h3 className="text-lg font-semibold mb-3">Profile</h3>
              <p className="text-sm leading-7 text-gray-700">
                {overview || "Company overview coming soon."}
              </p>

              {/* exporter/importer extra bits */}
              {(data?.export_subcategories?.length || data?.export_main_categories?.length) ? (
                <>
                  <h4 className="mt-4 font-medium">Categories</h4>

                  {!!data?.export_main_categories?.length && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {data.export_main_categories.map((c: any) => (
                        <span
                          key={c.id ?? c.name}
                          className="rounded-full border border-gray-200 px-2.5 py-1 text-xs bg-gray-50"
                        >
                          {c.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {!!data?.export_subcategories?.length && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {data.export_subcategories.map((c: string) => (
                        <span
                          key={c}
                          className="rounded-full border border-gray-200 px-2.5 py-1 text-xs"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                </>
              ) : null}

              {!!data?.core_activities?.length && (
                <>
                  <h4 className="mt-4 font-medium">Core Activities</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {data.core_activities.map((c: string) => (
                      <span key={c} className="rounded-full border border-gray-200 px-2.5 py-1 text-xs bg-gray-50">
                        {c}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </Card>

            {/* Office Contacts */}
            <Card>
              <h3 className="text-lg font-semibold mb-3">Office Contacts</h3>
              {data?.contacts?.length ? (
                <div className="space-y-4">
                  {data.contacts.map((p: any, i: number) => (
                    <div key={i} className="rounded-lg border border-gray-200 p-3">
                      <div className="font-medium">{p.full_name || "Contact"}</div>
                      {p.designation ? <div className="text-sm text-muted">{p.designation}</div> : null}

                      <div className="mt-2 grid gap-1 text-sm">
                        {p.email ? (<div><span className="font-medium">Email:</span> {p.email}</div>) : null}
                        {p.phone ? (<div><span className="font-medium">Phone:</span> {p.phone}</div>) : null}
                        {p.alternate_phone ? (<div><span className="font-medium">Alt:</span> {p.alternate_phone}</div>) : null}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted">No office contacts listed.</p>
              )}
            </Card>
          </div>

          {/* Right column */}
          <aside className="space-y-6">
            {/* Address */}
            <Card>
              <h3 className="text-lg font-semibold mb-3">Address</h3>
              {addressLines.length ? (
                <address className="not-italic text-sm leading-7 text-gray-700">
                  {addressLines.map((ln, i) => <div key={i}>{ln}</div>)}
                </address>
              ) : (
                <p className="text-sm text-muted">Address not available.</p>
              )}
            </Card>

            {/* Contact Details */}
            <Card>
              <h3 className="text-lg font-semibold mb-3">Contact Details</h3>
              <div className="grid gap-1 text-sm">
                {website ? (
                  <div className="inline-flex items-center gap-2">
                    <span className="font-medium">Website:</span>
                    <a
                      className="text-[var(--color-accent)] inline-flex items-center gap-1"
                      href={website}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {website} <FiExternalLink />
                    </a>
                  </div>
                ) : (
                  <p className="text-sm text-muted">No website provided.</p>
                )}
              </div>
            </Card>

            {/* BRC (if exists) */}
            {(data?.brc_number || data?.brc_issue_date || data?.brc_expiry_date) ? (
              <Card>
                <h3 className="text-lg font-semibold mb-3">Business Registration (BRC)</h3>
                <div className="grid gap-1 text-sm">
                  {data.brc_number ? <div><span className="font-medium">BRC No:</span> {data.brc_number}</div> : null}
                  {data.brc_issue_date ? <div><span className="font-medium">Issued:</span> {safeDate(data.brc_issue_date)}</div> : null}
                  {data.brc_expiry_date ? <div><span className="font-medium">Expiry:</span> {safeDate(data.brc_expiry_date)}</div> : null}
                </div>
              </Card>
            ) : null}
          </aside>
        </div>
      </section>
    </main>
  );
}