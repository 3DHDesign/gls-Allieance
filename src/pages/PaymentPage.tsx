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
      <div className="container-wide py-8">
        <h1 className="text-3xl font-bold" style={{ color: "var(--color-muted)" }}>
          Payment
        </h1>
        <p className="mt-1 text-muted">Pay securely by card or submit a manual payment slip.</p>

        {packageLoading && (
          <div className="mt-6 rounded-xl border bg-white px-4 py-3 text-sm text-muted">
            Loading membership packages...
          </div>
        )}

        {!packageLoading && packageMessage && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {packageMessage}
          </div>
        )}

        {packages.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-[#0b1f3b]">Choose a package</h2>
            <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                    className={`rounded-2xl border bg-white p-5 text-left shadow-sm transition ${
                      selected
                        ? "border-[var(--color-accent)] ring-2 ring-[var(--color-accent)]"
                        : "border-gray-200 hover:border-[var(--color-accent)]/60"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-lg font-semibold text-[#0b1f3b]">
                          {membershipPackage.name}
                        </div>
                        <div className="mt-1 text-sm capitalize text-muted">
                          {membershipPackage.billing_cycle} membership
                        </div>
                      </div>
                      {selected && (
                        <span className="rounded-full bg-[var(--color-accent)] px-2 py-1 text-xs text-white">
                          Selected
                        </span>
                      )}
                    </div>
                    <div className="mt-4 text-2xl font-bold text-[#0b1f3b]">
                      LKR {Number(membershipPackage.price).toLocaleString()}
                    </div>
                    <div className="mt-1 text-sm text-muted">
                      {membershipPackage.duration} days
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-green-700">Active package</p>
              <p className="mt-2 text-xl font-bold text-[#0b1f3b]">
                {subscription?.status === "active" ? subscription.package?.name || "Membership" : "No active package"}
              </p>
              {subscription?.status === "active" && subscription.package?.billing_cycle && (
                <p className="mt-1 text-sm capitalize text-green-800">
                  {subscription.package.billing_cycle} membership
                </p>
              )}
            </div>
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Expiry date</p>
              <p className="mt-2 text-xl font-bold text-[#0b1f3b]">
                {subscription?.status === "active" ? formatDate(subscription.expiration_date) : "-"}
              </p>
              {subscription?.status === "active" && (
                <p className="mt-1 text-sm text-blue-800">Subscription renewal date</p>
              )}
            </div>
        </div>

        <div className="mt-6 max-w-2xl rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-[#0b1f3b]">Make a payment</h2>
          <p className="mt-1 text-sm text-muted">Choose how you want to pay.</p>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-1" htmlFor="payment-method">
              Payment method
            </label>
            <select
              id="payment-method"
              className="w-full rounded-xl border px-3 py-3"
              value={paymentMethod}
              onChange={(event) =>
                setPaymentMethod(event.target.value as "online" | "manual")
              }
            >
              <option value="online">Pay online</option>
              <option value="manual">Manual payment</option>
            </select>
          </div>

          {paymentMethod === "online" ? (
            <div className="mt-5 border-t pt-5">
              <p className="text-sm text-muted">
                Visa, Mastercard, Amex, Diners and Discover are supported.
              </p>
              <div className="mt-4">
                <label className="block text-sm mb-1">Amount (LKR)</label>
                <input
                  className="w-full rounded-xl border px-3 py-3"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  inputMode="decimal"
                />
              </div>
              {gatewayMessage && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {gatewayMessage}
                </div>
              )}
              <button
                type="button"
                className="btn-accent mt-4 disabled:opacity-50"
                disabled={gatewayLoading}
                onClick={startGatewayPayment}
              >
                {gatewayLoading ? "Connecting to PAYable..." : "Pay securely"}
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-5 space-y-4 border-t pt-5">
              <p className="text-sm text-muted">Upload your payment slip for admin verification.</p>
              <div>
                <label className="block text-sm mb-1">Amount (LKR)</label>
                <input
                  className="w-full rounded-xl border px-3 py-3"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  inputMode="numeric"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Transaction ID</label>
                <input
                  className="w-full rounded-xl border px-3 py-3"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Enter transaction ID"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Slip Upload (PNG/JPG/PDF)</label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  className="w-full rounded-xl border px-3 py-3"
                  onChange={(e) => setSlip(e.target.files?.[0] || null)}
                />
                {slip && (
                  <div className="mt-2 text-xs text-muted">Selected: {slip.name}</div>
                )}
              </div>
              {manualMessage && (
                <div className="rounded-xl border bg-slate-50 px-4 py-3 text-sm">
                  {manualMessage}
                </div>
              )}
              <button className="btn-accent disabled:opacity-50" disabled={manualLoading}>
                {manualLoading ? "Submitting..." : "Submit Payment"}
              </button>
            </form>
          )}
        </div>

        <div className="mt-6 bg-white border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
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
              {paymentsLoading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {paymentsLoading && payments.length === 0 ? (
            <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm text-muted">
              Loading payments...
            </div>
          ) : payments.length === 0 ? (
            <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm text-muted">
              No payments submitted yet.
            </div>
          ) : (
            <div className="mt-4 overflow-x-auto">
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
    </DashboardShell>
  );
}
