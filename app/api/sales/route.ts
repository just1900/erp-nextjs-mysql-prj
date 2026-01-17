import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");

  try {
    const orders = await prisma.salesOrder.findMany({
      where: search ? {
        customer: {
          name: {
            contains: search,
          }
        }
      } : {},
      include: {
        customer: { select: { name: true } },
        items: { include: { product: { select: { name: true } } } },
      },
      orderBy: { orderDate: "desc" },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error("API Error (Sales GET):", error);
    return NextResponse.json({ error: "Failed to fetch sales orders" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerId, items } = body;

    const calculatedTotalAmount = items.reduce((sum: number, item: any) => {
      return sum + (Number(item.quantity) * Number(item.price));
    }, 0);

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.salesOrder.create({
        data: {
          orderNo: `SO-${Date.now()}`,
          customerId,
          totalAmount: calculatedTotalAmount,
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      });

      return newOrder;
    });

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create sales order" }, { status: 500 });
  }
}
