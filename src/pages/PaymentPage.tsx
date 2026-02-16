import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import DashboardShell from "../components/DashboardShell";
import { makePayment } from "../api/payment";

type PayMethod = "transaction" | "cash";

export default function PaymentPage() {
  const { user } = useAuth();
  const userId = user?.id;

  const [amount, setAmount] = useState<string>("10000");
  const [method, setMethod] = useState<PayMethod>("transaction");
  const [transactionId, setTransactionId] = useState<string>("");
  const [slip, setSlip] = useState<File | null>(null);

  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    if (!userId) return setMsg("Login required.");
    if (!amount.trim()) return setMsg("Amount is required.");
    if (!slip) return setMsg("Upload slip.");
    if (method === "transaction" && !transactionId.trim())
      return setMsg("Transaction ID required.");

    const fd = new FormData();
    fd.append("user_id", String(userId));
    fd.append("payment_type", "manual");
    fd.append("amount", amount.trim());
    fd.append("payment_method", method);

    // only send transaction_id when needed (cleaner for backend validation)
    if (method === "transaction") fd.append("transaction_id", transactionId.trim());

    // backend key MUST be "avidence" (typo is in backend)
    fd.append("avidence", slip);

    try {
      setLoading(true);
      const res = await makePayment(fd);

      setMsg(res?.message || "Payment submitted.");
      setSlip(null);
      setTransactionId("");
      // keep amount as-is (or reset if you want)
    } catch (err: unknown) {
      const eAny = err as any;
      setMsg(
        eAny?.response?.data?.message ||
          eAny?.message ||
          "Payment failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardShell>
      <div className="container-wide py-8">
        <h1 className="text-3xl font-bold" style={{ color: "var(--color-muted)" }}>
          Payment
        </h1>
        <p className="mt-1 text-muted">
          Upload slip for admin verification.
        </p>

        <div className="mt-6 bg-white border rounded-2xl p-6 shadow-sm max-w-xl">
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
              <label className="block text-sm mb-1">Payment Method</label>
              <select
                className="w-full rounded-xl border px-3 py-3"
                value={method}
                onChange={(e) => setMethod(e.target.value as PayMethod)}
              >
                <option value="transaction">Transaction</option>
                <option value="cash">Cash</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Transaction ID</label>
              <input
                className="w-full rounded-xl border px-3 py-3"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                disabled={method !== "transaction"}
                placeholder={method === "transaction" ? "Enter transaction ID" : "Not required for cash"}
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

            {msg && (
              <div className="rounded-xl border bg-slate-50 px-4 py-3 text-sm">
                {msg}
              </div>
            )}

            <button className="btn-accent disabled:opacity-50" disabled={loading}>
              {loading ? "Submitting..." : "Submit Payment"}
            </button>
          </form>
        </div>
      </div>
    </DashboardShell>
  );
}
