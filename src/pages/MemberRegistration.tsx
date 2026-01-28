import { useState } from "react";
import Stepper from "../components/Registration/Stepper";
import Step0Profile from "../components/Registration/Step0Profile";
import Step1Company from "../components/Registration/Step1Company";
import Step3BRC from "../components/Registration/Step3BRC";
import Step4CompanyProfile from "../components/Registration/Step4CompanyProfile";
import Step5Services from "../components/Registration/Step5Services";
import Step6Insurance from "../components/Registration/Step6Insurance";
import Step7Review from "../components/Registration/Step7Review";
import type { RegistrationForm } from "../types/registration";

const STEPS = [
  "Profile Type",
  "Company Information",
  "Business Registration",
  "Company Profile",
  "Services & Activities",
  "Insurance Information",
  "Submit",
];

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
  

  const onSubmit = () => {
    console.log("SUBMIT", form);
    alert("Captured in console. Ready to send to your backend when finalized.");
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
      </section>

      <Stepper steps={STEPS} current={step} onJump={setStep} />

      {step === 0 && <Step0Profile form={form} setForm={setForm} onNext={() => setStep(1)} />}
      {step === 1 && <Step1Company form={form} setForm={setForm} onNext={() => setStep(2)} />}
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
          onJump={setStep}
        />
      )}
    </main>
  );
}
