// src/components/Registration/Step3BRC.tsx
import { useEffect, useMemo, useState } from "react";
import { Country } from "country-state-city";
import type { RegistrationForm, Affiliation } from "../../types/registration";

export default function Step3BRC({
  form,
  setForm,
  onNext,
  onBack,
}: {
  form: RegistrationForm;
  setForm: React.Dispatch<React.SetStateAction<RegistrationForm>>;
  onNext: () => void;
  onBack: () => void;
}) {
  const countries = useMemo(() => Country.getAllCountries(), []);
  const [topError, setTopError] = useState<string | null>(null);

  const affiliations: Affiliation[] = Array.isArray(form.business.affiliations)
    ? form.business.affiliations
    : [];

  const setBusiness = (patch: Partial<RegistrationForm["business"]>) => {
    setForm((prev) => ({
      ...prev,
      business: { ...prev.business, ...patch },
    }));
  };

  const setAffiliations = (list: Affiliation[]) => {
    setForm((prev) => ({
      ...prev,
      business: { ...prev.business, affiliations: list },
    }));
  };

  const addAffiliation = () => {
    setTopError(null);

    setAffiliations([
      ...affiliations,
      {
        name: "",
        countryCode: form.company.regCountryCode || "",
      },
    ]);
  };

  const removeAffiliation = (i: number) => {
    const list = affiliations.filter((_, idx) => idx !== i);
    // keep at least one row visible
    setAffiliations(list.length ? list : [{ name: "", countryCode: form.company.regCountryCode || "" }]);
  };

  const updateAffiliation = (i: number, patch: Partial<Affiliation>) => {
    const list = affiliations.map((a, idx) => (idx === i ? { ...a, ...patch } : a));
    setAffiliations(list);
  };

  // ✅ Seed one empty row on first visit (only if empty)
  useEffect(() => {
    if (affiliations.length === 0) {
      setAffiliations([{ name: "", countryCode: form.company.regCountryCode || "" }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once only

  const goNext = () => {
    if (!form.business.brcNumber?.trim()) {
      setTopError("Please enter the BRC Number before continuing.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setTopError(null);
    onNext();
  };

  return (
    <section className="container mt-6">
      <div className="rounded-2xl bg-white border border-gray-400 shadow p-5 md:p-6">
        <h2 className="text-xl md:text-2xl font-semibold text-[var(--color-accent)] mb-2">
          Business Registration Certificate
        </h2>
        <p className="text-sm text-[var(--color-muted)] mb-4">
          Add your BRC details and any affiliations (if applicable).
        </p>

        {topError && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {topError}
          </div>
        )}

        {/* BRC fields */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">BRC Number *</label>
            <input
              value={form.business.brcNumber || ""}
              onChange={(e) => setBusiness({ brcNumber: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-3"
              placeholder="e.g., PV12345"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Issue Date</label>
            <input
              type="date"
              value={form.business.issueDate || ""}
              onChange={(e) => setBusiness({ issueDate: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-3"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Expiry Date</label>
            <input
              type="date"
              value={form.business.expiryDate || ""}
              onChange={(e) => setBusiness({ expiryDate: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-3"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm mb-1">BRC Document</label>
            <input
              type="file"
              onChange={(e) => setBusiness({ brcFile: e.target.files?.[0] || null })}
              className="w-full rounded-lg border border-gray-200 px-3 py-3"
            />
            {form.business.brcFile && (
              <p className="text-sm mt-1 text-[var(--color-muted)]">
                Selected: {form.business.brcFile.name}
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

                  {affiliations.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAffiliation(i)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="block text-sm mb-1">Name</label>
                    <input
                      value={a.name || ""}
                      onChange={(e) => updateAffiliation(i, { name: e.target.value })}
                      className="w-full rounded-lg border border-gray-200 px-3 py-3"
                      placeholder="e.g., WCAworld, FIATA, JCtrans"
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
                      <option value="" hidden>
                        Select country
                      </option>
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
              type="button"
              onClick={addAffiliation}
              className="rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50"
            >
              + Add another affiliation
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onBack}
            className="rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50"
          >
            Back
          </button>
          <button type="button" onClick={goNext} className="btn-accent">
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
