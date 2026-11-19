import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import DashboardShell from "../components/DashboardShell";
import { getUserPayments, makePayment, type UserPayment } from "../api/payment";
import { getMemberByUserId, type MemberRegistration } from "../api/member";
import { payablePayment, type PayablePaymentDetails } from "payable-ipg-js";
import {
  getActivePackages,
  getUserSubscription,
  type MembershipPackage,
  type UserSubscription,
} from "../api/package";
import {
  FiCalendar,
  FiCheck,
  FiCreditCard,
  FiLock,
  FiRefreshCw,
  FiUploadCloud,
} from "react-icons/fi";

function getErrorMessage(error: unknown) {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) return response.data.message;
  }
  if (error instanceof Error) return error.message;
  return "Payment failed. Please try again.";
}

function getGatewayErrorMessage(error: string | Record<string, string[]> | undefined) {
  if (!error) return "PAYable could not start the payment.";
  if (typeof error === "string") return error;
  return Object.entries(error)
    .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
    .join(" ");
}

function getCountryCode(country: string) {
  const normalized = country
    .trim()
    .toLowerCase()
    .replace(/\s*\([^)]*\)\s*$/, "");
  if (
    normalized === "sri lanka" ||
    normalized === "sri-lanka" ||
    normalized === "lk" ||
    normalized === "lka"
  ) {
    return "LKA";
  }
  return country.trim().toUpperCase().slice(0, 3);
}

async function sha512(value: string) {
  const digest = await crypto.subtle.digest(
    "SHA-512",
    new TextEncoder().encode(value),
  );
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}

function formatDate(value: string | null | undefined) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function PaymentPage() {
  const { user } = useAuth();
  const userId = user?.id;

  const [member, setMember] = useState<MemberRegistration | null>(null);
  const [amount, setAmount] = useState("10000");
  const [transactionId, setTransactionId] = useState("");
  const [slip, setSlip] = useState<File | null>(null);

  const [gatewayMessage, setGatewayMessage] = useState<string | null>(null);
  const [manualMessage, setManualMessage] = useState<string | null>(null);
  const [gatewayLoading, setGatewayLoading] = useState(false);
  const [manualLoading, setManualLoading] = useState(false);
  const [packages, setPackages] = useState<MembershipPackage[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState<number | "">("");
  const [packageLoading, setPackageLoading] = useState(true);
  const [packageMessage, setPackageMessage] = useState<string | null>(null);
  const [payments, setPayments] = useState<UserPayment[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"online" | "manual">("online");
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);

  useEffect(() => {
    if (!userId) return;
    getMemberByUserId(userId)
      .then((res) => setMember(res.data))
      .catch((error: unknown) => setGatewayMessage(getErrorMessage(error)));
  }, [userId]);

  useEffect(() => {
    getActivePackages()
      .then((items) => {
        setPackages(items);
        if (items.length > 0) {
          setSelectedPackageId(items[0].id);
          setAmount(String(items[0].price));
        }
        if (items.length === 0) {
          setPackageMessage("No active packages are available.");
        }
      })
      .catch((error: unknown) => setPackageMessage(getErrorMessage(error)))
      .finally(() => setPackageLoading(false));
  }, []);

  useEffect(() => {
    if (!userId) return;
    setPaymentsLoading(true);
    getUserPayments(userId)
      .then(setPayments)
      .catch((error: unknown) => setManualMessage(getErrorMessage(error)))
      .finally(() => setPaymentsLoading(false));

    getUserSubscription(userId)
      .then(setSubscription)
      .catch(() => setSubscription(null));
  }, [userId]);

  const refreshPayments = () => {
    if (!userId) return;
    getUserPayments(userId)
      .then(setPayments)
      .catch((error: unknown) => setManualMessage(getErrorMessage(error)));
    getUserSubscription(userId).then(setSubscription).catch(() => setSubscription(null));
  };

  const selectedPackage =
    packages.find((item) => item.id === selectedPackageId) || null;

  const contact = member?.contacts?.[0];
  const customerName = useMemo(() => {
    const parts = (member?.user_name || user?.name || "GLS Alliance Member")
      .trim()
      .split(/\s+/);
    return {
      first: parts[0] || "GLS",
      last: parts.slice(1).join(" ") || "Member",
    };
  }, [member?.user_name, user?.name]);

  const startGatewayPayment = async () => {
    setGatewayMessage(null);
    if (!userId) {
      setGatewayMessage("Login required.");
      return;
    }

    const merchantKey = import.meta.env.VITE_PAYABLE_MERCHANT_KEY;
    const merchantToken = import.meta.env.VITE_PAYABLE_MERCHANT_TOKEN;
    const logoUrl = import.meta.env.VITE_PAYABLE_LOGO_URL;
    const notifyUrl = import.meta.env.VITE_PAYABLE_NOTIFY_URL;
    const returnUrl = import.meta.env.VITE_PAYABLE_RETURN_URL;
    if (!merchantKey || !merchantToken || !logoUrl || !notifyUrl || !returnUrl) {
      setGatewayMessage(
        "PAYable is not configured. Set the merchant key, token, logo URL, return URL, and notify URL.",
      );
      return;
    }
    if (window.location.protocol !== "https:" || !returnUrl.startsWith("https://")) {
      setGatewayMessage(
        "PAYable requires HTTPS. Open the deployed HTTPS website and configure an HTTPS return URL.",
      );
      return;
    }
    if (!contact?.email && !user?.email) {
      setGatewayMessage("A customer email is required for online payment.");
      return;
    }
    if (!member?.registered_address || !member.city || !member.country) {
      setGatewayMessage("A complete billing address is required for online payment.");
      return;
    }
    if (!selectedPackageId) {
      setGatewayMessage("Select a package before payment.");
      return;
    }
    const postalCode = (member.zip_code?.trim() || "0000").slice(0, 10);
    const billingCountry = getCountryCode(member.country);
    if (billingCountry.length !== 3) {
      setGatewayMessage("The billing country must have a valid 3-character code.");
      return;
    }

    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setGatewayMessage("Enter a valid payment amount.");
      return;
    }

    const formattedAmount = numericAmount.toFixed(2);
    const invoiceId = `GLS-${Date.now()}`;
    const currencyCode = "LKR";
    const tokenHash = await sha512(merchantToken);
    const checkValue = await sha512(
      `${merchantKey}|${invoiceId}|${formattedAmount}|${currencyCode}|${tokenHash}`,
    );
    const payment = {
      logoUrl,
      notifyUrl,
      returnUrl,
      checkValue,
      orderDescription: "GLS Alliance membership payment",
      invoiceId,
      merchantKey,
      customerFirstName: customerName.first,
      customerLastName: customerName.last,
      customerMobilePhone: contact?.phone || "0000000000",
      customerEmail: contact?.email || user?.email || "",
      billingAddressStreet: member.registered_address,
      billingAddressCity: member.city,
      billingAddressCountry: billingCountry,
      billingAddressPostcodeZip: postalCode,
      billingAddressStateProvince: member.state_province || undefined,
      billingCompanyName: member.company_name || undefined,
      amount: formattedAmount,
      currencyCode,
      paymentType: "1",
      custom1: String(userId),
      custom2: String(selectedPackageId),
    } as PayablePaymentDetails & { custom2: string };

    try {
      setGatewayLoading(true);
      const result = await payablePayment(
        payment,
        import.meta.env.VITE_PAYABLE_TEST_MODE !== "false",
      );
      if (!result.success) {
        setGatewayMessage(
          result.error
            ? getGatewayErrorMessage(result.error)
            : result.message || "PAYable could not start the payment.",
        );
      }
    } catch (error: unknown) {
      setGatewayMessage(getErrorMessage(error));
    } finally {
      setGatewayLoading(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setManualMessage(null);

    if (!userId) return setManualMessage("Login required.");
    if (!amount.trim()) return setManualMessage("Amount is required.");
    if (!transactionId.trim()) return setManualMessage("Transaction ID required.");
    if (!slip) return setManualMessage("Upload slip.");
    if (!selectedPackageId) return setManualMessage("Select a package.");

    const fd = new FormData();
    fd.append("user_id", String(userId));
    fd.append("package_id", String(selectedPackageId));
    fd.append("payment_type", "manual");
    fd.append("amount", amount.trim());
    fd.append("payment_method", "transaction");
    fd.append("transaction_id", transactionId.trim());
    fd.append("avidness", slip); // ✅ EXACT KEY from Postman

    try {
      setManualLoading(true);
      const res = await makePayment(fd);

      setManualMessage(res?.message || "Payment submitted.");
      setSlip(null);
      setTransactionId("");
      refreshPayments();
    } catch (error: unknown) {
      setManualMessage(getErrorMessage(error));
    } finally {
      setManualLoading(false);
    }
  };

  return (
    <DashboardShell>
      <div className="py-2">
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-accent-light)]">
              Billing & Membership
            </p>
            <h1 className="mt-2 text-3xl font-bold text-[#0b1f3b] sm:text-4xl">Payment</h1>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              Choose a membership and complete your secure payment.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm">
            <FiLock className="text-emerald-600" />
            Secure checkout
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-6">
            <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_16px_45px_rgba(15,35,75,0.08)]">
              <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--color-accent)] text-sm font-bold text-white">1</span>
                  <div>
                    <h2 className="text-lg font-bold text-[#0b1f3b]">Select membership</h2>
                    <p className="text-xs text-[var(--color-muted)]">Choose the plan that fits your business</p>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-7">
                {packageLoading ? (
                  <div className="grid place-items-center rounded-2xl border border-dashed border-slate-200 py-10 text-sm text-slate-500">
                    Loading membership packages...
                  </div>
                ) : packageMessage ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {packageMessage}
                  </div>
                ) : (
                  <div className="grid gap-3 md:grid-cols-2">
                    {packages.map((membershipPackage) => {
                      const selected = selectedPackageId === membershipPackage.id;
                      return (
                        <button
                          type="button"
                          key={membershipPackage.id}
                          onClick={() => {
                            setSelectedPackageId(membershipPackage.id);
                            setAmount(String(membershipPackage.price));
                          }}
                          className={`relative rounded-2xl border p-5 text-left transition ${
                            selected
                              ? "border-[var(--color-accent)] bg-[#f8fbff] shadow-[0_10px_28px_rgba(1,30,79,0.12)]"
                              : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                          }`}
                        >
                          {selected && (
                            <span className="absolute right-4 top-4 grid h-6 w-6 place-items-center rounded-full bg-[var(--color-accent)] text-white">
                              <FiCheck className="text-sm" />
                            </span>
                          )}
                          <p className="pr-8 text-base font-bold text-[#0b1f3b]">{membershipPackage.name}</p>
                          <p className="mt-1 text-xs font-medium capitalize text-slate-500">
                            {membershipPackage.billing_cycle} membership
                          </p>
                          <div className="mt-5 flex items-end justify-between gap-3">
                            <div>
                              <span className="text-xs font-medium text-slate-500">LKR</span>
                              <p className="text-2xl font-bold text-[#0b1f3b]">
                                {Number(membershipPackage.price).toLocaleString()}
                              </p>
                            </div>
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                              {membershipPackage.duration} days
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>

            <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_16px_45px_rgba(15,35,75,0.08)]">
              <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--color-accent)] text-sm font-bold text-white">2</span>
                  <div>
                    <h2 className="text-lg font-bold text-[#0b1f3b]">Payment details</h2>
                    <p className="text-xs text-[var(--color-muted)]">Select your preferred payment method</p>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-7">
                <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("online")}
                    className={`rounded-lg px-4 py-3 text-sm font-semibold transition ${
                      paymentMethod === "online"
                        ? "bg-white text-[var(--color-accent)] shadow-sm"
                        : "text-slate-500"
                    }`}
                  >
                    <FiCreditCard className="mr-2 inline" /> Pay online
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("manual")}
                    className={`rounded-lg px-4 py-3 text-sm font-semibold transition ${
                      paymentMethod === "manual"
                        ? "bg-white text-[var(--color-accent)] shadow-sm"
                        : "text-slate-500"
                    }`}
                  >
                    <FiUploadCloud className="mr-2 inline" /> Bank transfer
                  </button>
                </div>

                {paymentMethod === "online" ? (
                  <div className="mt-6">
                    <div className="rounded-2xl border border-slate-200 p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-[#0b1f3b]">Card payment</p>
                          <p className="mt-1 text-xs text-slate-500">Visa, Mastercard, Amex and more</p>
                        </div>
                        <div className="flex gap-1">
                          <span className="rounded border bg-white px-2 py-1 text-[10px] font-bold text-blue-900">VISA</span>
                          <span className="rounded border bg-white px-2 py-1 text-[10px] font-bold text-red-700">MC</span>
                        </div>
                      </div>
                    </div>
                    {gatewayMessage && (
                      <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {gatewayMessage}
                      </div>
                    )}
                  </div>
                ) : (
                  <form onSubmit={submit} className="mt-6 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600">Amount (LKR)</label>
                        <input className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[var(--color-accent)]" value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="numeric" />
                      </div>
                      <div>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600">Transaction ID</label>
                        <input className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[var(--color-accent)]" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} placeholder="Enter reference" />
                      </div>
                    </div>
                    <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 text-center transition hover:border-[var(--color-accent-light)]">
                      <FiUploadCloud className="mb-2 text-2xl text-[var(--color-accent)]" />
                      <span className="text-sm font-semibold text-[#0b1f3b]">{slip ? slip.name : "Upload payment slip"}</span>
                      <span className="mt-1 text-xs text-slate-500">PNG, JPG or PDF up to 10 MB</span>
                      <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => setSlip(e.target.files?.[0] || null)} />
                    </label>
                    {manualMessage && (
                      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">{manualMessage}</div>
                    )}
                    <button className="w-full rounded-xl bg-[var(--color-accent)] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-950/10 disabled:opacity-50" disabled={manualLoading}>
                      {manualLoading ? "Submitting..." : "Submit for verification"}
                    </button>
                  </form>
                )}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <div className="overflow-hidden rounded-[24px] bg-[#071d42] text-white shadow-[0_18px_45px_rgba(7,29,66,0.22)]">
              <div className="border-b border-white/10 px-6 py-5">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-200">Order summary</p>
              </div>
              <div className="p-6">
                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                  <p className="text-xs text-blue-200">Selected package</p>
                  <p className="mt-1 text-lg font-bold">{selectedPackage?.name || "Select a package"}</p>
                  {selectedPackage && (
                    <p className="mt-1 text-xs capitalize text-blue-100">
                      {selectedPackage.billing_cycle} · {selectedPackage.duration} days
                    </p>
                  )}
                </div>
                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex justify-between text-blue-100">
                    <span>Membership</span>
                    <span>LKR {Number(amount || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-blue-100">
                    <span>Processing fee</span>
                    <span>LKR 0</span>
                  </div>
                </div>
                <div className="my-5 border-t border-white/10" />
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-blue-200">Total due</p>
                    <p className="mt-1 text-3xl font-bold">LKR {Number(amount || 0).toLocaleString()}</p>
                  </div>
                  <span className="text-xs text-blue-200">LKR</span>
                </div>
                {paymentMethod === "online" && (
                  <button type="button" className="mt-6 w-full rounded-xl bg-white px-5 py-3.5 text-sm font-bold text-[#071d42] shadow-lg disabled:opacity-50" disabled={gatewayLoading} onClick={startGatewayPayment}>
                    {gatewayLoading ? "Connecting securely..." : "Continue to payment"}
                  </button>
                )}
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-blue-200">
                  <FiLock /> Encrypted and secure
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_12px_35px_rgba(15,35,75,0.06)]">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Current membership</p>
              <div className="mt-4 flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-100 text-emerald-700"><FiCalendar /></span>
                <div>
                  <p className="text-sm font-bold text-[#0b1f3b]">
                    {subscription?.status === "active" ? subscription.package?.name || "Membership" : "No active package"}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {subscription?.status === "active"
                      ? `Expires ${formatDate(subscription.expiration_date)}`
                      : "Choose a package to activate"}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-8 overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_12px_35px_rgba(15,35,75,0.06)]">
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:px-7">
            <div>
              <h2 className="text-xl font-semibold text-[#0b1f3b]">Payment history</h2>
              <p className="mt-1 text-sm text-muted">View submitted payments and their verification status.</p>
            </div>
            <button
              type="button"
              className="rounded-lg border px-3 py-2 text-sm font-semibold"
              onClick={refreshPayments}
              disabled={paymentsLoading}
            >
              <FiRefreshCw className={`mr-2 inline ${paymentsLoading ? "animate-spin" : ""}`} />
              {paymentsLoading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          <div className="p-5 sm:p-7">
          {paymentsLoading && payments.length === 0 ? (
            <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-muted">
              Loading payments...
            </div>
          ) : payments.length === 0 ? (
            <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-muted">
              No payments submitted yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-xs uppercase text-muted">
                    <th className="px-3 py-3">Reference</th>
                    <th className="px-3 py-3">Package</th>
                    <th className="px-3 py-3">Amount</th>
                    <th className="px-3 py-3">Method</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id} className="border-b last:border-0">
                      <td className="px-3 py-4 font-semibold">{payment.reference_code}</td>
                      <td className="px-3 py-4">
                        {payment.package?.name || "Membership package"}
                        {payment.package?.billing_cycle && (
                          <div className="text-xs capitalize text-muted">
                            {payment.package.billing_cycle}
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-4">
                        LKR {Number(payment.amount).toLocaleString()}
                      </td>
                      <td className="px-3 py-4 capitalize">{payment.payment_type}</td>
                      <td className="px-3 py-4">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold ${
                            payment.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : payment.status === "failed"
                                ? "bg-red-100 text-red-700"
                                : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        {payment.created_at_human || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
