import type { RegistrationForm } from "../../types/registration";

export default function Step6Insurance({
  form, setForm, onNext, onBack,
}: {
  form: RegistrationForm;
  setForm: (f: RegistrationForm) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const ins = form.insurance;
  const set = (k: keyof typeof ins, v: any) =>
    setForm({ ...form, insurance: { ...ins, [k]: v } });

  return (
    <section className="container mt-6">
      <div className="rounded-2xl bg-white border border-gray-400 shadow p-5 md:p-6">
        <h2 className="text-xl md:text-2xl font-semibold text-[var(--color-accent)] mb-4">
          Insurance Information
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm mb-1">Insurance Provider</label>
            <input value={ins.provider || ""} onChange={(e) => set("provider", e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-3" />
          </div>
          <div>
            <label className="block text-sm mb-1">Policy Type</label>
            <input value={ins.policyType || ""} onChange={(e) => set("policyType", e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-3" />
          </div>
          <div>
            <label className="block text-sm mb-1">Policy Number</label>
            <input value={ins.policyNumber || ""} onChange={(e) => set("policyNumber", e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-3" />
          </div>
          <div>
            <label className="block text-sm mb-1">Coverage Amount</label>
            <input value={ins.coverageAmount || ""} onChange={(e) => set("coverageAmount", e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-3" placeholder="e.g., USD 500,000" />
          </div>
          <div>
            <label className="block text-sm mb-1">Expiry Date</label>
            <input type="date" value={ins.expiryDate || ""} onChange={(e) => set("expiryDate", e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-3" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Insurance Policy Document</label>
            <input type="file" onChange={(e) => set("policyDoc", e.target.files?.[0] || null)}
              className="w-full rounded-lg border border-gray-200 px-3 py-3" />
            {ins.policyDoc && <p className="text-sm mt-1 text-[var(--color-muted)]">Selected: {ins.policyDoc.name}</p>}
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onBack} className="rounded-lg border border-gray-200 px-4 py-2">Back</button>
          <button onClick={onNext} className="btn-accent">Next</button>
        </div>
      </div>
    </section>
  );
}
