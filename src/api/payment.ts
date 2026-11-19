import http from "./http";

export async function makePayment(fd: FormData) {
  const res = await http.post("/payment/make", fd);
  return res.data;
}

export type UserPayment = {
  id: number;
  reference_code: string;
  payment_type: "manual" | "gateway";
  amount: string | number;
  status: "pending" | "completed" | "failed";
  payment_method: string;
  transaction_id?: string | null;
  avidness_url?: string | null;
  created_at_human?: string;
  package?: {
    id: number;
    name: string;
    billing_cycle: "monthly" | "annual";
  } | null;
};

export async function getUserPayments(userId: number | string) {
  const res = await http.get<{ payments: UserPayment[] }>(
    `/payment/user/${userId}`,
  );
  return res.data.payments;
}