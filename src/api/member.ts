// src/api/member.ts
import http from "./http";

export type MemberRegistration = {
  id: number;
  ref_code: string;
  user_id: string;
  profile_type: string;
  status: string;
  user_name?: string;

  company_name?: string;
  trade_name?: string | null;

  year_established?: string;
  website?: string;

  registered_address?: string;
  country?: string;
  state_province?: string;
  city?: string;
  zip_code?: string;

  // ✅ mailing fields (your API returns these)
  mailing_title?: string | null;
  mailing_country?: string | null;
  mailing_state?: string | null;
  mailing_city?: string | null;
  mailing_zip?: string | null;

  export_main_category_ids?: string[];
  export_subcategories?: string[];

  // ✅ flags (your ProfilePage uses these)
  financial_protection_required?: boolean;
  netting_required?: boolean;

  contacts?: Array<{
    full_name?: string;
    designation?: string;
    email?: string;
    phone?: string;
    alternate_phone?: string | null;
  }>;

  brc_number?: string;
  brc_issue_date?: string | null;
  brc_expiry_date?: string | null;
  brc_document_url?: string | null;

  affiliations?: Array<{
    name: string;
    issue_date?: string;
    expiry_date?: string;
    country?: string;
  }>;

  company_profile_overview?: string | null;

  // ✅ image url from API
  company_profile_image_url?: string | null;

  insurance_provider?: string | null;
  policy_type?: string | null;
  policy_number?: string | null;
  coverage_amount?: string | null;
  insurance_expiry_date?: string | null;
  insurance_policy_document_url?: string | null;

  branches_countries?: string[];
  core_activities?: string[];
  supported_countries?: string | null;

  created_at?: string;
  updated_at?: string;
};

export type MemberResponse = {
  success: boolean;
  data: MemberRegistration;
};

export async function getMemberByUserId(userId: number | string) {
  const res = await http.get<MemberResponse>(
    `/member-registration/user/${userId}`
  );
  return res.data;
}
