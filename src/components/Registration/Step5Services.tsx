// src/components/Registration/Step5Services.tsx
import { useMemo, useState } from "react";
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

  // Countries (for branches)
  const countries = useMemo(
    () =>
      Country.getAllCountries()
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name)),
    []
  );

  const [countryQuery, setCountryQuery] = useState("");

  const toggle = (list: string[], value: string) =>
    list.includes(value) ? list.filter((x) => x !== value) : [...list, value];

  const setServices = (patch: Partial<RegistrationForm["services"]>) =>
    setForm({ ...form, services: { ...s, ...patch } });

  const filteredCountries = useMemo(() => {
    const q = countryQuery.trim().toLowerCase();
    if (!q) return countries;
    return countries.filter((c) => c.name.toLowerCase().includes(q));
  }, [countries, countryQuery]);

  const selectedCountryNames = useMemo(() => {
    const map = new Map(countries.map((c) => [c.isoCode, c.name]));
    return (s.supportedCountries || []).map((code) => ({
      code,
      name: map.get(code) || code,
    }));
  }, [countries, s.supportedCountries]);

  const branchesLabel =
    form.profileType === "importer_exporter" ? "Operating Countries" : "Branches";

  const branchesHelp =
    form.profileType === "importer_exporter"
      ? "Select countries where you operate or trade."
      : "Select countries where you have offices/branches or active operations.";

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

          {/* Branches / Operating Countries (Search + checkbox list) */}
          <div>
            <label className="block text-sm mb-2">{branchesLabel}</label>

            {/* Selected chips */}
            {s.supportedCountries.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {selectedCountryNames.map(({ code, name }) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() =>
                      setServices({
                        supportedCountries: s.supportedCountries.filter(
                          (x) => x !== code
                        ),
                      })
                    }
                    className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-3 py-1 text-sm hover:border-[var(--color-accent)]/60"
                    title="Remove"
                  >
                    <span>{name}</span>
                    <span className="text-[var(--color-muted)]/70">✕</span>
                  </button>
                ))}
              </div>
            )}

            {/* Search */}
            <input
              value={countryQuery}
              onChange={(e) => setCountryQuery(e.target.value)}
              placeholder="Search countries (e.g., Sri Lanka, UAE, India)…"
              className="w-full rounded-lg border border-gray-200 px-3 py-3"
            />

            {/* Checkbox list */}
            <div className="mt-3 h-56 overflow-auto rounded-lg border border-gray-200 bg-white p-2">
              {filteredCountries.length === 0 ? (
                <div className="p-3 text-sm text-[var(--color-muted)]">
                  No countries found.
                </div>
              ) : (
                <ul className="space-y-1">
                  {filteredCountries.map((c) => {
                    const active = s.supportedCountries.includes(c.isoCode);
                    return (
                      <li key={c.isoCode}>
                        <label
                          className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-gray-50 ${
                            active ? "bg-[var(--color-accent)]/5" : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={active}
                            onChange={() =>
                              setServices({
                                supportedCountries: toggle(
                                  s.supportedCountries,
                                  c.isoCode
                                ),
                              })
                            }
                          />
                          <span className="flex-1">{c.name}</span>
                          <span className="text-xs text-[var(--color-muted)]/70">
                            {c.isoCode}
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <p className="text-xs text-[var(--color-muted)] mt-2">{branchesHelp}</p>
          </div>

          {/* Service Sectors (free text) */}
          <div>
            <label className="block text-sm mb-1">Service Sectors</label>
            <input
              value={s.serviceSectors || ""}
              onChange={(e) => setServices({ serviceSectors: e.target.value })}
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
