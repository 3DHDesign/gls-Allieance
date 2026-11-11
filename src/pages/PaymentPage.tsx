import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import DashboardShell from "../components/DashboardShell";
import { makePayment } from "../api/payment";
import { getMemberByUserId, type MemberRegistration } from "../api/member";
import { payablePayment, type PayablePaymentDetails } from "payable-ipg-js";

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

  useEffect(() => {
    if (!userId) return;
    getMemberByUserId(userId)
      .then((res) => setMember(res.data))
      .catch((error: unknown) => setGatewayMessage(getErrorMessage(error)));
  }, [userId]);

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
    const postalCode = member.zip_code?.trim() || "0000";
    if (postalCode.length > 10) {
      setGatewayMessage("The billing postal code must be 10 characters or fewer.");
      return;
    }
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
    const payment: PayablePaymentDetails = {
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
    };

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

    const fd = new FormData();
    fd.append("user_id", String(userId));
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

        <div className="mt-6 bg-white border rounded-2xl p-6 shadow-sm max-w-xl">
          <h2 className="text-xl font-semibold text-[#0b1f3b]">Pay online</h2>
          <p className="mt-1 text-sm text-muted">
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

        <div className="mt-6 bg-white border rounded-2xl p-6 shadow-sm max-w-xl">
          <h2 className="text-xl font-semibold text-[#0b1f3b]">Manual payment</h2>
          <p className="mt-1 text-sm text-muted">Upload slip for admin verification.</p>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Amount</label>
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
                <div className="mt-2 text-xs text-muted">
                  Selected: {slip.name}
                </div>
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
        </div>
      </div>
    </DashboardShell>
  );
}
