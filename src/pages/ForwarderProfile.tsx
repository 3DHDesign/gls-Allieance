import { Link, useParams } from "react-router-dom";
import { FORWARDERS, type Forwarder } from "../utils/forwarders";
import { FORWARDER_DETAILS } from "../utils/forwarderDetails";
import { FiArrowLeft, FiExternalLink, FiMapPin, FiGlobe } from "react-icons/fi";

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-gray-200 bg-white p-5">{children}</div>;
}

export default function ForwarderProfile() {
  const { id } = useParams<{ id: string }>();
  const base: Forwarder | undefined = FORWARDERS.find((f) => f.id === id);
  const d = id ? FORWARDER_DETAILS[id] : undefined;

  if (!base) {
    return (
      <main className="container pt-24 pb-10">
        <Link to="/find-forwarder" className="inline-flex items-center gap-2 text-[var(--color-accent)]">
          <FiArrowLeft /> Back to directory
        </Link>
        <h1 className="mt-4 text-2xl font-semibold">Company not found</h1>
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

          <div className="mt-3 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-[28px] md:text-[36px] font-bold text-gray-900">
                {base.name}
              </h1>
              <div className="mt-1 flex items-center gap-2 text-sm text-muted">
                <FiMapPin className="opacity-70" />
                <span>{base.city}, {base.country}</span>
                {typeof base.years === "number" && (
                  <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                    {base.years} {base.years === 1 ? "year" : "years"}
                  </span>
                )}
              </div>
            </div>

            {/* RIGHT SIDE: Website only (tags removed) */}
            <div className="flex items-center gap-2">
              {d?.contacts?.website && (
                <a
                  href={d.contacts.website}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-accent inline-flex items-center gap-2"
                >
                  <FiGlobe /> Website
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section>
        <div className="container grid gap-6 lg:grid-cols-3 py-6">
          {/* Left column */}
          <div className="space-y-6 lg:col-span-2">
            {/* Memberships (logos & code badges removed) */}
            <Card>
              <h3 className="text-lg font-semibold mb-3">Memberships & Affiliations</h3>
              {d?.enrolledSince && (
                <p className="text-sm text-muted mb-3">
                  Proudly enrolled since:{" "}
                  <span className="font-medium">
                    {new Date(d.enrolledSince).toLocaleDateString()}
                  </span>
                </p>
              )}

              {d?.memberships?.length ? (
                <ul className="grid gap-3 sm:grid-cols-2">
                  {d.memberships.map((m, i) => (
                    <li key={i} className="rounded-lg border border-gray-200 p-3">
                      <div className="font-medium">{m.name}</div>
                      {m.expires && (
                        <div className="text-xs text-muted mt-0.5">
                          Expires: {new Date(m.expires).toLocaleDateString()}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted">No memberships recorded.</p>
              )}
            </Card>

            {/* Overview */}
            <Card>
              <h3 className="text-lg font-semibold mb-3">Profile</h3>
              <p className="text-sm leading-7">
                {d?.overview ?? "Company overview coming soon."}
              </p>
              {!!d?.services?.length && (
                <>
                  <h4 className="mt-4 font-medium">Services</h4>
                  <ul className="mt-2 list-disc pl-5 text-sm space-y-1">
                    {d.services.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </>
              )}
              {!!d?.core?.length && (
                <>
                  <h4 className="mt-4 font-medium">Core Activities</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {d.core.map((c, i) => (
                      <span key={i} className="rounded-full border border-gray-200 px-2.5 py-1 text-xs bg-gray-50">
                        {c}
                      </span>
                    ))}
                  </div>
                </>
              )}
              {!!d?.sectors?.length && (
                <>
                  <h4 className="mt-4 font-medium">Sectors</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {d.sectors.map((c, i) => (
                      <span key={i} className="rounded-full border border-gray-200 px-2.5 py-1 text-xs bg-gray-50">
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
              {d?.officeContacts?.length ? (
                <div className="space-y-4">
                  {d.officeContacts.map((p, i) => (
                    <div key={i} className="rounded-lg border border-gray-200 p-3">
                      <div className="font-medium">{p.name}</div>
                      {p.title && <div className="text-sm text-muted">{p.title}</div>}
                      <div className="mt-2 grid gap-1 text-sm">
                        {p.email && (<div><span className="font-medium">Email:</span> {p.email}</div>)}
                        {p.phone && (<div><span className="font-medium">Phone:</span> {p.phone}</div>)}
                        {p.mobile && (<div><span className="font-medium">Mobile:</span> {p.mobile}</div>)}
                        {p.directLine && (<div><span className="font-medium">Direct Line:</span> {p.directLine}</div>)}
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
              {d?.address?.length ? (
                <address className="not-italic text-sm leading-7 text-gray-700">
                  {d.address.map((ln, i) => <div key={i}>{ln}</div>)}
                </address>
              ) : (
                <p className="text-sm text-muted">Address not available.</p>
              )}
            </Card>

            {/* Contact Details */}
            <Card>
              <h3 className="text-lg font-semibold mb-3">Contact Details</h3>
              <div className="grid gap-1 text-sm">
                {d?.contacts?.phone && (<div><span className="font-medium">Phone:</span> {d.contacts.phone}</div>)}
                {d?.contacts?.fax && (<div><span className="font-medium">Fax:</span> {d.contacts.fax}</div>)}
                {d?.contacts?.emergency && (<div><span className="font-medium">Emergency Call:</span> {d.contacts.emergency}</div>)}
                {d?.contacts?.website && (
                  <div className="inline-flex items-center gap-2">
                    <span className="font-medium">Website:</span>
                    <a className="text-[var(--color-accent)] inline-flex items-center gap-1"
                       href={d.contacts.website} target="_blank" rel="noreferrer">
                      {d.contacts.website} <FiExternalLink />
                    </a>
                  </div>
                )}
                {d?.contacts?.email && (<div><span className="font-medium">Email:</span> {d.contacts.email}</div>)}
              </div>
            </Card>
          </aside>
        </div>
      </section>
    </main>
  );
}
