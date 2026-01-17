import prisma from "@/lib/prisma";
import { cn } from "@/lib/utils";
import {
  Package,
  ShoppingCart,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Users
} from "lucide-react";

export default async function DashboardPage() {
  const [
    revenueResult,
    procurementResult,
    totalProducts,
    recentSales,
    productsWithStock
  ] = await Promise.all([
    prisma.salesOrder.aggregate({
      _sum: { totalAmount: true },
      where: { status: { not: 'CANCELLED' } }
    }),
    prisma.purchaseOrder.aggregate({
      _sum: { totalAmount: true },
      where: { status: { not: 'CANCELLED' } }
    }),
    prisma.product.count(),
    prisma.salesOrder.findMany({
      take: 5,
      orderBy: { orderDate: 'desc' },
      include: { customer: { select: { name: true } } }
    }),
    prisma.product.findMany({
      include: { stocks: { include: { warehouse: true } } },
    })
  ]);

  const totalRevenue = Number(revenueResult._sum.totalAmount || 0);
  const totalProcurement = Number(procurementResult._sum.totalAmount || 0);

  const lowStockThreshold = 10;
  const lowStockProducts = productsWithStock
    .map(p => ({
      ...p,
      totalStock: p.stocks.reduce((sum, s) => sum + s.quantity, 0)
    }))
    .filter(p => p.totalStock < lowStockThreshold)
    .sort((a, b) => a.totalStock - b.totalStock)
    .slice(0, 5);

  const stockAlertsCount = productsWithStock.filter(p =>
    p.stocks.reduce((sum, s) => sum + s.quantity, 0) < lowStockThreshold
  ).length;

  const stats = [
    {
      name: "Total Revenue",
      value: `¥${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      change: "+0%",
      trend: "up",
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      name: "Procurement Cost",
      value: `¥${totalProcurement.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      change: "+0%",
      trend: "up",
      icon: ShoppingCart,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      name: "Total Products",
      value: totalProducts.toLocaleString(),
      change: "+0",
      trend: "up",
      icon: Package,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      name: "Stock Alerts",
      value: stockAlertsCount.toString(),
      change: "0",
      trend: "down",
      icon: AlertTriangle,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h2>
        <p className="text-slate-500">Welcome back. Here is what's happening today.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="glass rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className={cn("p-2 rounded-xl", stat.bg)}>
                <stat.icon className={cn("h-6 w-6", stat.color)} />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full",
                stat.trend === "up" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
              )}>
                {stat.change}
                {stat.trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-500">{stat.name}</p>
              <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="glass rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">Recent Sales</h3>
            <a href="/sales" className="text-sm font-medium text-primary hover:underline">View all</a>
          </div>
          <div className="space-y-4">
            {recentSales.map((sale) => (
              <div key={sale.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{sale.customer.name}</p>
                    <p className="text-xs text-slate-500">{new Date(sale.orderDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">¥{Number(sale.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                  <p className={cn(
                    "text-xs font-medium",
                    sale.status === 'DELIVERED' ? "text-emerald-600" : "text-amber-600"
                  )}>{sale.status}</p>
                </div>
              </div>
            ))}
            {recentSales.length === 0 && (
              <p className="text-center text-slate-500 py-4">No recent sales</p>
            )}
          </div>
        </div>

        <div className="glass rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">Low Stock Warning</h3>
            <a href="/inventory" className="text-sm font-medium text-primary hover:underline">Manage stock</a>
          </div>
          <div className="space-y-4">
            {lowStockProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center">
                    <Package className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{product.name}</p>
                    <p className="text-xs text-slate-500">SKU: {product.sku}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-rose-600">Remaining: {product.totalStock}</p>
                  <p className="text-xs text-slate-500 font-medium">
                    {product.stocks.length > 0 ? product.stocks[0].warehouse.name : 'No Warehouse'}
                  </p>
                </div>
              </div>
            ))}
            {lowStockProducts.length === 0 && (
              <p className="text-center text-slate-500 py-4">No low stock alerts</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

