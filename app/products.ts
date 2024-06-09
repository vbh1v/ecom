
import { PrismaClient } from '@prisma/client';
import {Request, Response} from "express" 

const prisma = new PrismaClient()

export const createProduct = async(req:Request, res:Response) => {
    
    const product = await prisma.product.create({
        data: {
            
                "id": 1,
                "name": "Siesta T-shirt Cedar Brown",
                "price": 2000,
                "description": "Description of Siesta T-shirt Cedar Brown",
                "categoryId": 1,
                "slug": "siesta-t-shirt-cedar-brown",
                "imageURL": "https://res.cloudinary.com/dexibw60d/image/upload/v1713088195/cedar-brown-2_kawsqh.jpg"
              

        }
    })

}