import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const stocks = await prisma.stock.findMany({
      include: {
        product: { select: { name: true, sku: true } },
        warehouse: { select: { name: true } },
      },
    });
    return NextResponse.json(stocks);
  } catch (error) {
    console.error("API Error (Inventory):", error);
    return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 });
  }
}
