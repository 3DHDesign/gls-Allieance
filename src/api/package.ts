import http from "./http";

export type MembershipPackage = {
  id: number;
  name: string;
  slug: string;
  price: string | number;
  duration: number;
  billing_cycle: "monthly" | "annual";
  status: string;
};

export async function getActivePackages() {
  const res = await http.get<{ packages: MembershipPackage[] }>("/packages");
  return res.data.packages;
}
