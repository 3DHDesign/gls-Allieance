 // src/pages/ProfilePage.tsx
import { useEffect, useMemo, useState } from "react";
import DashboardShell from "../components/DashboardShell";
import { useAuth } from "../context/AuthContext";
import { getMemberByUserId } from "../api/member";
import type { MemberRegistration } from "../api/member";

function Item({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
      <div className="w-[180px] text-gray-500">{label}</div>
      <div className="text-gray-800 font-medium break-words flex-1">
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
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-[16px] font-semibold text-[#0b1f3b]">{title}</h2>
      </div>
      <div className="mt-4 space-y-3">{children}</div>
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
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#0b1f3b]">Profile</h1>
          <p className="mt-1 text-[var(--color-muted)]">
            Full company profile details.
          </p>
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
