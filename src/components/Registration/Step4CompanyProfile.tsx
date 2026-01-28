import type { RegistrationForm } from "../../types/registration";
import { useMemo, useState } from "react";

export default function Step4CompanyProfile({
  form, setForm, onNext, onBack,
}: {
  form: RegistrationForm;
  setForm: (f: RegistrationForm) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const value = form.company.profileBrief || "";
  const [error, setError] = useState<string | null>(null);

  const countWords = (text: string) =>
    text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

  const words = useMemo(() => countWords(value), [value]);

  const onChange = (text: string) => {
    const w = countWords(text);
    if (w <= 500) {
      setError(null);
      setForm({ ...form, company: { ...form.company, profileBrief: text } });
    } else {
      // trim to 500 words
      const trimmed = text.trim().split(/\s+/).slice(0, 500).join(" ");
      setForm({ ...form, company: { ...form.company, profileBrief: trimmed } });
      setError("Limited to 500 words. Extra text was trimmed.");
    }
  };

  const canNext = words > 0 && words <= 500;

  return (
    <section className="container mt-6">
      <div className="rounded-2xl bg-white border border-gray-400 shadow p-5 md:p-6">
        <h2 className="text-xl md:text-2xl font-semibold text-[var(--color-accent)] mb-4">
          Company Profile
        </h2>

        <p className="text-sm text-[var(--color-muted)] mb-3">
          Add a short public overview of your company (max 500 words).
        </p>

        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={8}
          className="w-full rounded-lg border border-gray-200 px-3 py-3"
            />

        <div className="mt-2 flex items-center justify-between text-xs">
          <span className={error ? "text-red-600" : "text-[var(--color-muted)]"}>
            {error ? error : "Keep it concise and factual. This will be visible in the directory profile."}
          </span>
          <span className={words > 500 ? "text-red-600" : "text-[var(--color-muted)]"}>
            {words}/500 words
          </span>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onBack} className="rounded-lg border border-gray-200 px-4 py-2">
            Back
          </button>
          <button
            onClick={onNext}
            disabled={!canNext}
            className="btn-accent disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
