import { useMemo, useState } from "react";
import Stepper from "../components/Registration/Stepper";
import Step0Profile from "../components/Registration/Step0Profile";
import Step1Company from "../components/Registration/Step1Company";
import Step3BRC from "../components/Registration/Step3BRC";
import Step4CompanyProfile from "../components/Registration/Step4CompanyProfile";
import Step5Services from "../components/Registration/Step5Services";
import Step6Insurance from "../components/Registration/Step6Insurance";
import Step7Review from "../components/Registration/Step7Review";
import type { RegistrationForm } from "../types/registration";
import { submitMemberRegistration } from "../api/member-registration";

const STEPS = [
  "Profile Type",
  "Company Information",
  "Business Registration",
  "Company Profile",
  "Services & Activities",
  "Insurance Information",
  "Submit",
];

// ✅ Helper: make backend-friendly URL if user types "abc.com"
function normalizeWebsiteUrl(input?: string) {
  const v = (input || "").trim();
  if (!v) return "";
  if (/^https?:\/\//i.test(v)) return v;
  return `https://${v}`;
}

// ✅ Helper: build a readable error message
function extractApiErrorMessage(err: unknown): string {
  const anyErr = err as any;

  // Axios error shape
  const status = anyErr?.response?.status;
  const data = anyErr?.response?.data;

  // Laravel often: { message, errors: {field:[...]} }
  if (status === 422 && data?.errors) {
    const lines: string[] = [];
    for (const [field, msgs] of Object.entries<any>(data.errors)) {
      const text = Array.isArray(msgs) ? msgs.join(", ") : String(msgs);
      lines.push(`${field}: ${text}`);
    }
    return lines.length ? lines.join("\n") : "Validation failed.";
  }

  if (data?.message) return String(data.message);
  if (anyErr?.message) return String(anyErr.message);

  return "Something went wrong. Please try again.";
}

export default function MemberRegistration() {
  const [step, setStep] = useState(0);

  const [form, setForm] = useState<RegistrationForm>({
    username: "",
    profileType: undefined,
    company: {
      companyName: "",
      regCountryCode: "",
      mailing: { title: "", countryCode: "", stateCode: "", city: "", zip: "" },
      profileBrief: "",
    },
    contacts: [{ fullName: "" }],
    business: { brcNumber: "", affiliations: [] },

    // keep this to satisfy the type
    membership: {},

    services: { servicesProvided: [], coreActivities: [], supportedCountries: [] },
    insurance: {},
  });

  // ✅ Submission UI states
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitOk, setSubmitOk] = useState<string | null>(null);

  const canSubmit = useMemo(() => step === 6, [step]);

  const onSubmit = async () => {
    try {
      setSubmitError(null);
      setSubmitOk(null);

      // ✅ normalize website to avoid: "website field must be a valid URL"
      setForm((prev) => ({
        ...prev,
        company: {
          ...prev.company,
          website: normalizeWebsiteUrl(prev.company.website),
        },
      }));

      setSubmitting(true);

      // ⚠️ use the latest value after normalization:
      const payload: RegistrationForm = {
        ...form,
        company: { ...form.company, website: normalizeWebsiteUrl(form.company.website) },
      };

      const res = await submitMemberRegistration(payload);

      // backend response you showed: { success, message, data }
      setSubmitOk(res?.message || "Registration submitted successfully.");
      console.log("SUBMIT OK", res);

      // Optional: jump nowhere, or lock the form, or redirect
      // setStep(6);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      const msg = extractApiErrorMessage(err);
      setSubmitError(msg);
      console.error("SUBMIT FAIL", err);

      // keep user on review step and show the message
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="py-10">
      <section className="container pt-10 md:pt-14">
        <h1 className="text-[28px] md:text-[42px] leading-tight font-bold text-[var(--color-accent)]">
          Member Registration
        </h1>
        <p className="mt-2 max-w-2xl text-muted">
          Choose your profile and complete each section. You can click any step to jump.
        </p>

        {/* ✅ Show submit errors/success here */}
        {submitError && (
          <div className="mt-4 whitespace-pre-line rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {submitError}
          </div>
        )}
        {submitOk && (
          <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            {submitOk}
          </div>
        )}
      </section>

      <Stepper steps={STEPS} current={step} onJump={setStep} />

      {step === 0 && (
        <Step0Profile form={form} setForm={setForm} onNext={() => setStep(1)} />
      )}

      {step === 1 && (
        <Step1Company
          form={form}
          setForm={setForm}
          onNext={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <Step3BRC
          form={form}
          setForm={setForm}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      )}

      {step === 3 && (
        <Step4CompanyProfile
          form={form}
          setForm={setForm}
          onNext={() => setStep(4)}
          onBack={() => setStep(2)}
        />
      )}

      {step === 4 && (
        <Step5Services
          form={form}
          setForm={setForm}
          onNext={() => setStep(5)}
          onBack={() => setStep(3)}
        />
      )}

      {step === 5 && (
        <Step6Insurance
          form={form}
          setForm={setForm}
          onNext={() => setStep(6)}
          onBack={() => setStep(4)}
        />
      )}

      {step === 6 && (
        <Step7Review
          form={form}
          onBack={() => setStep(5)}
          onSubmit={onSubmit}
          onJump={(i) => {
            setSubmitError(null);
            setSubmitOk(null);
            setStep(i);
          }}
        />
      )}

      {/* Optional: a sticky submit state */}
      {canSubmit && submitting && (
        <div className="container mt-4 text-sm text-[var(--color-muted)]">
          Submitting... please wait
        </div>
      )}
    </main>
  );
}
