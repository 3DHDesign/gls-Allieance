import http from "./http";

export async function makePayment(fd: FormData) {
  const res = await http.post("/payment/make", fd);
  return res.data;
}