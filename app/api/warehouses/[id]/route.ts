import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const warehouse = await prisma.warehouse.findUnique({
      where: { id: params.id },
    });
    return NextResponse.json(warehouse);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch warehouse" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const warehouse = await prisma.warehouse.update({
      where: { id: params.id },
      data: {
        name: body.name,
        location: body.location,
        description: body.description,
      },
    });
    return NextResponse.json(warehouse);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update warehouse" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.warehouse.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: "Warehouse deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete warehouse" }, { status: 500 });
  }
}
