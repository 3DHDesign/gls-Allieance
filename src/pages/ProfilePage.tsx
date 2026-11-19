 // src/pages/ProfilePage.tsx
import { useEffect, useMemo, useState } from "react";
import {
  FiBriefcase,
  FiCalendar,
  FiCheckCircle,
  FiGlobe,
  FiMail,
  FiMapPin,
  FiPhone,
  FiShield,
  FiUser,
} from "react-icons/fi";
import DashboardShell from "../components/DashboardShell";
import { useAuth } from "../context/AuthContext";
import { getMemberByUserId } from "../api/member";
import type { MemberRegistration } from "../api/member";

function Item({ label, value }: { label: string; value: any }) {
  return (
    <div className="grid gap-1 border-b border-slate-100 pb-3 last:border-0 last:pb-0 sm:grid-cols-[170px_1fr] sm:gap-3">
      <div className="text-xs font-medium uppercase tracking-[0.08em] text-slate-400">{label}</div>
      <div className="break-words text-sm font-semibold text-slate-700">
        {value ?? "—"}
      </div>
    </div>
  );
}

function FilePreview({ label, url }: { label: string; url?: string | null }) {
  if (!url) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-[#0b1f3b]">{label}</div>
        </div>

        <div className="mt-3 rounded-lg border border-dashed border-gray-200 bg-[#f7f8fb] p-6 text-center text-sm text-gray-500">
          No file uploaded
        </div>
      </div>
    );
  }

  const cleanUrl = url.trim();
  const lower = cleanUrl.toLowerCase();

  const isPdf =
    lower.includes(".pdf") ||
    lower.includes("application/pdf") ||
    lower.endsWith("pdf");

  // ✅ reliable pdf preview (works when normal iframe blocked)
  const pdfViewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
    cleanUrl
  )}`;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold text-[#0b1f3b]">{label}</div>

        <div className="flex items-center gap-3">
          <a
            href={cleanUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-[var(--color-accent)] hover:underline"
          >
            Open
          </a>

          <a
            href={cleanUrl}
            download
            className="text-sm text-gray-600 hover:underline"
          >
            Download
          </a>
        </div>
      </div>

      <div className="mt-3 overflow-hidden rounded-lg border bg-[#f7f8fb]">
        {isPdf ? (
          <iframe title={label} src={pdfViewerUrl} className="h-[460px] w-full" />
        ) : (
          <img
            src={cleanUrl}
            alt={label}
            className="max-h-[460px] w-full object-contain"
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "data:image/svg+xml;charset=utf-8," +
                encodeURIComponent(
                  `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='400'>
                    <rect width='100%' height='100%' fill='#f7f8fb'/>
                    <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#6b7280' font-family='Arial' font-size='16'>
                      Image preview not available
                    </text>
                  </svg>`
                );
            }}
          />
        )}
      </div>

      <div className="mt-2 text-xs text-gray-500 break-all">{cleanUrl}</div>
    </div>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_12px_35px_rgba(15,35,75,0.06)]">
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-accent-light)]" />
        <h2 className="text-base font-bold text-[#0b1f3b]">{title}</h2>
      </div>
      <div className="space-y-3 p-5 sm:p-6">{children}</div>
    </div>
  );
}

function ProfileStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_24px_rgba(1,30,79,0.04)]">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-lg text-[var(--color-accent)]">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">{label}</p>
        <p className="mt-1 truncate text-sm font-semibold text-slate-700">{value}</p>
      </div>
    </div>
  );
}

function formatDate(val?: string | null) {
  if (!val) return "—";
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return val;
  return d.toLocaleDateString();
}

export default function ProfilePage() {
  const { user } = useAuth();
  const userId = user?.id;

  const [data, setData] = useState<MemberRegistration | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const contact = useMemo(() => data?.contacts?.[0], [data]);

  useEffect(() => {
    if (!userId) return;

    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getMemberByUserId(userId);

        if (!mounted) return;
        if (!res?.success) {
          setError("Failed to load profile.");
          setData(null);
          return;
        }

        setData(res.data);
      } catch (err: any) {
        if (!mounted) return;
        setError(
          err?.response?.data?.message ||
            err?.response?.data?.error ||
            err?.message ||
            "Failed to load profile."
        );
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [userId]);

  return (
    <DashboardShell>
      <div className="py-2">
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-accent-light)]">
              Member profile
            </p>
            <h1 className="mt-2 text-3xl font-bold text-[#0b1f3b] sm:text-4xl">Company profile</h1>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              Review your business identity and registered member information.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700 sm:self-end">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {data?.status || "Profile"}
          </div>
        </div>

        {loading ? (
          <div className="grid min-h-72 place-items-center rounded-[24px] border border-slate-200 bg-white text-sm text-slate-500 shadow-[0_12px_35px_rgba(15,35,75,0.06)]">
            Loading profile...
          </div>
        ) : error ? (
          <div className="rounded-[24px] border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            {error}
          </div>
        ) : (
          <div className="space-y-6">
            <section className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(120deg,#061a38,#0a3767)] p-6 text-white shadow-[0_18px_45px_rgba(7,29,66,0.20)] sm:p-8">
              <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-blue-400/10 blur-2xl" />
              <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl border border-white/10 bg-white/10 text-xl font-bold text-emerald-300">
                    {data?.company_profile_image_url ? (
                      <img src={data.company_profile_image_url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      (data?.company_name || user?.name || "GLS").slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">Verified member</p>
                    <h2 className="mt-2 truncate text-2xl font-bold text-white sm:text-3xl">
                      {data?.company_name || "Your company"}
                    </h2>
                    <p className="mt-1 text-sm text-blue-100">{data?.profile_type || "GLS Alliance member"}</p>
                  </div>
                </div>
                {data?.website && (
                  <a
                    href={data.website.startsWith("http") ? data.website : `https://${data.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-fit items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                  >
                    <FiGlobe /> Visit website
                  </a>
                )}
              </div>
            </section>

            <div className="grid gap-3 sm:grid-cols-3">
              <ProfileStat icon={<FiBriefcase />} label="Company" value={data?.company_name || "—"} />
              <ProfileStat icon={<FiMapPin />} label="Location" value={[data?.city, data?.country].filter(Boolean).join(", ") || "—"} />
              <ProfileStat icon={<FiCalendar />} label="Established" value={data?.year_established || "—"} />
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
              <div className="space-y-6">
                <SectionCard title="Company information">
                  <div className="grid gap-x-6 md:grid-cols-2">
                    <Item label="Company Name" value={data?.company_name} />
                    <Item label="Trade Name" value={data?.trade_name} />
                    <Item label="Year Established" value={data?.year_established} />
                    <Item label="Profile Type" value={data?.profile_type} />
                    <Item label="Reference Code" value={data?.ref_code} />
                    <Item label="Website" value={data?.website} />
                  </div>
                </SectionCard>

                <SectionCard title="Business overview">
                  <p className="text-sm leading-7 text-slate-600">
                    {data?.company_profile_overview || "No company overview has been provided."}
                  </p>
                </SectionCard>

                <SectionCard title="Registered address">
                  <div className="grid gap-x-6 md:grid-cols-2">
                    <Item label="Address" value={data?.registered_address} />
                    <Item label="Country" value={data?.country} />
                    <Item label="State / Province" value={data?.state_province} />
                    <Item label="City" value={data?.city} />
                    <Item label="Postal Code" value={data?.zip_code} />
                  </div>
                  <div className="mt-5 border-t border-slate-100 pt-5">
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">Mailing address</p>
                    <div className="grid gap-x-6 md:grid-cols-2">
                      <Item label="Title" value={data?.mailing_title} />
                      <Item label="Country" value={data?.mailing_country} />
                      <Item label="State" value={data?.mailing_state} />
                      <Item label="City" value={data?.mailing_city} />
                      <Item label="Zip" value={data?.mailing_zip} />
                    </div>
                  </div>
                </SectionCard>
              </div>

              <aside className="space-y-6">
                <SectionCard title="Primary contact">
                  <div className="mb-5 flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-[var(--color-accent)]">
                      <FiUser />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-[#0b1f3b]">{contact?.full_name || "—"}</p>
                      <p className="mt-1 text-xs text-slate-500">{contact?.designation || "Primary contact"}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {contact?.email && (
                      <a href={`mailto:${contact.email}`} className="flex items-center gap-3 text-sm text-slate-600 hover:text-[var(--color-accent)]">
                        <FiMail className="text-[var(--color-accent)]" /> {contact.email}
                      </a>
                    )}
                    {contact?.phone && (
                      <a href={`tel:${contact.phone}`} className="flex items-center gap-3 text-sm text-slate-600 hover:text-[var(--color-accent)]">
                        <FiPhone className="text-[var(--color-accent)]" /> {contact.phone}
                      </a>
                    )}
                    <Item label="Alternate Phone" value={contact?.alternate_phone} />
                  </div>
                </SectionCard>

                <SectionCard title="Compliance">
                  <div className="space-y-3">
                    {[
                      ["Financial Protection", !!data?.financial_protection_required],
                      ["Netting Agreement", !!data?.netting_required],
                    ].map(([label, enabled]) => (
                      <div key={String(label)} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                        <span className="text-xs font-semibold text-slate-600">{label}</span>
                        <span className={`flex items-center gap-1 text-xs font-bold ${enabled ? "text-emerald-700" : "text-slate-400"}`}>
                          <FiCheckCircle /> {enabled ? "Enabled" : "Not set"}
                        </span>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </aside>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <SectionCard title="Trade & operations">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">Main categories</p>
                  <p className="mt-2 text-sm font-semibold text-slate-700">
                    {(data?.export_main_category_ids || []).join(", ") || "Not provided"}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">Subcategories</p>
                  <p className="mt-2 text-sm font-semibold text-slate-700">
                    {(data?.export_subcategories || []).join(", ") || "Not provided"}
                  </p>
                </div>
                <Item label="Supported Countries" value={data?.supported_countries} />
              </SectionCard>

              <SectionCard title="Network & activities">
                <Item
                  label="Core Activities"
                  value={(data?.core_activities || []).join(", ") || "—"}
                />
                <Item
                  label="Branch Countries"
                  value={(data?.branches_countries || []).join(", ") || "—"}
                />
                <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  <FiShield />
                  <span className="font-semibold">Membership profile information</span>
                </div>
              </SectionCard>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <SectionCard title="BRC registration">
                <div className="grid gap-x-6 md:grid-cols-2">
                  <Item label="BRC Number" value={data?.brc_number} />
                  <Item label="Issue Date" value={formatDate(data?.brc_issue_date)} />
                  <Item label="Expiry Date" value={formatDate(data?.brc_expiry_date)} />
                </div>
                <FilePreview label="BRC Document" url={data?.brc_document_url} />
              </SectionCard>

              <SectionCard title="Insurance">
                <div className="grid gap-x-6 md:grid-cols-2">
                  <Item label="Provider" value={data?.insurance_provider} />
                  <Item label="Policy Type" value={data?.policy_type} />
                  <Item label="Policy Number" value={data?.policy_number} />
                  <Item label="Coverage Amount" value={data?.coverage_amount} />
                  <Item label="Expiry Date" value={formatDate(data?.insurance_expiry_date)} />
                </div>
                <FilePreview
                  label="Insurance Policy Document"
                  url={data?.insurance_policy_document_url}
                />
              </SectionCard>
            </div>

            <SectionCard title="Affiliations">
              {data?.affiliations?.length ? (
                <div className="grid gap-3 md:grid-cols-2">
                  {data.affiliations.map((affiliation, index) => (
                    <div
                      key={`${affiliation.name}-${index}`}
                      className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                    >
                      <p className="text-sm font-bold text-[#0b1f3b]">{affiliation.name}</p>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                        {affiliation.country && <span>{affiliation.country}</span>}
                        {affiliation.issue_date && <span>Issued {affiliation.issue_date}</span>}
                        {affiliation.expiry_date && <span>Expires {affiliation.expiry_date}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">No affiliations have been provided.</p>
              )}
            </SectionCard>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
