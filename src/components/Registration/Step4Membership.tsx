import type { RegistrationForm } from "../../types/registration";

export default function Step4Membership({
  form, setForm, onNext, onBack,
}: {
  form: RegistrationForm;
  setForm: (f: RegistrationForm) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const m = form.membership;
  const set = (k: keyof typeof m, v: any) =>
    setForm({ ...form, membership: { ...m, [k]: v } });

  return (
    <section className="container mt-6">
      <div className="rounded-2xl bg-white border border-gray-400 shadow p-5 md:p-6">
        <h2 className="text-xl md:text-2xl font-semibold text-[var(--color-accent)] mb-4">
          Membership Details
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm mb-1">Organization *</label>
            <input
              value={m.organization || ""}
              onChange={(e) => set("organization", e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-3"
              placeholder="e.g., WCA, FIATA"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Membership Number</label>
            <input
              value={m.membershipNumber || ""}
              onChange={(e) => set("membershipNumber", e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-3"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Joined Date</label>
            <input
              type="date"
              value={m.joinedDate || ""}
              onChange={(e) => set("joinedDate", e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-3"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Membership Certificate</label>
            <input
              type="file"
              onChange={(e) => set("certificate", e.target.files?.[0] || null)}
              className="w-full rounded-lg border border-gray-200 px-3 py-3"
            />
            {m.certificate && <p className="text-sm mt-1 text-[var(--color-muted)]">Selected: {m.certificate.name}</p>}
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
