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

export type UserSubscription = {
  id: number;
  status: string;
  expiration_date: string | null;
  package: MembershipPackage | null;
};

export async function getUserSubscription(userId: number | string) {
  const res = await http.get<{ subscription: UserSubscription | null }>(
    `/packages/user/${userId}`,
  );
  return res.data.subscription;
}
