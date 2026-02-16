// src/components/Registration/Step1Company.tsx
import { useMemo, useState } from "react";
import { Country } from "country-state-city";
import type { RegistrationForm, Contact } from "../../types/registration";
import PhoneInput from "react-phone-input-2";
import {
  productCategories,
  subcategoriesByCategory,
} from "../../utils/exportCategories";

export default function Step1Company({
  form,
  setForm,
  onNext,
}: {
  form: RegistrationForm;
  setForm: React.Dispatch<React.SetStateAction<RegistrationForm>>;
  onNext: () => void;
}) {
  const countries = useMemo(() => Country.getAllCountries(), []);

  const isImporterExporter = form.profileType === "importer_exporter";

  const selectedCategoryId = form.company.productCategoryId || "";
  const selectedSubcats = form.company.productSubcategories ?? [];

  const [topError, setTopError] = useState<string | null>(null);

  // ✅ functional update = prevents overwrite/stale state bug
  const setCompany = (patch: Partial<RegistrationForm["company"]>) => {
    setForm((prev) => ({
      ...prev,
      company: { ...prev.company, ...patch },
    }));
  };

  /**
   * ✅ Auto-fill mailing IF it's empty (because your type requires company.mailing)
   * If user hasn't filled mailing in a later step, we mirror registered address fields.
   */
  const syncMailingIfEmpty = (patch: Partial<RegistrationForm["company"]>) => {
    setForm((prev) => {
      const nextCompany = { ...prev.company, ...patch };

      const mailing = prev.company.mailing;
      const mailingEmpty =
        !mailing?.countryCode &&
        !mailing?.stateCode &&
        !mailing?.city &&
        !mailing?.zip;

      return {
        ...prev,
        company: {
          ...nextCompany,
          mailing: mailingEmpty
            ? {
                title: mailing?.title || "",
                countryCode: nextCompany.regCountryCode || "",
                stateCode: nextCompany.regState || "",
                city: nextCompany.regCity || "",
                zip: nextCompany.regZip || "",
              }
            : prev.company.mailing,
        },
      };
    });
  };

  // ---------- Contacts helpers (multi) ----------
  const updateContact = (i: number, patch: Partial<Contact>) => {
    setForm((prev) => ({
      ...prev,
      contacts: prev.contacts.map((c, idx) =>
        idx === i ? { ...c, ...patch } : c
      ),
    }));
  };

  const addContact = () => {
    setForm((prev) => {
      if (prev.contacts.length >= 4) return prev;
      return { ...prev, contacts: [...prev.contacts, { fullName: "" }] };
    });
  };

  const removeContact = (i: number) => {
    setForm((prev) => {
      const list = prev.contacts.filter((_, idx) => idx !== i);
      return { ...prev, contacts: list.length ? list : [{ fullName: "" }] };
    });
  };

  // default phone dropdown country = registered country (fallback 'us')
  const phoneBaseCountry = form.company.regCountryCode
    ? String(form.company.regCountryCode).toLowerCase()
    : "us";

  // ---------- Product category + subcategories ----------
  const handleCategoryCardClick = (id: string) => {
    setTopError(null);

    // ✅ SINGLE update call (prevents overwrite bug)
    setForm((prev) => ({
      ...prev,
      company: {
        ...prev.company,
        productCategoryId: id,
        productSubcategories: [], // reset subs when main changes
      },
    }));
  };

  const handleSubcategoryToggle = (sub: string, checked: boolean) => {
    setForm((prev) => {
      const current = prev.company.productSubcategories ?? [];
      const next = checked
        ? Array.from(new Set([...current, sub]))
        : current.filter((s) => s !== sub);

      return {
        ...prev,
        company: { ...prev.company, productSubcategories: next },
      };
    });
  };

  const goNext = () => {
    if (isImporterExporter && !form.company.productCategoryId) {
      setTopError("Please select a main product category before continuing.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setTopError(null);
    onNext();
  };

  return (
    <section className="container mt-6">
      <div className="rounded-2xl bg-white border border-gray-400 shadow p-5 md:p-6">
        <h2 className="text-xl md:text-2xl font-semibold text-[var(--color-accent)] mb-4">
          Company Information
        </h2>

        {topError && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {topError}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {/* Account User Name */}
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">User Name</label>
            <input
              value={form.username || ""}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, username: e.target.value }))
              }
              className="w-full rounded-lg border border-gray-200 px-3 py-3 focus:ring-2 focus:ring-[var(--color-accent)]"
              placeholder="e.g., johnsilva"
            />
            <p className="mt-1 text-xs text-[var(--color-muted)]">
              This will be used to create the member account later.
            </p>
          </div>

          {/* Company Name */}
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Company Name *</label>
            <input
              value={form.company.companyName}
              onChange={(e) => setCompany({ companyName: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-3 focus:ring-2 focus:ring-[var(--color-accent)]"
              placeholder="Registered company name"
            />
          </div>

          {/* Year Established */}
          <div>
            <label className="block text-sm mb-1">Year Established</label>
            <input
              type="number"
              value={form.company.yearEstablished || ""}
              onChange={(e) => setCompany({ yearEstablished: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-3"
              placeholder="e.g., 2008"
            />
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm mb-1">Website</label>
            <input
              type="url"
              value={form.company.website || ""}
              onChange={(e) => setCompany({ website: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-3"
              placeholder="https://example.com"
            />
          </div>

          {/* Registered address */}
          <div className="md:col-span-2 pt-2">
            <h4 className="text-sm font-medium mb-2">Registered Address</h4>
            <textarea
              value={form.company.registeredAddress || ""}
              onChange={(e) =>
                setCompany({ registeredAddress: e.target.value })
              }
              className="w-full rounded-lg border border-gray-200 px-3 py-3"
              placeholder="Street / building / floor"
            />
          </div>

          {/* Country (registered) */}
          <div>
            <label className="block text-sm mb-1">Country</label>
            <select
              value={form.company.regCountryCode || ""}
              onChange={(e) =>
                syncMailingIfEmpty({ regCountryCode: e.target.value })
              }
              className="w-full rounded-lg border border-gray-200 px-3 py-3"
            >
              <option value="" disabled hidden>
                Select country
              </option>
              {countries.map((c) => (
                <option key={c.isoCode} value={c.isoCode}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">State/Province</label>
            <input
              value={form.company.regState || ""}
              onChange={(e) => syncMailingIfEmpty({ regState: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-3"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">City</label>
            <input
              value={form.company.regCity || ""}
              onChange={(e) => syncMailingIfEmpty({ regCity: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-3"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">ZIP Code</label>
            <input
              value={form.company.regZip || ""}
              onChange={(e) => syncMailingIfEmpty({ regZip: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-3"
            />
          </div>
        </div>

        {/* ----- Export product info (only Importer / Exporter) ----- */}
        {isImporterExporter && (
          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5">
            <h3 className="text-lg font-semibold text-[var(--color-accent)] mb-2">
              Export Product Focus
            </h3>
            <p className="text-sm text-[var(--color-muted)] mb-4">
              Select the main export product category and, if available, the
              relevant sub-categories.
            </p>

            <label className="block text-sm mb-2 font-medium">
              Main Product Category *
            </label>

            <div className="grid gap-3 md:grid-cols-2">
              {productCategories.map((cat) => {
                const selected = selectedCategoryId === cat.id;
                const subcats = subcategoriesByCategory[cat.id] || [];

                return (
                  <div
                    key={cat.id}
                    className="rounded-xl border bg-white px-4 py-3 transition border-gray-200"
                  >
                    <button
                      type="button"
                      onClick={() => handleCategoryCardClick(cat.id)}
                      className={`relative w-full text-left rounded-lg px-1 py-1 transition
                        ${
                          selected
                            ? "bg-[var(--color-accent)]/5"
                            : "hover:bg-gray-50"
                        }`}
                    >
                      {selected && (
                        <span className="absolute right-0 top-0 rounded-full bg-[var(--color-accent)] text-white text-[10px] px-2 py-[2px]">
                          Selected
                        </span>
                      )}
                      <div className="text-sm font-medium text-gray-900 pr-12">
                        {cat.label}
                      </div>
                    </button>

                    {selected && (
                      <div className="mt-3">
                        <p className="text-xs font-medium text-[var(--color-muted)] mb-2">
                          Sub Categories
                        </p>

                        {subcats.length > 0 ? (
                          <div className="grid gap-2">
                            {subcats.map((sub) => {
                              const checked = selectedSubcats.includes(sub);
                              return (
                                <label
                                  key={sub}
                                  className="flex items-center gap-2 text-sm cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300"
                                    checked={checked}
                                    onChange={(e) =>
                                      handleSubcategoryToggle(
                                        sub,
                                        e.target.checked
                                      )
                                    }
                                  />
                                  <span>{sub}</span>
                                </label>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-xs text-[var(--color-muted)]">
                            Sub-categories for this category have not been added
                            yet.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ----- Financial Protection & Netting (both profiles) ----- */}
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <YesNoToggle
            label="Financial protection required?"
            value={form.company.financialProtectionRequired ?? null}
            onChange={(v) => setCompany({ financialProtectionRequired: v })}
          />
          <YesNoToggle
            label="Netting required?"
            value={form.company.nettingRequired ?? null}
            onChange={(v) => setCompany({ nettingRequired: v })}
          />
        </div>

        {/* ---------------- Contacts (multi) ---------------- */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-[var(--color-accent)] mb-3">
            Contacts
          </h3>

          <div className="grid gap-6">
            {form.contacts.map((c, i) => (
              <div key={i} className="rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Contact {i + 1}</h4>
                  {form.contacts.length > 1 && (
                    <button
                      onClick={() => removeContact(i)}
                      className="text-sm text-red-600 hover:underline"
                      type="button"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm mb-1">Full Name</label>
                    <input
                      value={c.fullName || ""}
                      onChange={(e) =>
                        updateContact(i, { fullName: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-200 px-3 py-3"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-1">Designation</label>
                    <input
                      value={c.designation || ""}
                      onChange={(e) =>
                        updateContact(i, { designation: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-200 px-3 py-3"
                      placeholder="Manager"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-1">Email Address</label>
                    <input
                      type="email"
                      value={c.email || ""}
                      onChange={(e) =>
                        updateContact(i, { email: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-200 px-3 py-3"
                      placeholder="name@company.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-1">Phone Number</label>
                    <PhoneField
                      value={c.phone || ""}
                      onChange={(val) => updateContact(i, { phone: val })}
                      countryBase={phoneBaseCountry}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm mb-1">Alternate Phone</label>
                    <PhoneField
                      value={c.altPhone || ""}
                      onChange={(val) => updateContact(i, { altPhone: val })}
                      countryBase={phoneBaseCountry}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={addContact}
              className="rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
              disabled={form.contacts.length >= 4}
              type="button"
            >
              + Add another contact
            </button>

            <button onClick={goNext} className="btn-accent" type="button">
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- helper: pretty global phone field ---------- */
function PhoneField({
  value,
  onChange,
  countryBase,
}: {
  value: string;
  onChange: (val: string) => void;
  countryBase: string;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-0 py-0 focus-within:border-[var(--color-accent)]">
      <PhoneInput
        specialLabel=""
        country={countryBase as any}
        enableSearch
        countryCodeEditable
        placeholder="e.g., +971 55 123 4567"
        value={value || ""}
        onChange={(val) => onChange(val.startsWith("+") ? val : `+${val}`)}
        containerClass="w-full"
        inputStyle={{
          width: "100%",
          height: "48px",
          border: "none",
          borderRadius: "0.5rem",
          boxShadow: "none",
          background: "transparent",
          paddingLeft: "56px",
          paddingRight: "12px",
          fontSize: "16px",
        }}
        buttonClass="!bg-transparent !border-none"
        dropdownStyle={{
          borderRadius: "10px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.12)",
        }}
      />
    </div>
  );
}

/* ---------- helper: Yes / No pill buttons ---------- */
function YesNoToggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean | null;
  onChange: (val: boolean) => void;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="text-sm font-medium text-gray-900">{label}</div>
      <div className="mt-3 inline-flex rounded-full bg-gray-100 p-1">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`px-4 py-1 text-sm rounded-full ${
            value === true
              ? "bg-[var(--color-accent)] text-white shadow-sm"
              : "text-[var(--color-muted)]"
          }`}
        >
          Yes
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`px-4 py-1 text-sm rounded-full ${
            value === false
              ? "bg-[var(--color-accent)] text-white shadow-sm"
              : "text-[var(--color-muted)]"
          }`}
        >
          No
        </button>
      </div>
    </div>
  );
}
