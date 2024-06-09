import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.product.createMany({
    data: [
        {
            "name": "Siesta T-shirt Cedar Brown",
            "price": 2000,
            "description": "Description of Siesta T-shirt Cedar Brown",
            "categoryId": 1,
            "slug": "siesta-t-shirt-cedar-brown",
            "imageURL": "https://res.cloudinary.com/dexibw60d/image/upload/v1713088195/cedar-brown-2_kawsqh.jpg"
          },
    ]
     
  })
}

main()
  .then(async () => {
    console.log("done");
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })