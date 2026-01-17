const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    const products = await prisma.product.findMany()
    console.log('Success! Products found:', products.length)
  } catch (e) {
    console.error('Connection test failed:', e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
