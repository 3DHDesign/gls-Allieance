// src/components/Registration/Step6Insurance.tsx
import { useState } from "react";
import type { RegistrationForm } from "../../types/registration";

export default function Step6Insurance({
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
  const [topError, setTopError] = useState<string | null>(null);

  const ins = form.insurance;

  const setInsurance = (patch: Partial<RegistrationForm["insurance"]>) => {
    setTopError(null);
    setForm((prev) => ({
      ...prev,
      insurance: { ...prev.insurance, ...patch },
    }));
  };

  const goNext = () => {
    // ✅ Insurance is optional. If you want to require doc when provider is given, uncomment below.

    // const hasAny =
    //   !!ins.provider?.trim() ||
    //   !!ins.policyType?.trim() ||
    //   !!ins.policyNumber?.trim() ||
    //   !!ins.coverageAmount?.trim() ||
    //   !!ins.expiryDate?.trim() ||
    //   !!ins.policyDoc;
    //
    // if (hasAny && !ins.policyDoc) {
    //   setTopError("Please upload the insurance policy document (or clear the insurance fields).");
    //   window.scrollTo({ top: 0, behavior: "smooth" });
    //   return;
    // }

    setTopError(null);
    onNext();
  };

  return (
    <section className="container mt-6">
      <div className="rounded-2xl bg-white border border-gray-400 shadow p-5 md:p-6">
        <h2 className="text-xl md:text-2xl font-semibold text-[var(--color-accent)] mb-2">
          Insurance Information
        </h2>
        <p className="text-sm text-[var(--color-muted)] mb-4">
          Optional. Add insurance details if available.
        </p>

        {topError && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {topError}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm mb-1">Insurance Provider</label>
            <input
              value={ins.provider || ""}
              onChange={(e) => setInsurance({ provider: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-3"
              placeholder="e.g., Allianz, AIA, Ceylinco"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Policy Type</label>
            <input
              value={ins.policyType || ""}
              onChange={(e) => setInsurance({ policyType: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-3"
              placeholder="e.g., Liability, Marine, Cargo"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Policy Number</label>
            <input
              value={ins.policyNumber || ""}
              onChange={(e) => setInsurance({ policyNumber: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-3"
              placeholder="e.g., POL-12345"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Coverage Amount</label>
            <input
              value={ins.coverageAmount || ""}
              onChange={(e) => setInsurance({ coverageAmount: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-3"
              placeholder="e.g., USD 500,000"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Expiry Date</label>
            <input
              type="date"
              value={ins.expiryDate || ""}
              onChange={(e) => setInsurance({ expiryDate: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-3"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Insurance Policy Document</label>
            <input
              type="file"
              onChange={(e) => setInsurance({ policyDoc: e.target.files?.[0] || null })}
              className="w-full rounded-lg border border-gray-200 px-3 py-3"
            />
            {ins.policyDoc && (
              <p className="text-sm mt-1 text-[var(--color-muted)]">
                Selected: {ins.policyDoc.name}
              </p>
            )}
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
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
