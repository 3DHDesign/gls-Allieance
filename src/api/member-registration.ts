// src/api/member-registration.ts
import http from "./http";
import type { RegistrationForm } from "../types/registration";
import { Country } from "country-state-city";

/**
 * Convert ISO2 -> Country name (Postman shows "Sri Lanka" etc.)
 * If not found, fallback to whatever was given.
 */
function iso2ToCountryName(iso2?: string) {
  if (!iso2) return "";
  const found = Country.getAllCountries().find(
    (c) => c.isoCode.toLowerCase() === iso2.toLowerCase()
  );
  return found?.name || iso2;
}

function boolTo10(v?: boolean | null) {
  if (v === true) return "1";
  if (v === false) return "0";
  return "";
}

export function buildMemberRegistrationFormData(form: RegistrationForm) {
  const fd = new FormData();

  // ---------------------------
  // STEP 0/1 : Profile + Username
  // ---------------------------
  fd.append("profile_type", form.profileType || "");
  fd.append("user_name", form.username || "");

  // ---------------------------
  // STEP 2 : Company Info (your Step1Company = 2nd step)
  // ---------------------------
  fd.append("company_name", form.company.companyName || "");
  fd.append("year_established", String(form.company.yearEstablished ?? ""));
  fd.append("website", form.company.website || "");
  fd.append("registered_address", form.company.registeredAddress || "");

  // Postman expects country/state/city/zip as readable strings
  fd.append("country", iso2ToCountryName(form.company.regCountryCode));
  fd.append("state_province", form.company.regState || "");
  fd.append("city", form.company.regCity || "");
  fd.append("zip_code", form.company.regZip || "");

  // Export categories (Postman: export_main_category_ids[] multiple)
  // Your UI stores ONE: productCategoryId -> send as array with one item
  if (form.company.productCategoryId) {
    fd.append("export_main_category_ids[]", String(form.company.productCategoryId));
  }

  // Export subcategories (Postman: export_subcategories[])
  (form.company.productSubcategories || []).forEach((sub) => {
    fd.append("export_subcategories[]", sub);
  });

  // Financial + Netting (Postman wants 1/0)
  const fin = boolTo10(form.company.financialProtectionRequired);
  const net = boolTo10(form.company.nettingRequired);
  if (fin) fd.append("financial_protection_required", fin);
  if (net) fd.append("netting_required", net);

  // Contacts (Postman: contacts[0][full_name], etc.)
  (form.contacts || []).forEach((c, i) => {
    // skip totally empty rows
    const hasAny =
      (c.fullName && c.fullName.trim()) ||
      (c.email && c.email.trim()) ||
      (c.phone && c.phone.trim());
    if (!hasAny) return;

    fd.append(`contacts[${i}][full_name]`, c.fullName || "");
    fd.append(`contacts[${i}][designation]`, c.designation || "");
    fd.append(`contacts[${i}][email]`, c.email || "");
    fd.append(`contacts[${i}][phone]`, c.phone || "");
    fd.append(`contacts[${i}][alternate_phone]`, c.altPhone || "");
  });

  // ---------------------------
  // STEP 3 : Business Reg (BRC) + Affiliations
  // ---------------------------
  fd.append("brc_number", form.business.brcNumber || "");
  fd.append("brc_issue_date", form.business.issueDate || "");
  fd.append("brc_expiry_date", form.business.expiryDate || "");

  // Your type has brcFile (file). Postman uses brc_document_url in example,
  // but backend may accept file too. We'll send file if present.
  if (form.business.brcFile) {
    fd.append("brc_document", form.business.brcFile);
  }

  // Affiliations (Postman: affiliations[0][name] etc.)
  (form.business.affiliations || []).forEach((a, i) => {
    fd.append(`affiliations[${i}][name]`, a.name || "");
    fd.append(`affiliations[${i}][issue_date]`, a.issueDate || "");
    fd.append(`affiliations[${i}][expiry_date]`, a.expiryDate || "");
    fd.append(
      `affiliations[${i}][country]`,
      iso2ToCountryName(a.countryCode)
    );
  });

  // ---------------------------
  // STEP 4 : Membership
  // ---------------------------
  if (form.membership.organization) {
    fd.append("membership[organization]", form.membership.organization);
  }
  if (form.membership.membershipNumber) {
    fd.append("membership[membership_number]", form.membership.membershipNumber);
  }
  if (form.membership.joinedDate) {
    fd.append("membership[joined_date]", form.membership.joinedDate);
  }

  // If backend supports file:
  if (form.membership.certificate) {
    fd.append("membership[certificate]", form.membership.certificate);
  }

  // ---------------------------
  // STEP 5 : Company Profile / Branches / Sectors / Tech
  // (Postman: company_profile_overview, company_profile_image_url, branches_countries[])
  // ---------------------------
  fd.append("company_profile_overview", form.company.profileBrief || "");

  // Your type has coverPhoto file (not URL). Send file if present.
  if (form.company.coverPhoto) {
    fd.append("company_profile_image", form.company.coverPhoto);
  }

  // Branches countries
  (form.services.supportedCountries || []).forEach((c) => {
    fd.append("branches_countries[]", iso2ToCountryName(c));
  });

  // Postman also shows supported_countries as a comma string (keep it too)
  if (form.services.supportedCountries?.length) {
    const txt = form.services.supportedCountries
      .map((c) => iso2ToCountryName(c))
      .join(", ");
    fd.append("supported_countries", txt);
  }

  // service sectors + tech stack
  if (form.services.serviceSectors) fd.append("service_sectors", form.services.serviceSectors);
  if (form.services.techStack) fd.append("tech_stack", form.services.techStack);

  // ---------------------------
  // STEP 6 : Insurance
  // (Postman keys)
  // ---------------------------
  if (form.insurance.provider) fd.append("insurance_provider", form.insurance.provider);
  if (form.insurance.policyType) fd.append("policy_type", form.insurance.policyType);
  if (form.insurance.policyNumber) fd.append("policy_number", form.insurance.policyNumber);
  if (form.insurance.coverageAmount) fd.append("coverage_amount", form.insurance.coverageAmount);
  if (form.insurance.expiryDate) fd.append("insurance_expiry_date", form.insurance.expiryDate);

  if (form.insurance.policyDoc) {
    fd.append("insurance_policy_document", form.insurance.policyDoc);
  }

  // ---------------------------
  // STEP 2+ : Mailing (Postman keys: mailing_title, mailing_country, mailing_state, mailing_city, mailing_zip)
  // Also trade_name
  // ---------------------------
  if (form.company.tradeName) fd.append("trade_name", form.company.tradeName);

  if (form.company.mailing?.title) fd.append("mailing_title", form.company.mailing.title);

  fd.append("mailing_country", iso2ToCountryName(form.company.mailing?.countryCode));
  fd.append("mailing_state", form.company.mailing?.stateCode || "");
  fd.append("mailing_city", form.company.mailing?.city || "");
  fd.append("mailing_zip", form.company.mailing?.zip || "");

  // ---------------------------
  // STEP 5 : Core activities
  // (Postman: core_activities[] values: Import, Export, Trading)
  // ---------------------------
  (form.services.coreActivities || []).forEach((a) => {
    fd.append("core_activities[]", a);
  });

  return fd;
}

/**
 * Final submit (Step 7 Review -> Submit)
 * Update the endpoint to your backend route.
 */
export async function submitMemberRegistration(form: RegistrationForm) {
  const fd = buildMemberRegistrationFormData(form);

  // ✅ IMPORTANT: do NOT set Content-Type manually; let browser set boundary
  const res = await http.post("/member-registration", fd, {
    headers: { Accept: "application/json" },
  });

  return res.data;
}

