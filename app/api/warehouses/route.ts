import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const warehouse = await prisma.warehouse.create({
      data: {
        name: body.name,
        location: body.location,
        description: body.description,
      },
    });
    return NextResponse.json(warehouse);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create warehouse" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const warehouses = await prisma.warehouse.findMany();
    return NextResponse.json(warehouses);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch warehouses" }, { status: 500 });
  }
}
