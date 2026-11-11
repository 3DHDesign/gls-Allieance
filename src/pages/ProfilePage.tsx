 // src/pages/ProfilePage.tsx
import { useEffect, useMemo, useState } from "react";
import { FiBriefcase, FiCalendar, FiMapPin } from "react-icons/fi";
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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(1,30,79,0.05)] sm:p-6">
      <div className="flex items-center gap-3">
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
        <h2 className="text-[16px] font-semibold text-[#0b1f3b]">{title}</h2>
      </div>
      <div className="mt-4 space-y-3">{children}</div>
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
      <div className="max-w-[1100px]">
        <div className="mb-6 flex flex-col gap-5 rounded-3xl bg-[linear-gradient(120deg,#031837,#0a3767)] p-6 text-white shadow-[0_16px_40px_rgba(1,30,79,0.15)] sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white/10 text-xl font-bold text-emerald-300">
              {data?.company_profile_image_url ? (
                <img src={data.company_profile_image_url} alt="" className="h-full w-full object-cover" />
              ) : (
                (data?.company_name || user?.name || "GLS").slice(0, 2).toUpperCase()
              )}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">Member profile</p>
              <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">{data?.company_name || "Your company profile"}</h1>
              <p className="mt-1 text-sm text-white/60">{data?.profile_type || "GLS Alliance member"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/85 sm:self-center">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            {data?.status || "Profile"}
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            Loading...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-white p-6 text-red-700">
            {error}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-3">
              <ProfileStat icon={<FiBriefcase />} label="Company" value={data?.company_name || "—"} />
              <ProfileStat icon={<FiMapPin />} label="Location" value={data?.country || "—"} />
              <ProfileStat icon={<FiCalendar />} label="Established" value={data?.year_established || "—"} />
            </div>
            {/* TOP GRID */}
            <div className="grid gap-6 lg:grid-cols-2">
              <SectionCard title="Company">
                <Item label="Company Name" value={data?.company_name} />
                <Item label="Trade Name" value={data?.trade_name} />
                <Item label="Year Established" value={data?.year_established} />
                <Item label="Website" value={data?.website} />
                <Item label="Profile Type" value={data?.profile_type} />
                <Item label="Reference Code" value={data?.ref_code} />
                <Item label="Status" value={data?.status} />

                <div className="pt-2">
                  <FilePreview
                    label="Company Profile Image / Logo"
                    url={data?.company_profile_image_url}
                  />
                </div>
              </SectionCard>

              <SectionCard title="Address">
                <Item label="Registered Address" value={data?.registered_address} />
                <Item label="Country" value={data?.country} />
                <Item label="State/Province" value={data?.state_province} />
                <Item label="City" value={data?.city} />
                <Item label="Zip Code" value={data?.zip_code} />

                <div className="pt-3">
                  <h3 className="text-sm font-semibold text-[#0b1f3b]">
                    Mailing Address
                  </h3>
                  <div className="mt-3 space-y-3">
                    <Item label="Title" value={data?.mailing_title} />
                    <Item label="Country" value={data?.mailing_country} />
                    <Item label="State" value={data?.mailing_state} />
                    <Item label="City" value={data?.mailing_city} />
                    <Item label="Zip" value={data?.mailing_zip} />
                  </div>
                </div>
              </SectionCard>
            </div>

            {/* SECOND GRID */}
            <div className="grid gap-6 lg:grid-cols-2">
              <SectionCard title="Contact">
                <Item label="Full Name" value={contact?.full_name} />
                <Item label="Designation" value={contact?.designation} />
                <Item label="Email" value={contact?.email} />
                <Item label="Phone" value={contact?.phone} />
                <Item label="Alt Phone" value={contact?.alternate_phone} />

                <div className="pt-3">
                  <h3 className="text-sm font-semibold text-[#0b1f3b]">Flags</h3>
                  <div className="mt-3 space-y-3">
                    <Item
                      label="Financial Protection Required"
                      value={String(!!data?.financial_protection_required)}
                    />
                    <Item
                      label="Netting Required"
                      value={String(!!data?.netting_required)}
                    />
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="BRC & Insurance">
                <Item label="BRC Number" value={data?.brc_number} />
                <Item label="BRC Issue Date" value={formatDate(data?.brc_issue_date)} />
                <Item label="BRC Expiry Date" value={formatDate(data?.brc_expiry_date)} />

                <div className="pt-2">
                  <FilePreview label="BRC Document" url={data?.brc_document_url} />
                </div>

                <div className="pt-4 space-y-3">
                  <Item label="Insurance Provider" value={data?.insurance_provider} />
                  <Item label="Policy Type" value={data?.policy_type} />
                  <Item label="Policy Number" value={data?.policy_number} />
                  <Item label="Coverage Amount" value={data?.coverage_amount} />
                  <Item
                    label="Insurance Expiry Date"
                    value={formatDate(data?.insurance_expiry_date)}
                  />
                </div>

                <div className="pt-2">
                  <FilePreview
                    label="Insurance Policy Document"
                    url={data?.insurance_policy_document_url}
                  />
                </div>
              </SectionCard>
            </div>

            {/* OVERVIEW */}
            <SectionCard title="Overview">
              <div className="text-sm text-gray-700 leading-6">
                {data?.company_profile_overview || "—"}
              </div>
            </SectionCard>

            {/* CATEGORIES / OPERATIONS */}
            <div className="grid gap-6 lg:grid-cols-2">
              <SectionCard title="Categories">
                <div className="text-sm text-gray-700">
                  <b>Main:</b>{" "}
                  {(data?.export_main_category_ids || []).join(", ") || "—"}
                </div>
                <div className="text-sm text-gray-700">
                  <b>Sub:</b> {(data?.export_subcategories || []).join(", ") || "—"}
                </div>
              </SectionCard>

              <SectionCard title="Operations">
                <div className="text-sm text-gray-700">
                  <b>Core Activities:</b>{" "}
                  {(data?.core_activities || []).join(", ") || "—"}
                </div>
                <div className="text-sm text-gray-700">
                  <b>Branches Countries:</b>{" "}
                  {(data?.branches_countries || []).join(", ") || "—"}
                </div>
                <div className="text-sm text-gray-700">
                  <b>Supported Countries:</b> {data?.supported_countries || "—"}
                </div>
              </SectionCard>
            </div>

            {/* AFFILIATIONS */}
            <SectionCard title="Affiliations">
              {data?.affiliations?.length ? (
                <div className="grid gap-3">
                  {data.affiliations.map((a, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-gray-200 bg-[#f7f8fb] p-4"
                    >
                      <div className="text-sm font-semibold text-gray-800">
                        {a.name}
                      </div>
                      <div className="mt-1 text-sm text-gray-600">
                        {a.country ? `Country: ${a.country}` : "Country: —"}
                      </div>
                      <div className="mt-1 text-sm text-gray-600">
                        {a.issue_date ? `Issue: ${a.issue_date}` : "Issue: —"} |{" "}
                        {a.expiry_date ? `Expiry: ${a.expiry_date}` : "Expiry: —"}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-700">—</div>
              )}
            </SectionCard>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
