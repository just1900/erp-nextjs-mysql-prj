const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Create Category
  const electronic = await prisma.category.upsert({
    where: { name: "Electronics" },
    update: {},
    create: { name: "Electronics" },
  });

  const daily = await prisma.category.upsert({
    where: { name: "Daily Essentials" },
    update: {},
    create: { name: "Daily Essentials" },
  });

  // Create Warehouse
  const whA = await prisma.warehouse.upsert({
    where: { name: "Main Warehouse A" },
    update: {},
    create: { name: "Main Warehouse A", location: "Beijing" },
  });

  // Create Supplier
  const supplier = await prisma.supplier.create({
    data: {
      name: "Global Tech Inc.",
      contact: "John Doe",
      phone: "123456789",
      email: "contact@globaltech.com",
    },
  });

  // Create Customer
  const customer = await prisma.customer.create({
    data: {
      name: "Smart Retail Corp",
      contact: "Jane Smith",
      phone: "987654321",
      email: "info@smartretail.com",
    },
  });

  // Create Products
  const iphone = await prisma.product.create({
    data: {
      sku: "IPHONE15-PRO",
      name: "iPhone 15 Pro",
      unit: "pcs",
      price: 8999.0,
      categoryId: electronic.id,
    },
  });

  const macbook = await prisma.product.create({
    data: {
      sku: "MBA-M3",
      name: "MacBook Air M3",
      unit: "pcs",
      price: 9999.0,
      categoryId: electronic.id,
    },
  });

  // Initial Stock
  await prisma.stock.create({
    data: {
      productId: iphone.id,
      warehouseId: whA.id,
      quantity: 50,
    },
  });

  console.log("Seeding finished!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
