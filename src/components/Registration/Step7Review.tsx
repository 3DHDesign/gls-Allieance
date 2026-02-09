import type { RegistrationForm } from "../../types/registration";

export default function Step7Review({
  form,
  onBack,
  onSubmit,
  onJump,
}: {
  form: RegistrationForm;
  onBack: () => void;
  onSubmit: () => void;
  onJump: (i: number) => void; // jump to edit step index
}) {
  const Row = ({ label, value }: { label: string; value?: any }) => (
    <div className="flex gap-3 py-1 text-sm">
      <span className="w-48 text-[var(--color-muted)]">{label}</span>
      <span className="flex-1 break-words">{String(value ?? "—")}</span>
    </div>
  );

  const Section = ({
    title,
    step,
    children,
  }: {
    title: string;
    step: number;
    children: React.ReactNode;
  }) => (
    <div className="rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">{title}</h4>
        <button
          onClick={() => onJump(step)}
          className="text-sm text-[var(--color-accent)] hover:underline"
          type="button"
        >
          Edit
        </button>
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );

  const isImporterExporter = form.profileType === "importer_exporter";

  return (
    <section className="container mt-6">
      <div className="rounded-2xl bg-white border border-gray-400 shadow p-5 md:p-6">
        <h2 className="text-xl md:text-2xl font-semibold text-[var(--color-accent)] mb-4">
          Review & Submit
        </h2>

        <div className="grid gap-6">
          {/* Profile Type */}
          <Section title="Profile Type" step={0}>
            <div className="text-sm">
              {form.profileType === "service_provider"
                ? "Service Provider (Freight Forwarder / Logistics Operator)"
                : form.profileType === "importer_exporter"
                ? "Importer / Exporter"
                : "—"}
            </div>
          </Section>

          {/* Company Information */}
          <Section title="Company Information" step={1}>
            <Row label="Company Name" value={form.company.companyName} />
            <Row label="Trade Name" value={form.company.tradeName} />
            <Row label="Registered Address" value={form.company.registeredAddress} />
            <Row label="Reg State" value={form.company.regState} />
            <Row label="Reg City" value={form.company.regCity} />
            <Row label="Reg ZIP" value={form.company.regZip} />
            <Row label="Mailing Title" value={form.company.mailing.title} />
            <Row label="Mailing Country" value={form.company.mailing.countryCode} />
            <Row label="Mailing State" value={form.company.mailing.stateCode} />
            <Row label="Mailing City" value={form.company.mailing.city} />
            <Row label="Mailing ZIP" value={form.company.mailing.zip} />
            <Row label="Year Established" value={form.company.yearEstablished} />
            <Row label="Website" value={form.company.website} />
          </Section>

          {/* Contacts */}
          <Section title="Contact Information" step={2}>
            {form.contacts?.length ? (
              form.contacts.map((c, i) => (
                <div key={i} className={i === 0 ? "" : "mt-4"}>
                  <h5 className="text-sm font-medium">Contact {i + 1}</h5>
                  <Row label="Full Name" value={c.fullName} />
                  <Row label="Designation" value={c.designation} />
                  <Row label="Email" value={c.email} />
                  <Row label="Phone" value={c.phone} />
                  <Row label="Alt Phone" value={c.altPhone} />
                </div>
              ))
            ) : (
              <div className="text-sm text-[var(--color-muted)]">—</div>
            )}
          </Section>

          {/* Business Registration */}
          <Section title="Business Registration" step={3}>
            <Row label="BRC Number" value={form.business.brcNumber} />
            <Row label="Issue Date" value={form.business.issueDate} />
            <Row label="Expiry Date" value={form.business.expiryDate} />
            <Row label="BRC Document" value={form.business.brcFile?.name} />
          </Section>

          {/* Company Profile */}
          <Section title="Company Profile" step={4}>
            <Row label="Profile Brief" value={form.company.profileBrief} />
            {isImporterExporter && (
              <>
                <Row label="Cover Photo" value={form.company.coverPhoto?.name} />
                {form.company.coverPhotoPreview ? (
                  <div className="mt-3 rounded-2xl overflow-hidden border border-gray-200">
                    <img
                      src={form.company.coverPhotoPreview}
                      alt="Cover preview"
                      className="h-[220px] w-full object-cover"
                    />
                  </div>
                ) : null}
              </>
            )}
          </Section>

          {/* Services & Activities */}
          <Section title="Services & Activities" step={5}>
            <Row
              label="Services"
              value={
                form.services.servicesProvided?.length
                  ? form.services.servicesProvided.join(", ")
                  : "—"
              }
            />
            {!!form.services.coreActivities?.length && (
              <Row
                label="Core Activities"
                value={form.services.coreActivities.join(", ")}
              />
            )}
            <Row
              label={form.profileType === "importer_exporter" ? "Operating Countries" : "Branches"}
              value={
                form.services.supportedCountries?.length
                  ? form.services.supportedCountries.join(", ")
                  : "—"
              }
            />
            <Row label="Service Sectors" value={form.services.serviceSectors} />
          </Section>

          {/* Insurance */}
          <Section title="Insurance Information" step={6}>
            <Row label="Provider" value={form.insurance.provider} />
            <Row label="Policy Type" value={form.insurance.policyType} />
            <Row label="Policy Number" value={form.insurance.policyNumber} />
            <Row label="Coverage Amount" value={form.insurance.coverageAmount} />
            <Row label="Expiry Date" value={form.insurance.expiryDate} />
            <Row label="Policy Doc" value={form.insurance.policyDoc?.name} />
          </Section>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onBack}
            className="rounded-lg border border-gray-200 px-4 py-2"
            type="button"
          >
            Back
          </button>
          <button onClick={onSubmit} className="btn-accent" type="button">
            Submit Application
          </button>
        </div>
      </div>
    </section>
  );
}
