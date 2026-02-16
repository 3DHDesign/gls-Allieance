// src/components/Registration/Step2Contacts.tsx
import { useState } from "react";
import type { RegistrationForm, Contact } from "../../types/registration";
import PhoneInput from "react-phone-input-2";

export default function Step2Contacts({
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

  const update = (i: number, patch: Partial<Contact>) => {
    setForm((prev) => ({
      ...prev,
      contacts: prev.contacts.map((c, idx) => (idx === i ? { ...c, ...patch } : c)),
    }));
  };

  const add = () => {
    setForm((prev) => {
      if (prev.contacts.length >= 4) return prev;
      return { ...prev, contacts: [...prev.contacts, { fullName: "" }] };
    });
  };

  const remove = (i: number) => {
    setForm((prev) => {
      const list = prev.contacts.filter((_, idx) => idx !== i);
      return { ...prev, contacts: list.length ? list : [{ fullName: "" }] };
    });
  };

  // Base phone country from registered country if available
  const phoneBaseCountry = form.company.regCountryCode
    ? String(form.company.regCountryCode).toLowerCase()
    : "lk";

  const goNext = () => {
    // ✅ minimal validation: first contact name required
    const first = form.contacts?.[0];
    if (!first?.fullName?.trim()) {
      setTopError("Please add at least one contact name before continuing.");
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
          Contact Information
        </h2>
        <p className="text-sm text-[var(--color-muted)] mb-4">
          Add up to 4 contacts. At least one contact is required.
        </p>

        {topError && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {topError}
          </div>
        )}

        <div className="grid gap-6">
          {form.contacts.map((c, i) => (
            <div key={i} className="rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Contact {i + 1}</h4>

                {form.contacts.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    className="text-sm text-red-600 hover:underline"
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
                    onChange={(e) => update(i, { fullName: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-3"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Designation</label>
                  <input
                    value={c.designation || ""}
                    onChange={(e) => update(i, { designation: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-3"
                    placeholder="Manager"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Email Address</label>
                  <input
                    type="email"
                    value={c.email || ""}
                    onChange={(e) => update(i, { email: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-3"
                    placeholder="name@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Phone Number</label>
                  <PhoneField
                    value={c.phone || ""}
                    onChange={(val) => update(i, { phone: val })}
                    countryBase={phoneBaseCountry}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm mb-1">Alternate Phone</label>
                  <PhoneField
                    value={c.altPhone || ""}
                    onChange={(val) => update(i, { altPhone: val })}
                    countryBase={phoneBaseCountry}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={add}
            disabled={form.contacts.length >= 4}
            className="rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
          >
            + Add another contact
          </button>

          <div className="flex gap-2">
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
      </div>
    </section>
  );
}

/* Phone field */
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
          boxShadow: "0 10px 30px rgba(0,0,0,.12)",
        }}
      />
    </div>
  );
}
