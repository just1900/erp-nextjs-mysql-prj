import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { status } = await request.json();

    const order = await prisma.$transaction(async (tx) => {
      const currentOrder = await tx.salesOrder.findUnique({
        where: { id },
        include: {
          items: {
            include: { product: true }
          }
        },
      });

      if (!currentOrder) {
        throw new Error("Order not found");
      }

      // If status is SHIPPED, check and decrement stock
      if (status === "SHIPPED") {
        for (const item of currentOrder.items) {
          const warehouse = await tx.warehouse.findFirst();
          if (!warehouse) {
            throw new Error("No warehouse found");
          }

          const stock = await tx.stock.findUnique({
            where: {
              productId_warehouseId: {
                productId: item.productId,
                warehouseId: warehouse.id,
              },
            },
          });

          if (!stock || stock.quantity < item.quantity) {
            throw new Error(`Insufficient stock for product "${item.product.name}" (Required: ${item.quantity}, Available: ${stock?.quantity || 0})`);
          }

          await tx.stock.update({
            where: { id: stock.id },
            data: { quantity: { decrement: item.quantity } },
          });
        }
      }

      const updatedOrder = await tx.salesOrder.update({
        where: { id },
        data: { status },
      });

      // Generate financial voucher if status is DELIVERED
      if (status === "DELIVERED") {
        await tx.voucher.create({
          data: {
            voucherNo: `V-${Date.now()}`,
            type: "RECEIPT",
            amount: currentOrder.totalAmount,
            description: `Sales Payment for Order ${currentOrder.orderNo}`,
          },
        });

        // Update customer balance/credit? (Optional for this scope)
      }

      return updatedOrder;
    });

    return NextResponse.json(order);
  } catch (error: any) {
    console.error(error);
    const message = error.message || "Failed to update order";
    let status = 500;

    if (message.includes("Insufficient stock") || message.includes("Order not found") || message.includes("No warehouse found")) {
      status = 400;
    }

    return NextResponse.json({ error: message }, { status });
  }
}
