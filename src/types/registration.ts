// src/types/registration.ts

export type ProfileType = "importer_exporter" | "service_provider";

/* ------------ Company ------------ */
export type MailingAddress = {
  title?: string;
  countryCode: string;  // ISO2
  stateCode: string;
  city: string;
  zip?: string;
};

export type CompanyInfo = {
  companyName: string;
  tradeName?: string;
  registeredAddress?: string;
  regState?: string;
  regCity?: string;
  regZip?: string;
  regCountryCode?: string;
  mailing: MailingAddress;
  yearEstablished?: string | number;
  website?: string;
  profileBrief?: string;

  // ✅ ADD THESE (cover photo for importer/exporter only)
  coverPhoto?: File | null;
  coverPhotoPreview?: string;

  // NEW: only one main category
  productCategoryId?: string;
  productSubcategories?: string[];

  financialProtectionRequired?: boolean | null;
  nettingRequired?: boolean | null;
};

/* ------------ Contacts ------------ */
export type Contact = {
  fullName: string;
  designation?: string;
  email?: string;
  phone?: string;
  altPhone?: string;
};

/* ------------ Business Reg + Affiliations ------------ */
export type Affiliation = {
  name: string;
  issueDate?: string;
  expiryDate?: string;
  countryCode?: string;          // ISO2
};

export type BusinessReg = {
  brcNumber: string;
  issueDate?: string;
  expiryDate?: string;
  brcFile?: File | null;
  affiliations?: Affiliation[];  // <-- added
};

/* ------------ Membership / Packages ------------ */
export type Membership = {
  packageTerm?: "1m" | "3m" | "6m" | "12m";
  organization?: string;
  membershipNumber?: string;
  certificate?: File | null;
  joinedDate?: string;
};

/* ------------ Services & Activities ------------ */
export type ServicesActivities = {
  servicesProvided: string[];
  coreActivities: string[];
  supportedCountries: string[];  // labeled “Branches” in UI
  techStack?: string;            // legacy (kept for compatibility)
  serviceSectors?: string;       // new label replacing techStack
};

/* ------------ Insurance ------------ */
export type InsuranceInfo = {
  provider?: string;
  policyType?: string;
  policyNumber?: string;
  coverageAmount?: string;
  expiryDate?: string;
  policyDoc?: File | null;
};

/* ------------ Root form ------------ */
export type RegistrationForm = {
  username: string;              // we use "" as initial value
  profileType?: ProfileType;

  company: CompanyInfo;
  contacts: Contact[];           // kept even if no separate step
  business: BusinessReg;
  membership: Membership;

  services: ServicesActivities;
  insurance: InsuranceInfo;
};

