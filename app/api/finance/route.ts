import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const vouchers = await prisma.voucher.findMany({
      orderBy: { date: "desc" },
    });
    return NextResponse.json(vouchers);
  } catch (error) {
    console.error("API Error (Finance):", error);
    return NextResponse.json({ error: "Failed to fetch vouchers" }, { status: 500 });
  }
}
