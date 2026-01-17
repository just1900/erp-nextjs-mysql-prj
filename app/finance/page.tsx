"use client";

import { useEffect, useState } from "react";
import { BarChart3, CreditCard, TrendingUp, TrendingDown, DollarSign } from "lucide-react";

interface Voucher {
  id: string;
  voucherNo: string;
  type: string;
  amount: string;
  description: string | null;
  date: string;
}

export default function FinancePage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/finance")
      .then((res) => res.json())
      .then((data) => {
        setVouchers(data);
        setLoading(false);
      });
  }, []);

  const totalReceipts = vouchers
    .filter((v) => v.type === "RECEIPT")
    .reduce((acc, v) => acc + parseFloat(v.amount), 0);

  const totalPayments = vouchers
    .filter((v) => v.type === "PAYMENT")
    .reduce((acc, v) => acc + parseFloat(v.amount), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Finance</h2>
          <p className="text-slate-500">Manage receipts, payments, and financial reports.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="glass rounded-2xl p-6 border border-slate-200 shadow-sm bg-emerald-50/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </div>
            <p className="text-sm font-medium text-slate-600">Total Accounts Receivable</p>
          </div>
          <h3 className="text-3xl font-bold text-emerald-700">¥{totalReceipts.toFixed(2)}</h3>
        </div>
        <div className="glass rounded-2xl p-6 border border-slate-200 shadow-sm bg-rose-50/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-rose-100 rounded-lg">
              <TrendingDown className="h-5 w-5 text-rose-600" />
            </div>
            <p className="text-sm font-medium text-slate-600">Total Accounts Payable</p>
          </div>
          <h3 className="text-3xl font-bold text-rose-700">¥{totalPayments.toFixed(2)}</h3>
        </div>
      </div>

      <div className="glass rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">General Ledger</h3>
          <button className="text-sm font-medium text-primary hover:underline">Download Report</button>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Voucher No.</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Amount (¥)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              [1, 2, 3].map((i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-4"><div className="h-4 w-24 bg-slate-100 rounded" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-32 bg-slate-100 rounded" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-16 bg-slate-100 rounded" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-40 bg-slate-100 rounded" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-20 bg-slate-100 rounded ml-auto" /></td>
                </tr>
              ))
            ) : vouchers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  No vouchers generated yet.
                </td>
              </tr>
            ) : (
              vouchers.map((voucher) => (
                <tr key={voucher.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(voucher.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-slate-900">{voucher.voucherNo}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-xs font-medium",
                      voucher.type === "RECEIPT" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                    )}>
                      {voucher.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{voucher.description}</td>
                  <td className={cn(
                    "px-6 py-4 text-sm font-bold text-right",
                    voucher.type === "RECEIPT" ? "text-emerald-600" : "text-rose-600"
                  )}>
                    {voucher.type === "RECEIPT" ? "+" : "-"}{voucher.amount}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
