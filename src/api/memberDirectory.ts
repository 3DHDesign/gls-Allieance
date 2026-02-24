import http from "./http";

export type MemberRow = {
  id: number | string;
  company_name?: string;
  name?: string;
  country?: string;
  city?: string;
  years?: number;
  tags?: string[];
  // add more fields if needed later
};

export type GetMemberDirectoryParams = {
  status?: string;
  profile_type: "freight_forwarder" | "importer_exporter";
  country?: string;
  city?: string;
  key_word?: string;
  user_id?: string | number;
  per_page?: number;
  category_id?: number | string;
  page?: number; // ✅ add this
};

export async function getMemberDirectory(params: GetMemberDirectoryParams) {
  const res = await http.get("/member-registration", { params });
  return res.data;
}

// ✅ normalize whatever backend returns into array
export function normalizeMembers(payload: any): MemberRow[] {
  // common shapes:
  // { data: { data: [...] } } OR { data: [...] } OR { success, data: [...] }
  const d = payload?.data ?? payload;

  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.data)) return d.data;
  if (Array.isArray(d?.data?.data)) return d.data.data;

  return [];
}

// ✅ pagination parser (works even if API structure changes)
export function parsePagination(payload: any) {
  const d = payload?.data ?? payload;

  const meta =
    d?.meta || d?.data?.meta || d?.pagination || d?.data?.pagination || null;

  const current_page =
    meta?.current_page ?? d?.current_page ?? d?.data?.current_page ?? 1;

  const last_page =
    meta?.last_page ?? d?.last_page ?? d?.data?.last_page ?? null;

  const total = meta?.total ?? d?.total ?? d?.data?.total ?? null;

  return {
    current_page: Number(current_page || 1),
    last_page: last_page ? Number(last_page) : null,
    total: total ? Number(total) : null,
  };
}