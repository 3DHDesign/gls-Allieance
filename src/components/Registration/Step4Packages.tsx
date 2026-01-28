import type { RegistrationForm } from "../../types/registration";

type Term = "1m" | "3m" | "6m" | "12m";

const OPTIONS: { key: Term; label: string; sub: string }[] = [
  { key: "1m",  label: "1 Month",  sub: "Good for trials" },
  { key: "3m",  label: "3 Months", sub: "Quarterly" },
  { key: "6m",  label: "6 Months", sub: "Half-year" },
  { key: "12m", label: "1 Year",   sub: "Best value" },
];

export default function Step4Packages({
  form, setForm, onNext, onBack,
}: {
  form: RegistrationForm;
  setForm: (f: RegistrationForm) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  // store selection under membership.packageTerm to avoid wider type churn
  const term = (form.membership as any)?.packageTerm as Term | undefined;

  const choose = (t: Term) =>
    setForm({
      ...form,
      membership: { ...(form.membership || {}), packageTerm: t },
    });

  return (
    <section className="container mt-6">
      <div className="rounded-2xl bg-white border border-gray-400 shadow p-5 md:p-6">
        <h2 className="text-xl md:text-2xl font-semibold text-[var(--color-accent)] mb-4">
          Packages
        </h2>

        <div className="grid gap-4 md:grid-cols-4">
          {OPTIONS.map((o) => (
            <button
              type="button"
              key={o.key}
              onClick={() => choose(o.key)}
              className={`rounded-2xl border p-4 text-left transition
                ${term === o.key
                  ? "border-[var(--color-accent)] ring-2 ring-[var(--color-accent)]"
                  : "border-gray-200 hover:border-[var(--color-accent)]/60"}`}
            >
              <div className="text-lg font-semibold">{o.label}</div>
              <div className="text-sm text-[var(--color-muted)]">{o.sub}</div>
              <div className="mt-3">
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs
                    ${term === o.key ? "bg-[var(--color-accent)] text-white" : "bg-gray-100"}`}
                >
                  {term === o.key ? "Selected" : "Select"}
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onBack} className="rounded-lg border border-gray-200 px-4 py-2">
            Back
          </button>
          <button
            onClick={onNext}
            disabled={!term}
            className="btn-accent disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
