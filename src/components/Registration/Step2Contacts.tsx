import type { RegistrationForm, Contact } from "../../types/registration";
import PhoneInput from "react-phone-input-2";

export default function Step2Contacts({
  form, setForm, onNext, onBack,
}: {
  form: RegistrationForm;
  setForm: (f: RegistrationForm) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const update = (i: number, patch: Partial<Contact>) => {
    const list = form.contacts.map((c, idx) => (idx === i ? { ...c, ...patch } : c));
    setForm({ ...form, contacts: list });
  };

  const add = () => {
    if (form.contacts.length >= 4) return;
    setForm({ ...form, contacts: [...form.contacts, { fullName: "" }] });
  };

  const remove = (i: number) => {
    const list = form.contacts.filter((_, idx) => idx !== i);
    setForm({ ...form, contacts: list.length ? list : [{ fullName: "" }] });
  };

  return (
    <section className="container mt-6">
      <div className="rounded-2xl bg-white border border-gray-400 shadow p-5 md:p-6">
        <h2 className="text-xl md:text-2xl font-semibold text-[var(--color-accent)] mb-4">
          Contact Information
        </h2>

        <div className="grid gap-6">
          {form.contacts.map((c, i) => (
            <div key={i} className="rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Contact {i + 1}</h4>
                {form.contacts.length > 1 && (
                  <button
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
                    value={c.fullName}
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
                  <PhoneInput
                    country="lk"
                    value={c.phone || ""}
                    onChange={(val) => update(i, { phone: `+${val}` })}
                    inputProps={{ name: "phone", required: false }}
                    inputStyle={{ width: "100%" }}
                    containerClass="w-full"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm mb-1">Alternate Phone</label>
                  <PhoneInput
                    country="lk"
                    value={c.altPhone || ""}
                    onChange={(val) => update(i, { altPhone: `+${val}` })}
                    inputStyle={{ width: "100%" }}
                    containerClass="w-full"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={add}
            className="rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50"
          >
            + Add another contact
          </button>

          <div className="flex gap-2">
            <button onClick={onBack} className="rounded-lg border border-gray-200 px-4 py-2">Back</button>
            <button onClick={onNext} className="btn-accent">Next</button>
          </div>
        </div>
      </div>
    </section>
  );
}
