import { prismaClient } from './../server';
import { Request, Response } from 'express';


export const createProduct = async(req:Request, res:Response) => {
    const product = await prismaClient.product.create({
        data: {
            ...req.body
        }
    })
    res.json(product)
}