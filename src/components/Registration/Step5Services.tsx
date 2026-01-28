// src/components/Registration/Step5Services.tsx
import { useMemo } from "react";
import { Country } from "country-state-city";
import type { RegistrationForm } from "../../types/registration";

// Services list
const SERVICE_OPTIONS = [
  "Sea Freight",
  "Air Freight Forwarding",
  "Non -Vessel Operating Common Carrier (NVOCC)",
  "Agency Handling",
  "Break Bulk",
  "Bulk Cargo",
  "Consolidation",
  "Groupage Consolidation",
  "Project Logistics",
  "In-Land Transportation",
  "Cross Border Transport",
  "Custom Brokerage",
  "Door-to-Door",
  "Cross Trade",
  "Dangerous Goods",
  "E-commerce",
  "Container Trading",
  "Warehousing",
  "Packing, Removal",
  "Exhibition Services",
  "Event Management",
  "Import",
  "Export",
  "Trading",
];

export default function Step5Services({
  form,
  setForm,
  onNext,
  onBack,
}: {
  form: RegistrationForm;
  setForm: (f: RegistrationForm) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const s = form.services;

  // Countries (multi-select)
  const countries = useMemo(
    () =>
      Country.getAllCountries()
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name)),
    []
  );

  const toggle = (list: string[], value: string) =>
    list.includes(value) ? list.filter((x) => x !== value) : [...list, value];

  const setServices = (patch: Partial<RegistrationForm["services"]>) =>
    setForm({ ...form, services: { ...s, ...patch } });

  return (
    <section className="container mt-6">
      <div className="rounded-2xl bg-white border border-gray-400 shadow p-5 md:p-6">
        <h2 className="text-xl md:text-2xl font-semibold text-[var(--color-accent)] mb-4">
          Services & Activities
        </h2>

        <div className="grid gap-6">
          {/* Services Provided */}
          <div>
            <h4 className="text-sm font-medium mb-2">Services Provided</h4>
            <div className="flex flex-wrap gap-2">
              {SERVICE_OPTIONS.map((opt) => {
                const active = s.servicesProvided.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() =>
                      setServices({
                        servicesProvided: toggle(s.servicesProvided, opt),
                      })
                    }
                    className={`rounded-full border px-3 py-1 text-sm transition
                      ${
                        active
                          ? "border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-accent)]/5"
                          : "border-gray-300 hover:border-[var(--color-accent)]/60"
                      }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Branches (multi-country) */}
          <div>
            <label className="block text-sm mb-2">Branches</label>
            <select
              multiple
              value={s.supportedCountries}
              onChange={(e) => {
                const vals = Array.from(e.target.selectedOptions).map(
                  (o) => o.value
                );
                setServices({ supportedCountries: vals });
              }}
              className="w-full rounded-lg border border-gray-200 px-3 py-3 h-48"
            >
              {countries.map((c) => (
                <option key={c.isoCode} value={c.isoCode}>
                  {c.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-[var(--color-muted)] mt-1">
              Hold Ctrl/Cmd to select multiple.
            </p>
          </div>

          {/* Service Sectors (free text) */}
          <div>
            <label className="block text-sm mb-1">Service Sectors</label>
            <input
              value={(s as any).serviceSectors || ""}
              onChange={(e) =>
                setServices({
                  ...(s as any),
                  serviceSectors: e.target.value,
                })
              }
              className="w-full rounded-lg border border-gray-200 px-3 py-3"
              placeholder="e.g., Automotive, FMCG, Pharma, Textile, Oil & Gas…"
            />
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onBack}
            className="rounded-lg border border-gray-200 px-4 py-2"
          >
            Back
          </button>
          <button onClick={onNext} className="btn-accent">
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
