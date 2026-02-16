// src/api/auth.ts
import http from "./http"; 

export type AuthUser = {
  id?: number;
  name?: string;
  email?: string;

  profile_type?: "service_provider" | "importer_exporter" | string;
  status?: "active" | "inactive" | "blocked" | string;

  role_id?: number | string;

  ref_code?: string;
  reference_code?: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

function extractToken(data: any): string | null {
  return (
    data?.token ||
    data?.access_token ||
    data?.data?.token ||
    data?.data?.access_token ||
    null
  );
}

function extractUser(data: any): AuthUser {
  const u: any = data?.user || data?.data?.user || data?.data || {};
  return {
    id: u?.id,
    name: u?.name,
    email: u?.email,
    profile_type: u?.profile_type,
    status: u?.status,
    role_id: u?.role_id,
    ref_code: u?.ref_code,
    reference_code: u?.reference_code,
  };
}

/* =========================
   AUTH (LOGIN / LOGOUT / ME)
   ========================= */

export async function login(payload: LoginPayload) {
  const fd = new FormData();
  fd.append("email", payload.email);
  fd.append("password", payload.password);

  const res = await http.post("/auth/login", fd, {
    headers: { Accept: "application/json" },
  });

  const data = res.data;
  const token = extractToken(data);
  const user = extractUser(data);

  if (token) localStorage.setItem("gls_token", token);

  return { token, user, raw: data };
}

export async function logout() {
  try {
    await http.post("/auth/logout");
  } finally {
    localStorage.removeItem("gls_token");
    localStorage.removeItem("gls_user");
  }
}

export async function me() {
  const res = await http.get("/auth/me");
  return extractUser(res.data);
}

/* =========================
   FORGOT PASSWORD (OTP FLOW)
   1) request-otp: email
   2) verify-otp: email + otp
   3) change: password + password_confirmation
   ========================= */ 

   export async function requestPasswordOtp(email: string) {
    const fd = new FormData();
    fd.append("email", email);
  
    const res = await http.post("/auth/password/request-otp", fd, {
      headers: { Accept: "application/json" },
      skipAuth: true,
    } as any);
  
    return res.data;
  }
  
  // 2) verify otp -> returns reset_token (store it)
  export async function verifyPasswordOtp(payload: { email: string; otp: string }) {
    const fd = new FormData();
    fd.append("email", payload.email);
    fd.append("otp", payload.otp);
  
    const res = await http.post("/auth/password/verify-otp", fd, {
      headers: { Accept: "application/json" },
      skipAuth: true,
    } as any);
  
    const resetToken = res.data?.data?.reset_token;
    if (resetToken) sessionStorage.setItem("gls_reset_token", resetToken);
  
    return res.data;
  }
  
  // 3) change password -> Bearer reset_token + body only password fields
  export async function changePasswordAfterOtp(payload: {
    password: string;
    password_confirmation: string;
  }) {
    const resetToken = sessionStorage.getItem("gls_reset_token") || "";
    if (!resetToken) throw new Error("Reset token missing. Verify OTP again.");
  
    const fd = new FormData();
    fd.append("password", payload.password);
    fd.append("password_confirmation", payload.password_confirmation);
  
    const res = await http.post("/auth/password/change", fd, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${resetToken}`, // ✅ THIS IS THE FIX
      },
      skipAuth: true, // ✅ stop gls_token
    } as any);
  
    sessionStorage.removeItem("gls_reset_token");
    return res.data;
  }
/* =========================
   UI HELPERS
   ========================= */

export function isUserActive(user?: AuthUser | null) {
  return String(user?.status || "").toLowerCase() === "active";
}

export function isUserInactive(user?: AuthUser | null) {
  const s = String(user?.status || "").toLowerCase();
  return s === "inactive" || s === "blocked";
}
