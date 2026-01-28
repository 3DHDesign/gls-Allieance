import http from "./http";

export type TestimonialApiItem = {
  id: number;
  name: string;
  designation: string;
  company: string;
  message: string;
  image_url: string | null;
  status: "active" | "inactive" | string;
  sort_order: number;
};

export type TestimonialsResponse = {
  success: boolean;
  status: number;
  message: string;
  data: TestimonialApiItem[];
};

export async function getTestimonials() {
  const res = await http.get<TestimonialsResponse>("/testimonials");
  return res.data;
}
