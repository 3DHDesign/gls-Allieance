import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import DashboardShell from "../components/DashboardShell";
import { makePayment } from "../api/payment";

export default function PaymentPage() {
  const { user } = useAuth();
  const userId = user?.id;

  const [amount, setAmount] = useState("10000");
  const [transactionId, setTransactionId] = useState("");
  const [slip, setSlip] = useState<File | null>(null);

  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    // validations
    if (!userId) return setMsg("Login required.");
    if (!amount.trim()) return setMsg("Amount is required.");
    if (!transactionId.trim()) return setMsg("Transaction ID required.");
    if (!slip) return setMsg("Upload slip.");

    // build FormData (keys MUST match Postman)
    const fd = new FormData();
    fd.append("user_id", String(userId));
    fd.append("payment_type", "manual");
    fd.append("amount", amount.trim());
    fd.append("payment_method", "transaction");
    fd.append("transaction_id", transactionId.trim());
    fd.append("avidness", slip); // ✅ EXACT KEY from Postman

    try {
      setLoading(true);
      const res = await makePayment(fd);

      setMsg(res?.message || "Payment submitted.");
      setSlip(null);
      setTransactionId("");
      // optionally reset amount:
      // setAmount("10000");
    } catch (err: any) {
      setMsg(err?.response?.data?.message || err?.message || "Payment failed.");
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
        <p className="mt-1 text-muted">Upload slip for admin verification.</p>

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