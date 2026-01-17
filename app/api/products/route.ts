import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get("categoryId");

  try {
    const products = await prisma.product.findMany({
      where: categoryId ? { categoryId } : {},
      include: { category: true },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("API Error (Products):", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const product = await prisma.product.create({
      data: {
        sku: body.sku,
        name: body.name,
        description: body.description,
        unit: body.unit,
        price: body.price,
        categoryId: body.categoryId,
        ...(body.initialStock && body.warehouseId ? {
          stocks: {
            create: {
              quantity: parseInt(body.initialStock),
              warehouseId: body.warehouseId,
            }
          }
        } : {}),
      },
      include: { category: true, stocks: true }
    });
    return NextResponse.json(product);
  } catch (error) {
    console.error("API Error (Product POST):", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
