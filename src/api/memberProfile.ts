import publicHttp from "./publicHttp"; // or your axios instance
import type { MemberRow } from "./memberDirectory";

export type MemberProfileResponse = {
  success: boolean;
  data: MemberRow & {
    ref_code?: string;
    user_id?: string;
    profile_type?: string;
    status?: string;

    website?: string;
    registered_address?: string;
    state_province?: string;
    zip_code?: string;

    export_main_category_ids?: string[];
    export_main_categories?: Array<{ id: number; name: string; slug?: string }>;
    export_subcategories?: string[];

    financial_protection_required?: boolean | number | string;
    netting_required?: boolean | number | string;

    contacts?: Array<{
      full_name?: string;
      designation?: string;
      email?: string;
      phone?: string;
      alternate_phone?: string | null;
    }>;

    brc_number?: string;
    brc_issue_date?: string;
    brc_expiry_date?: string;
    brc_document_url?: string;

    affiliations?: Array<{
      name?: string;
      issue_date?: string;
      expiry_date?: string;
      country?: string;
    }>;

    company_profile_overview?: string;
    company_profile_image_url?: string;

    branches_countries?: string[];
    supported_countries?: string;

    service_sectors?: string;
    tech_stack?: string;

    core_activities?: string[];

    insurance_provider?: string;
    policy_type?: string;
    policy_number?: string;
    coverage_amount?: string;
    insurance_expiry_date?: string;
    insurance_policy_document_url?: string;

    // sometimes backend gives files urls:
    company_profile_image?: string;
    brc_document?: string;
  };
};

export async function getMemberById(id: string) {
  const res = await publicHttp.get<MemberProfileResponse>(`/member-registration/${id}`);
  return res.data;
}