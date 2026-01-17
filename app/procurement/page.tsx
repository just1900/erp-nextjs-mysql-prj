"use client";

import { useEffect, useState } from "react";
import { ShoppingCart, Plus, Loader2, CheckCircle, Clock, Trash2, Search, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/modal";

interface Product {
  id: string;
  name: string;
  price: string;
}

interface Supplier {
  id: string;
  name: string;
}

interface PurchaseOrder {
  id: string;
  orderNo: string;
  supplier: { name: string };
  status: string;
  totalAmount: string;
  orderDate: string;
}

export default function ProcurementPage() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [items, setItems] = useState<{ productId: string; quantity: number; price: number }[]>([]);
  const [search, setSearch] = useState("");

  const fetchOrders = async (searchTerm = "") => {
    const res = await fetch(`/api/procurement${searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : ""}`);
    const data = await res.json();
    setOrders(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    fetchOrders(search);
  };

  const handleExport = () => {
    const headers = ["Order No", "Supplier", "Date", "Status", "Total Amount"];
    const csvContent = [
      headers.join(","),
      ...orders.map(order => [
        order.orderNo,
        order.supplier.name,
        new Date(order.orderDate).toLocaleDateString(),
        order.status,
        order.totalAmount
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `purchase_orders_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fetchStaticData = async () => {
    const [pRes, sRes] = await Promise.all([
      fetch("/api/products"),
      fetch("/api/suppliers"),
    ]);
    setProducts(await pRes.json());
    setSuppliers(await sRes.json());
  };

  useEffect(() => {
    fetchOrders();
    fetchStaticData();
  }, []);

  const handleAddItem = () => {
    setItems([...items, { productId: "", quantity: 1, price: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    if (field === "productId") {
      const prod = products.find(p => p.id === value);
      if (prod) newItems[index].price = parseFloat(prod.price);
    }
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (items.length === 0) return alert("Add at least one item");
    setFormLoading(true);
    const formData = new FormData(e.currentTarget);
    const payload = {
      supplierId: formData.get("supplierId"),
      warehouseId: "cm5vj4p5e0000vj4p5e000000", // Default warehouse for now or fetch list
      items: items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    try {
      // First, get warehouses to ensure we have a valid ID if the hardcoded one fails
      const wRes = await fetch("/api/warehouses");
      const warehouses = await wRes.json();
      if (warehouses.length > 0) payload.warehouseId = warehouses[0].id;

      const res = await fetch("/api/procurement", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        setIsModalOpen(false);
        setItems([]);
        fetchOrders();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/procurement/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) fetchOrders();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Procurement</h2>
          <p className="text-slate-500">Manage purchase orders and supplier relations.</p>
        </div>
        <div className="flex items-center gap-3">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search supplier..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-64 shadow-sm"
            />
          </form>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-white text-slate-600 border border-slate-200 px-4 py-2 rounded-xl font-medium hover:bg-slate-50 transition-all shadow-sm"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl font-medium hover:bg-primary/90 transition-all shadow-sm"
          >
            <Plus className="h-4 w-4" />
            New Purchase Order
          </button>
        </div>
      </div>

      <div className="glass rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Order No.</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Supplier</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Amount</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              [1, 2, 3].map((i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={6} className="px-6 py-4"><div className="h-4 w-full bg-slate-100 rounded" /></td>
                </tr>
              ))
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                  No purchase orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm text-slate-900">{order.orderNo}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{order.supplier.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium",
                      order.status === "DELIVERED" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"
                    )}>
                      {order.status === "DELIVERED" ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900 text-right">¥{order.totalAmount}</td>
                  <td className="px-6 py-4 text-right">
                    {order.status !== "DELIVERED" && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, "DELIVERED")}
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        Mark Delivered
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Purchase Order">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Supplier</label>
            <select name="supplierId" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" required>
              <option value="">Select Supplier</option>
              {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-slate-700">Items</label>
              <button type="button" onClick={handleAddItem} className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
                <Plus className="h-3 w-3" /> Add Item
              </button>
            </div>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {items.map((item, index) => (
                <div key={index} className="flex gap-2 items-end bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Product</label>
                    <select
                      value={item.productId}
                      onChange={(e) => handleItemChange(index, "productId", e.target.value)}
                      className="w-full bg-white px-2 py-1 text-sm border border-slate-200 rounded-md"
                      required
                    >
                      <option value="">Select Product</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="w-20 space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Qty</label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value))}
                      className="w-full bg-white px-2 py-1 text-sm border border-slate-200 rounded-md"
                      required
                    />
                  </div>
                  <div className="w-24 space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Price</label>
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => handleItemChange(index, "price", parseFloat(e.target.value))}
                      className="w-full bg-white px-2 py-1 text-sm border border-slate-200 rounded-md"
                      required
                    />
                  </div>
                  <button type="button" onClick={() => handleRemoveItem(index)} className="p-1 px-2 text-rose-500 hover:bg-rose-50 rounded-md">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-100">
             <div className="flex-1 pt-2 font-bold text-slate-900">
              Total: ¥{items.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2)}
            </div>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-bold flex items-center gap-2"
            >
              {formLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              Create PO
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
