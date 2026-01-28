import http from "./http";

export type HomeHeroApiItem = {
  id: number;
  title: string;
  subtitle: string;
  paragraph: string;
  slug: string;
  sort_order: number;
  status: string;
  is_active: boolean;
  image_desktop_url: string | null;
  image_mobile_url: string | null;
};

export type HomeHeroesResponse = {
  success: boolean;
  status: number;
  message: string;
  data: HomeHeroApiItem[];
};

export async function getHomeHeroes() {
  const res = await http.get<HomeHeroesResponse>("/home-heroes");
  return res.data;
}
