const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
  // Create Admin User
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  console.log("Seeding with Admin Email:", adminEmail);

  if (!adminEmail || !adminPassword) {
    console.error("Error: ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables");
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
    },
    create: {
      email: adminEmail,
      name: "Admin User",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

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

  const test = await prisma.category.upsert({
    where: { name: "Test" },
    update: {},
    create: { name: "Test" },
  });

  // Create Warehouse
  const whA = await prisma.warehouse.upsert({
    where: { name: "Main Warehouse A" },
    update: {},
    create: { name: "Main Warehouse A", location: "Beijing" },
  });

  // Create Supplier
  const supplier = await prisma.supplier.upsert({
    where: { name: "Global Tech Inc." },
    update: {},
    create: {
      name: "Global Tech Inc.",
      contact: "John Doe",
      phone: "123456789",
      email: "contact@globaltech.com",
    },
  });

  // Create Customer
  const customer = await prisma.customer.upsert({
    where: { name: "Smart Retail Corp" },
    update: {},
    create: {
      name: "Smart Retail Corp",
      contact: "Jane Smith",
      phone: "987654321",
      email: "info@smartretail.com",
    },
  });

  // Create Products
  const iphone = await prisma.product.upsert({
    where: { sku: "IPHONE15-PRO" },
    update: {},
    create: {
      sku: "IPHONE15-PRO",
      name: "iPhone 15 Pro",
      unit: "pcs",
      price: 8999.0,
      categoryId: electronic.id,
    },
  });

  const macbook = await prisma.product.upsert({
    where: { sku: "MBA-M3" },
    update: {},
    create: {
      sku: "MBA-M3",
      name: "MacBook Air M3",
      unit: "pcs",
      price: 9999.0,
      categoryId: electronic.id,
    },
  });

  // Initial Stock
  await prisma.stock.upsert({
    where: {
      productId_warehouseId: {
        productId: iphone.id,
        warehouseId: whA.id,
      },
    },
    update: {
      quantity: 50,
    },
    create: {
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
