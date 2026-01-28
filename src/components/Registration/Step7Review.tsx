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
  onJump: (i: number) => void; // jump to edit
}) {
  const Row = ({ label, value }: { label: string; value?: any }) => (
    <div className="flex gap-3 py-1 text-sm">
      <span className="w-48 text-[var(--color-muted)]">{label}</span>
      <span className="flex-1 break-words">{String(value ?? "—")}</span>
    </div>
  );

  return (
    <section className="container mt-6">
      <div className="rounded-2xl bg-white border border-gray-400 shadow p-5 md:p-6">
        <h2 className="text-xl md:text-2xl font-semibold text-[var(--color-accent)] mb-4">
          Review & Submit
        </h2>
        <div className="mb-4 rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Profile Type</h4>
            <button
              onClick={() => onJump(0)}
              className="text-sm text-[var(--color-accent)] hover:underline"
            >
              Edit
            </button>
          </div>
          <div className="mt-2 text-sm">
            {form.profileType === "service_provider"
              ? "Service Provider (Freight Forwarder)"
              : form.profileType === "importer_exporter"
              ? "Importer / Exporter"
              : "—"}
          </div>
        </div>

        <div className="grid gap-6">
          {/* Company */}
          <div className="rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Company Information</h4>
              <button
                onClick={() => onJump(0)}
                className="text-sm text-[var(--color-accent)] hover:underline"
              >
                Edit
              </button>
            </div>
            <Row label="Company Name" value={form.company.companyName} />
            <Row label="Trade Name" value={form.company.tradeName} />
            <Row
              label="Registered Address"
              value={form.company.registeredAddress}
            />
            <Row label="Reg State" value={form.company.regState} />
            <Row label="Reg City" value={form.company.regCity} />
            <Row label="Reg ZIP" value={form.company.regZip} />
            <Row label="Mailing Title" value={form.company.mailing.title} />
            <Row
              label="Mailing Country"
              value={form.company.mailing.countryCode}
            />
            <Row label="Mailing State" value={form.company.mailing.stateCode} />
            <Row label="Mailing City" value={form.company.mailing.city} />
            <Row label="Mailing ZIP" value={form.company.mailing.zip} />
            <Row
              label="Year Established"
              value={form.company.yearEstablished}
            />
            <Row label="Website" value={form.company.website} />
          </div>

          {/* Contacts */}
          <div className="rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Contacts</h4>
              <button
                onClick={() => onJump(1)}
                className="text-sm text-[var(--color-accent)] hover:underline"
              >
                Edit
              </button>
            </div>
            {form.contacts.map((c, i) => (
              <div key={i} className="mt-2">
                <h5 className="text-sm font-medium">Contact {i + 1}</h5>
                <Row label="Full Name" value={c.fullName} />
                <Row label="Designation" value={c.designation} />
                <Row label="Email" value={c.email} />
                <Row label="Phone" value={c.phone} />
                <Row label="Alt Phone" value={c.altPhone} />
              </div>
            ))}
          </div>

          {/* BRC */}
          <div className="rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Business Registration</h4>
              <button
                onClick={() => onJump(2)}
                className="text-sm text-[var(--color-accent)] hover:underline"
              >
                Edit
              </button>
            </div>
            <Row label="BRC Number" value={form.business.brcNumber} />
            <Row label="Issue Date" value={form.business.issueDate} />
            <Row label="Expiry Date" value={form.business.expiryDate} />
            <Row label="BRC Document" value={form.business.brcFile?.name} />
          </div>

          {/* Membership */}
          <div className="rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Membership</h4>
              <button
                onClick={() => onJump(3)}
                className="text-sm text-[var(--color-accent)] hover:underline"
              >
                Edit
              </button>
            </div>
            <Row label="Organization" value={form.membership.organization} />
            <Row
              label="Membership Number"
              value={form.membership.membershipNumber}
            />
            <Row label="Joined Date" value={form.membership.joinedDate} />
            <Row
              label="Certificate"
              value={form.membership.certificate?.name}
            />
          </div>

          {/* Services */}
          <div className="rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Services & Activities</h4>
              <button
                onClick={() => onJump(4)}
                className="text-sm text-[var(--color-accent)] hover:underline"
              >
                Edit
              </button>
            </div>
            <Row
              label="Services"
              value={form.services.servicesProvided.join(", ")}
            />
            <Row
              label="Core Activities"
              value={form.services.coreActivities.join(", ")}
            />
            <Row
              label="Supported Countries"
              value={form.services.supportedCountries.join(", ")}
            />
            <Row label="Tech Stack" value={form.services.techStack} />
          </div>

          {/* Insurance */}
          <div className="rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Insurance</h4>
              <button
                onClick={() => onJump(5)}
                className="text-sm text-[var(--color-accent)] hover:underline"
              >
                Edit
              </button>
            </div>
            <Row label="Provider" value={form.insurance.provider} />
            <Row label="Policy Type" value={form.insurance.policyType} />
            <Row label="Policy Number" value={form.insurance.policyNumber} />
            <Row
              label="Coverage Amount"
              value={form.insurance.coverageAmount}
            />
            <Row label="Expiry Date" value={form.insurance.expiryDate} />
            <Row label="Policy Doc" value={form.insurance.policyDoc?.name} />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onBack}
            className="rounded-lg border border-gray-200 px-4 py-2"
          >
            Back
          </button>
          <button onClick={onSubmit} className="btn-accent">
            Submit Application
          </button>
        </div>
      </div>
    </section>
  );
}
