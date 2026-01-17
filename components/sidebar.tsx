"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Users,
  Truck,
  Warehouse,
  ShoppingCart,
  BarChart3,
  Settings,
  CreditCard,
  History,
  Tags
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Products", href: "/products", icon: Package },
  { name: "Categories", href: "/categories", icon: Tags },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Suppliers", href: "/suppliers", icon: Truck },
  { name: "Warehouses", href: "/warehouses", icon: Warehouse },
  { name: "Procurement", href: "/procurement", icon: ShoppingCart },
  { name: "Sales", href: "/sales", icon: CreditCard },
  { name: "Inventory", href: "/inventory", icon: History },
  { name: "Finance", href: "/finance", icon: BarChart3 },
  { name: "System", href: "/system", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-slate-200">
      <div className="flex h-16 items-center px-6 border-b border-slate-200">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          ERP System
        </h1>
      </div>
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
              pathname === item.href
                ? "bg-primary/10 text-primary shadow-sm"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <item.icon className={cn("h-5 w-5", pathname === item.href ? "text-primary" : "text-slate-400")} />
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="h-8 w-8 rounded-full bg-slate-200 animate-pulse" />
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-slate-900 truncate">Administrator</p>
            <p className="text-xs text-slate-500 truncate">admin@erp.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
