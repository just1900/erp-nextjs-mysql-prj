"use client";

import { useEffect, useState } from "react";
import { History, Package, Warehouse, AlertTriangle } from "lucide-react";

interface Stock {
  id: string;
  quantity: number;
  product: { name: string; sku: string };
  warehouse: { name: string };
}

export default function InventoryPage() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/inventory")
      .then((res) => res.json())
      .then((data) => {
        setStocks(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Inventory</h2>
          <p className="text-slate-500">Real-time stock levels and warehouse management.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="glass rounded-2xl p-6 border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total Items</p>
          <h3 className="text-2xl font-bold text-slate-900">{stocks.reduce((acc, s) => acc + s.quantity, 0)}</h3>
        </div>
        <div className="glass rounded-2xl p-6 border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Active Warehouses</p>
          <h3 className="text-2xl font-bold text-slate-900">1</h3>
        </div>
        <div className="glass rounded-2xl p-6 border border-rose-100 bg-rose-50/20 shadow-sm">
          <p className="text-sm font-medium text-rose-600">Low Stock Alerts</p>
          <h3 className="text-2xl font-bold text-rose-700">{stocks.filter(s => s.quantity < 10).length}</h3>
        </div>
      </div>

      <div className="glass rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Warehouse</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              [1, 2, 3].map((i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-4"><div className="h-4 w-32 bg-slate-100 rounded" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-20 bg-slate-100 rounded" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-16 bg-slate-100 rounded" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-12 bg-slate-100 rounded" /></td>
                </tr>
              ))
            ) : stocks.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                  No inventory data available.
                </td>
              </tr>
            ) : (
              stocks.map((stock) => (
                <tr key={stock.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{stock.product.name}</div>
                    <div className="text-xs text-slate-500">SKU: {stock.product.sku}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{stock.warehouse.name}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">{stock.quantity}</td>
                  <td className="px-6 py-4">
                    {stock.quantity < 10 ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700">
                        <AlertTriangle className="h-3 w-3" /> Low Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                        Healthy
                      </span>
                    )}
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
