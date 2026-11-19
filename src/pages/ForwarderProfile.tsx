import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiBriefcase,
  FiCalendar,
  FiExternalLink,
  FiGlobe,
  FiMail,
  FiMapPin,
  FiPhone,
  FiShield,
  FiUser,
} from "react-icons/fi";
import { getMemberById } from "../api/memberProfile";

function Card({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_12px_35px_rgba(15,35,75,0.06)]">
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 sm:px-7">
        {icon && (
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-[var(--color-accent)]">
            {icon}
          </span>
        )}
        <h2 className="text-base font-bold text-[#0b1f3b]">{title}</h2>
      </div>
      <div className="p-5 sm:p-7">{children}</div>
    </section>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value?: React.ReactNode;
}) {
  return (
    <div className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
        {label}
      </p>
      <div className="mt-1 break-words text-sm font-semibold text-slate-700">
        {value || "—"}
      </div>
    </div>
  );
}

function safeDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
}

export default function ForwarderProfile() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    let mounted = true;

    const loadProfile = async () => {
      try {
        setLoading(true);
        setMessage(null);
        const response = await getMemberById(id);
        if (!mounted) return;
        if (!response?.success || !response?.data) {
          setMessage("Company not found.");
          setData(null);
          return;
        }
        setData(response.data);
      } catch {
        if (!mounted) return;
        setMessage("Failed to load profile. Please try again.");
        setData(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadProfile();
    return () => {
      mounted = false;
    };
  }, [id]);

  const companyName =
    data?.company_name || data?.name || "Unnamed Company";
  const country = data?.country || "Location unavailable";
  const city = data?.city || "";
  const website = data?.website?.trim() || "";
  const websiteUrl =
    website && !/^https?:\/\//i.test(website)
      ? `https://${website}`
      : website;
  const imageUrl =
    data?.company_profile_image_url || data?.company_profile_image || "";

  const addressLines = useMemo(() => {
    if (!data) return [];
    const lines: string[] = [];
    if (data.registered_address) lines.push(data.registered_address);
    const locality = [
      data.city,
      data.state_province,
      data.zip_code,
    ].filter(Boolean).join(", ");
    if (locality) lines.push(locality);
    if (data.country) lines.push(data.country);
    return lines;
  }, [data]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f9fc] px-4 pb-16 pt-24">
        <div className="mx-auto max-w-[1180px]">
          <div className="animate-pulse">
            <div className="h-8 w-32 rounded-lg bg-slate-200" />
            <div className="mt-6 h-72 rounded-[28px] bg-slate-200" />
            <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
              <div className="h-96 rounded-[24px] bg-slate-200" />
              <div className="h-72 rounded-[24px] bg-slate-200" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (message || !data) {
    return (
      <main className="min-h-screen bg-[#f7f9fc] px-4 pb-16 pt-24">
        <div className="mx-auto max-w-[1180px]">
          <Link
            to="/find-forwarder"
            className="inline-flex items-center gap-2 text-sm font-bold text-[var(--color-accent)]"
          >
            <FiArrowLeft /> Back to directory
          </Link>
          <div className="mt-6 grid min-h-64 place-items-center rounded-[24px] border border-slate-200 bg-white text-center">
            <div>
              <p className="text-lg font-bold text-[#0b1f3b]">
                {message || "Company not found"}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                The member profile may have been removed or is unavailable.
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const mainCategories =
    data.export_main_categories?.map((category: any) => category.name) ||
    data.export_main_category_ids ||
    [];
  const subcategories = data.export_subcategories || [];

  return (
    <main className="min-h-screen bg-[#f7f9fc] pb-16 pt-[78px]">
      <section className="relative overflow-hidden bg-[#061a35]">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border-[80px] border-emerald-300/[0.05]" />
        <div className="absolute bottom-0 left-[30%] h-40 w-80 rounded-full bg-blue-400/[0.07] blur-3xl" />
        <div className="container relative py-8 sm:py-10">
          <Link
            to="/find-forwarder"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-white/70 transition hover:text-white"
          >
            <FiArrowLeft /> Member directory
          </Link>

          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="relative grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-[22px] border border-white/15 bg-white/10 text-xl font-bold text-emerald-300 shadow-2xl sm:h-24 sm:w-24">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={companyName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  companyName.slice(0, 2).toUpperCase()
                )}
                <span className="absolute bottom-2 right-2 h-3 w-3 rounded-full border-2 border-[#061a35] bg-emerald-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">
                  {data.profile_type === "importer_exporter"
                    ? "Importer / Exporter"
                    : "Freight forwarder"}
                </p>
                <h1 className="mt-2 max-w-3xl text-2xl font-bold leading-tight text-white sm:text-4xl">
                  {companyName}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-blue-100">
                  <span className="flex items-center gap-2">
                    <FiMapPin className="text-emerald-300" />
                    {[city, country].filter(Boolean).join(", ") || "Location unavailable"}
                  </span>
                  {data.status && (
                    <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-bold capitalize text-white">
                      {data.status}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {websiteUrl && (
              <a
                href={websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#061a35] shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5"
              >
                <FiGlobe /> Visit website
              </a>
            )}
          </div>
        </div>
      </section>

      <div className="container py-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-6">
            <Card title="Company overview" icon={<FiBriefcase />}>
              <p className="text-sm leading-7 text-slate-600">
                {data.company_profile_overview ||
                  "A detailed company overview is not available for this member."}
              </p>

              {(mainCategories.length > 0 || subcategories.length > 0) && (
                <div className="mt-6 border-t border-slate-100 pt-6">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                    Trade categories
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[...mainCategories, ...subcategories].map(
                      (category: string, index: number) => (
                        <span
                          key={`${category}-${index}`}
                          className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[var(--color-accent)]"
                        >
                          {category}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              )}

              {data.core_activities?.length > 0 && (
                <div className="mt-6 border-t border-slate-100 pt-6">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                    Core activities
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {data.core_activities.map((activity: string) => (
                      <span
                        key={activity}
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600"
                      >
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            <Card title="Office contacts" icon={<FiUser />}>
              {data.contacts?.length ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {data.contacts.map((contact: any, index: number) => (
                    <div
                      key={`${contact.full_name}-${index}`}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                    >
                      <div className="flex items-center gap-3">
                        <span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-[var(--color-accent)] shadow-sm">
                          <FiUser />
                        </span>
                        <div>
                          <p className="text-sm font-bold text-[#0b1f3b]">
                            {contact.full_name || "Office contact"}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {contact.designation || "Member contact"}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 space-y-2">
                        {contact.email && (
                          <a
                            href={`mailto:${contact.email}`}
                            className="flex items-center gap-2 text-xs text-slate-600 hover:text-[var(--color-accent)]"
                          >
                            <FiMail className="text-[var(--color-accent)]" />
                            {contact.email}
                          </a>
                        )}
                        {contact.phone && (
                          <a
                            href={`tel:${contact.phone}`}
                            className="flex items-center gap-2 text-xs text-slate-600 hover:text-[var(--color-accent)]"
                          >
                            <FiPhone className="text-[var(--color-accent)]" />
                            {contact.phone}
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  No office contacts are listed.
                </p>
              )}
            </Card>

            {(data.affiliations?.length > 0 ||
              data.branches_countries?.length > 0) && (
              <Card title="Network & affiliations" icon={<FiShield />}>
                {data.affiliations?.length > 0 && (
                  <div className="grid gap-3 md:grid-cols-2">
                    {data.affiliations.map((affiliation: any, index: number) => (
                      <div
                        key={`${affiliation.name}-${index}`}
                        className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                      >
                        <p className="text-sm font-bold text-[#0b1f3b]">
                          {affiliation.name || "Affiliation"}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {[affiliation.country, affiliation.issue_date && `Issued ${safeDate(affiliation.issue_date)}`]
                            .filter(Boolean)
                            .join(" · ") || "Details unavailable"}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                {data.branches_countries?.length > 0 && (
                  <div className="mt-5 border-t border-slate-100 pt-5">
                    <Detail
                      label="Branch countries"
                      value={data.branches_countries.join(", ")}
                    />
                  </div>
                )}
              </Card>
            )}
          </div>

          <aside className="space-y-6">
            <Card title="Business information" icon={<FiBriefcase />}>
              <div className="space-y-4">
                <Detail label="Reference code" value={data.ref_code} />
                <Detail
                  label="Established"
                  value={data.year_established}
                />
                <Detail label="Member type" value={data.profile_type} />
              </div>
            </Card>

            <Card title="Registered address" icon={<FiMapPin />}>
              {addressLines.length ? (
                <address className="not-italic text-sm leading-7 text-slate-600">
                  {addressLines.map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
                </address>
              ) : (
                <p className="text-sm text-slate-500">
                  Address not available.
                </p>
              )}
              {websiteUrl && (
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-xs font-bold text-[var(--color-accent)] transition hover:border-[var(--color-accent)]"
                >
                  Visit website <FiExternalLink />
                </a>
              )}
            </Card>

            {(data.brc_number ||
              data.brc_issue_date ||
              data.brc_expiry_date) && (
              <Card title="Business registration" icon={<FiCalendar />}>
                <div className="space-y-4">
                  <Detail label="BRC number" value={data.brc_number} />
                  <Detail
                    label="Issue date"
                    value={safeDate(data.brc_issue_date)}
                  />
                  <Detail
                    label="Expiry date"
                    value={safeDate(data.brc_expiry_date)}
                  />
                  {data.brc_document_url && (
                    <a
                      href={data.brc_document_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-xs font-bold text-[var(--color-accent)]"
                    >
                      View BRC document <FiExternalLink />
                    </a>
                  )}
                </div>
              </Card>
            )}

            {data.insurance_provider && (
              <Card title="Insurance" icon={<FiShield />}>
                <div className="space-y-4">
                  <Detail label="Provider" value={data.insurance_provider} />
                  <Detail label="Policy type" value={data.policy_type} />
                  <Detail label="Policy number" value={data.policy_number} />
                  <Detail
                    label="Coverage"
                    value={data.coverage_amount}
                  />
                  <Detail
                    label="Expiry"
                    value={safeDate(data.insurance_expiry_date)}
                  />
                </div>
              </Card>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
