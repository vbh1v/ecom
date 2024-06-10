
import { PrismaClient } from '@prisma/client';
import {Request, Response} from "express" 

const prisma = new PrismaClient()

export const createProduct = async(req:Request, res:Response) => {
    
    const product = await prisma.product.create({
        data: {
            
                
                "name": "Cool Blue Tshirt",
                "price": 2000,
                "description": "Description of cool blue tshirt.",
                "categoryId": 1,
                "slug": "cool-blue-tshirt",
                "imageURL": "https://res.cloudinary.com/dexibw60d/image/upload/v1713088195/cedar-brown-2_kawsqh.jpg"
              

        }
    })

}
