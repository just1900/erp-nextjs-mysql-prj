import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status } = body;

    const order = await prisma.$transaction(async (tx) => {
      const currentOrder = await tx.purchaseOrder.findUnique({
        where: { id },
        include: { items: true },
      });

      if (!currentOrder) throw new Error("Order not found");

      // Update status
      const updatedOrder = await tx.purchaseOrder.update({
        where: { id },
        data: { status },
      });

      // If status is DELIVERED, update stock
      if (status === "DELIVERED") {
        for (const item of currentOrder.items) {
          // Find first warehouse for simplicity in this demo
          const warehouse = await tx.warehouse.findFirst();
          if (!warehouse) throw new Error("No warehouse found");

          await tx.stock.upsert({
            where: {
              productId_warehouseId: {
                productId: item.productId,
                warehouseId: warehouse.id,
              },
            },
            create: {
              productId: item.productId,
              warehouseId: warehouse.id,
              quantity: item.quantity,
            },
            update: {
              quantity: { increment: item.quantity },
            },
          });
        }
      }

      return updatedOrder;
    });

    return NextResponse.json(order);
  } catch (error: any) {
    console.error(error);
    const message = error.message || "Failed to update order status";
    let status = 500;

    if (message.includes("Order not found") || message.includes("No warehouse found")) {
      status = 400;
    }

    return NextResponse.json({ error: message }, { status });
  }
}
