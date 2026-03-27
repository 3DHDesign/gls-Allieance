// src/api/member-registration.ts
import http from "./http";
import type { RegistrationForm } from "../types/registration";
import { Country } from "country-state-city";
import {
  getCategories,
  normalizeCategories,
  type CategoryNode,
} from "./categories";

/**
 * Convert ISO2 -> Country name
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

function flattenCategories(tree: CategoryNode[]) {
  const list: { id: string; name: string; parentId: string | null }[] = [];

  const walk = (nodes: CategoryNode[]) => {
    nodes.forEach((node) => {
      list.push({
        id: String(node.id),
        name: node.name,
        parentId: node.parentId,
      });
      if (node.children?.length) walk(node.children);
    });
  };

  walk(tree);
  return list;
}

async function getCategoryNameMap() {
  const data = await getCategories();
  const tree = normalizeCategories(data);
  const flat = flattenCategories(tree);

  const map = new Map<string, string>();
  flat.forEach((c) => map.set(String(c.id), c.name));
  return map;
}

export async function buildMemberRegistrationFormData(form: RegistrationForm) {
  const fd = new FormData();

  // category id -> name map
  const categoryMap = await getCategoryNameMap();

  const mainCategoryName = form.company.productCategoryId
    ? categoryMap.get(String(form.company.productCategoryId)) ||
      String(form.company.productCategoryId)
    : "";

  const subCategoryNames = (form.company.productSubcategories || []).map(
    (id) => categoryMap.get(String(id)) || String(id)
  );

  // ---------------------------
  // STEP 0/1 : Profile + Username
  // ---------------------------
  fd.append("profile_type", form.profileType || "");
  fd.append("user_name", form.username || "");

  // ---------------------------
  // STEP 2 : Company Info
  // ---------------------------
  fd.append("company_name", form.company.companyName || "");
  fd.append("year_established", String(form.company.yearEstablished ?? ""));
  fd.append("website", form.company.website || "");
  fd.append("registered_address", form.company.registeredAddress || "");

  fd.append("country", iso2ToCountryName(form.company.regCountryCode));
  fd.append("state_province", form.company.regState || "");
  fd.append("city", form.company.regCity || "");
  fd.append("zip_code", form.company.regZip || "");

  // ✅ send category NAMES, not raw IDs
 // main category must be sent as raw ID for backend validation
if (form.company.productCategoryId) {
  fd.append("category_ids[]", String(form.company.productCategoryId));
}

// keep subcategories too
(form.company.productSubcategories || []).forEach((subId) => {
  fd.append("export_subcategories[]", String(subId));
});

  const fin = boolTo10(form.company.financialProtectionRequired);
  const net = boolTo10(form.company.nettingRequired);
  if (fin) fd.append("financial_protection_required", fin);
  if (net) fd.append("netting_required", net);

  // Contacts
  (form.contacts || []).forEach((c, i) => {
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
  // STEP 3 : Business Reg
  // ---------------------------
  fd.append("brc_number", form.business.brcNumber || "");
  fd.append("brc_issue_date", form.business.issueDate || "");
  fd.append("brc_expiry_date", form.business.expiryDate || "");

  // ✅ exact backend key
  if (form.business.brcFile instanceof File) {
    fd.append("brc_document_url", form.business.brcFile);
  }

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
  if (form.membership.certificate instanceof File) {
    fd.append("membership[certificate]", form.membership.certificate);
  }

  // ---------------------------
  // STEP 5 : Company Profile
  // ---------------------------
  fd.append("company_profile_overview", form.company.profileBrief || "");

  // ✅ exact backend key
  if (form.company.coverPhoto instanceof File) {
    fd.append("company_profile_image_url", form.company.coverPhoto);
  }

  (form.services.supportedCountries || []).forEach((c) => {
    fd.append("branches_countries[]", iso2ToCountryName(c));
  });

  if (form.services.supportedCountries?.length) {
    const txt = form.services.supportedCountries
      .map((c) => iso2ToCountryName(c))
      .join(", ");
    fd.append("supported_countries", txt);
  }

  if (form.services.serviceSectors) {
    fd.append("service_sectors", form.services.serviceSectors);
  }

  if (form.services.techStack) {
    fd.append("tech_stack", form.services.techStack);
  }

  (form.services.coreActivities || []).forEach((a) => {
    fd.append("core_activities[]", a);
  });

  (form.services.servicesProvided || []).forEach((s) => {
    fd.append("services[]", s);
  });

  // ---------------------------
  // STEP 6 : Insurance
  // ---------------------------
  if (form.insurance.provider) {
    fd.append("insurance_provider", form.insurance.provider);
  }
  if (form.insurance.policyType) {
    fd.append("policy_type", form.insurance.policyType);
  }
  if (form.insurance.policyNumber) {
    fd.append("policy_number", form.insurance.policyNumber);
  }
  if (form.insurance.coverageAmount) {
    fd.append("coverage_amount", form.insurance.coverageAmount);
  }
  if (form.insurance.expiryDate) {
    fd.append("insurance_expiry_date", form.insurance.expiryDate);
  }

  // ✅ exact backend key
  if (form.insurance.policyDoc instanceof File) {
    fd.append("insurance_policy_document_url", form.insurance.policyDoc);
  }

  // ---------------------------
  // Mailing + trade name
  // ---------------------------
  if (form.company.tradeName) {
    fd.append("trade_name", form.company.tradeName);
  }

  if (form.company.mailing?.title) {
    fd.append("mailing_title", form.company.mailing.title);
  }

  fd.append(
    "mailing_country",
    iso2ToCountryName(form.company.mailing?.countryCode)
  );
  fd.append("mailing_state", form.company.mailing?.stateCode || "");
  fd.append("mailing_city", form.company.mailing?.city || "");
  fd.append("mailing_zip", form.company.mailing?.zip || "");

  return fd;
}

/**
 * Final submit
 */
export async function submitMemberRegistration(form: RegistrationForm) {

  console.log("brcFile", form.business.brcFile, form.business.brcFile instanceof File);
  console.log("coverPhoto", form.company.coverPhoto, form.company.coverPhoto instanceof File);
  console.log("policyDoc", form.insurance.policyDoc, form.insurance.policyDoc instanceof File);

  const fd = await buildMemberRegistrationFormData(form);

  const res = await http.post("/member-registration", fd, {
    headers: { Accept: "application/json" },
  });

  return res.data;
}