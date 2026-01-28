import http from "./http";

export type ConferenceItem = {
  id: number;
  name: string;
  slug: string;
  intro: string | null;
  description: string | null;

  banner_image_url: string | null;

  start_date: string; // "YYYY-MM-DD"
  end_date: string | null;

  venue: string | null;
  city: string | null;
  state: string | null;
  country: string | null;

  full_address?: string | null;
  date_range?: string | null;
  time_range?: string | null;

  website?: string | null;
  registration_url?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;

  status: string;
};

export type ConferencesResponse = {
  success: boolean;
  message: string;
  data: ConferenceItem[];
  pagination?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
};

export async function getConferences() {
  const res = await http.get<ConferencesResponse>("/conferences");
  return res.data;
}

/**
 * If backend has a single endpoint later, change this to:
 * http.get(`/conferences/${slug}`)
 * For now we fetch list and find by slug.
 */
export async function getConferenceBySlug(slug: string) {
  const res = await getConferences();
  const item = res.data.find((x) => x.slug === slug);
  return item || null;
}
