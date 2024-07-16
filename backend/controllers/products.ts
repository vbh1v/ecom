import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { prismaClient } from "./../server";
import { Request, Response } from "express";

export const createProduct = async (req: Request, res: Response) => {
  const product = await prismaClient.product.create({
    data: {
      ...req.body,
    },
  });
  res.json(product);
};

export const updateProduct = async (req: Request, res: Response) => {

  try {
    const product = req.body;
    const updateProduct = await prismaClient.product.update({
      where: {
        id: +req.params.id,
      },
      data: product,
    });

    console.log("Here is the updated product ------->", updateProduct);
    res.json(updateProduct);
  } catch (err) {
    throw new NotFoundException(
      "Product not found.",
      ErrorCode.PRODUCT_NOT_FOUND
    );
  }
};

export const deleteProduct = async (req: Request, res: Response) => {

    try {
        const product = req.body;
        const deleteProduct = await prismaClient.product.delete({
          where: {
            id: +req.params.id,
          }
        });
    
        console.log("Here is the deleted product ------->", deleteProduct);
        res.json(deleteProduct);
      } catch (err) {
        throw new NotFoundException(
          "Product not found.",
          ErrorCode.PRODUCT_NOT_FOUND
        );
      }
};

export const listProduct = async (req: Request, res: Response) => {
    const count = prismaClient.product.count()
    const products = await prismaClient.product.findMany({
        skip: +req.query.skip || 0,
        take: 5
    })
    res.json({
        count, data:products
    })
};

export const getProductById = async (req: Request, res: Response) => {
    try {
        const product = await prismaClient.product.findFirstOrThrow({
          where: {
            id: +req.params.id,
          },
        });
    
        console.log("Here is the asked product ------->", product);
        res.json(product);
      } catch (err) {
        throw new NotFoundException(
          "Product not found.",
          ErrorCode.PRODUCT_NOT_FOUND
        );
      }
};

export const getProductByCategory = async (req: Request, res: Response) => {
  console.log("THIS IS IT ---------->", req.query.category)
  try {
      const product = await prismaClient.category.findMany({
        where: {
          name: req.query.category
        },
        select: {
          products: true,
        }
      });
  
      
      res.json(product[0].products);
    } catch (err) {
      
      throw new NotFoundException(
        "Product not found.",
        ErrorCode.PRODUCT_NOT_FOUND
      );
    }
};

export const getProductBySlug = async (req: Request, res: Response) => {
  
  try {
      const slug = req.query.slug as string;

      if (!slug) {
        return res.status(400).json({ error: "Slug is required." });
      }

      console.log("THIS IS IT ---------->", slug);

      const product = await prismaClient.product.findUnique({
        where: {
          slug: slug
        },
      });
  
      console.log("Here is the asked product ------->", product);
      res.json(product);
    } catch (err) {
      throw new NotFoundException(
        "Product not found.",
        ErrorCode.PRODUCT_NOT_FOUND
      );
    }
};

//http://localhost:3002/product?category=${category}
//http://localhost:3002/product?slug=${slug}

