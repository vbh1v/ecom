import { prismaClient } from "./server";

async function main() {
  const product = await prismaClient.product.create({
    data: {
      name: "Cool Blue Tshirt",
      price: 2000,
      description: "Description of cool blue tshirt.",
      categoryId: 1,
      slug: "cool-blue-tshirt",
      imageURL:
        "https://res.cloudinary.com/dexibw60d/image/upload/v1713088195/cedar-brown-2_kawsqh.jpg",
    },
  });
}
main()

