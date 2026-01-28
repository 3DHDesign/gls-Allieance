import { useEffect, useMemo } from "react";
import { Country } from "country-state-city";
import type { RegistrationForm } from "../../types/registration";

type Affiliation = {
  name: string;
  issueDate?: string;
  expiryDate?: string;
  countryCode?: string; // ISO2
};

export default function Step3BRC({
  form, setForm, onNext, onBack,
}: {
  form: RegistrationForm;
  setForm: (f: RegistrationForm) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const b = form.business as (RegistrationForm["business"] & { affiliations?: Affiliation[] });
  const countries = useMemo(() => Country.getAllCountries(), []);
  const setField = (k: keyof typeof b, v: any) =>
    setForm({ ...form, business: { ...b, [k]: v } });

  // ---- Affiliations helpers ----
  const affiliations: Affiliation[] = Array.isArray(b.affiliations) ? b.affiliations : [];
  const setAffiliations = (list: Affiliation[]) =>
    setForm({ ...form, business: { ...b, affiliations: list } });

  const addAffiliation = () => {
    setAffiliations([
      ...(affiliations || []),
      { name: "", countryCode: (form.company as any).regCountryCode || "" },
    ]);
  };

  const removeAffiliation = (i: number) => {
    const list = (affiliations || []).filter((_, idx) => idx !== i);
    setAffiliations(list);
  };

  const updateAffiliation = (i: number, patch: Partial<Affiliation>) => {
    const list = (affiliations || []).map((a, idx) => (idx === i ? { ...a, ...patch } : a));
    setAffiliations(list);
  };

  // 👉 Seed one empty row on first visit so the form is visible immediately
  useEffect(() => {
    if (!affiliations || affiliations.length === 0) {
      setAffiliations([{ name: "", countryCode: (form.company as any).regCountryCode || "" }]);
    }
    // re-run only if length changes (avoids loops)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [affiliations?.length]);

  return (
    <section className="container mt-6">
      <div className="rounded-2xl bg-white border border-gray-400 shadow p-5 md:p-6">
        <h2 className="text-xl md:text-2xl font-semibold text-[var(--color-accent)] mb-4">
          Business Registration Certificate
        </h2>

        {/* BRC fields */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">BRC Number *</label>
            <input
              value={b.brcNumber || ""}
              onChange={(e) => setField("brcNumber", e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-3"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Issue Date</label>
            <input
              type="date"
              value={b.issueDate || ""}
              onChange={(e) => setField("issueDate", e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-3"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Expiry Date</label>
            <input
              type="date"
              value={b.expiryDate || ""}
              onChange={(e) => setField("expiryDate", e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-3"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">BRC Document</label>
            <input
              type="file"
              onChange={(e) => setField("brcFile", e.target.files?.[0] || null)}
              className="w-full rounded-lg border border-gray-200 px-3 py-3"
            />
            {b.brcFile && (
              <p className="text-sm mt-1 text-[var(--color-muted)]">
                Selected: {(b.brcFile as File).name}
              </p>
            )}
          </div>
        </div>

        {/* Affiliations */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-[var(--color-accent)] mb-3">
            Affiliations
          </h3>

          <div className="grid gap-6">
            {affiliations.map((a, i) => (
              <div key={i} className="rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Affiliation {i + 1}</h4>
                  <button
                    onClick={() => removeAffiliation(i)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="block text-sm mb-1">Name *</label>
                    <input
                      value={a.name || ""}
                      onChange={(e) => updateAffiliation(i, { name: e.target.value })}
                      className="w-full rounded-lg border border-gray-200 px-3 py-3"
                      placeholder="e.g., WCAworld, FIATA, PPL, JCtrans"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-1">Issue Date</label>
                    <input
                      type="date"
                      value={a.issueDate || ""}
                      onChange={(e) => updateAffiliation(i, { issueDate: e.target.value })}
                      className="w-full rounded-lg border border-gray-200 px-3 py-3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-1">Expiry Date</label>
                    <input
                      type="date"
                      value={a.expiryDate || ""}
                      onChange={(e) => updateAffiliation(i, { expiryDate: e.target.value })}
                      className="w-full rounded-lg border border-gray-200 px-3 py-3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-1">Country</label>
                    <select
                      value={a.countryCode || ""}
                      onChange={(e) => updateAffiliation(i, { countryCode: e.target.value })}
                      className="w-full rounded-lg border border-gray-200 px-3 py-3"
                    >
                      <option value="" hidden>Select country</option>
                      {countries.map((c) => (
                        <option key={c.isoCode} value={c.isoCode}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <button
              onClick={addAffiliation}
              className="rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50"
            >
              + Add another affiliation
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onBack} className="rounded-lg border border-gray-200 px-4 py-2">
            Back
          </button>
          <button onClick={onNext} className="btn-accent">Next</button>
        </div>
      </div>
    </section>
  );
}
