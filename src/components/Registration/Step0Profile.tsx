import { FiPackage, FiTruck } from "react-icons/fi";
import type { RegistrationForm, ProfileType } from "../../types/registration";

const OPTIONS: { key: ProfileType; title: string; Icon: any }[] = [
  {
    key: "importer_exporter",
    title: "Importer / Exporter",
    Icon: FiPackage,
  },
  {
    key: "service_provider",
    title: "Freight Forwarder / Cargo & Logistics Operator / Shipping / Airline",
    Icon: FiTruck,
  },
];

export default function Step0Profile({
  form,
  setForm,
  onNext,
}: {
  form: RegistrationForm;
  setForm: (f: RegistrationForm) => void;
  onNext: () => void;
}) {
  const choose = (key: ProfileType) => {
    setForm({ ...form, profileType: key });
  };

  return (
    <section className="container mt-6">
      <div className="rounded-2xl bg-white border border-gray-400 shadow p-5 md:p-6">
        <h2 className="text-xl md:text-2xl font-semibold text-[var(--color-accent)]">
          Select Your Profile
        </h2>
        <p className="text-sm text-[var(--color-muted)] mt-1">
          Pick the type that best describes your organization.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {OPTIONS.map(({ key, title, Icon }) => {
            const active = form.profileType === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => choose(key)}
                className={`text-left rounded-2xl border p-5 transition hover:shadow
                  ${active ? "border-[var(--color-accent)] shadow-lg" : "border-gray-200"}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`grid place-items-center h-10 w-10 rounded-full
                    ${active ? "bg-[var(--color-accent)] text-white" : "bg-gray-100 text-[var(--color-muted)]"}`}
                  >
                    <Icon className="text-lg" />
                  </span>

                  <div className="font-medium text-[15px] md:text-base">
                    {title}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={onNext} className="btn-accent">
            Continue
          </button>
        </div>
      </div>
    </section>
  );
}
