import { prismaClient } from './../server';
import { Request, Response } from 'express';


export const createProduct = async(req:Request, res:Response) => {
    // console.log(...req.body)
    const product = await prismaClient.product.create({
        data: {
            ...req.body
        }
    })
    res.json(product)
}