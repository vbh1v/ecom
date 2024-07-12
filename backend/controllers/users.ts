import { Request, Response } from "express";
import { AddressSchema, UpdateUserSchema } from "../schema/users";
import { prismaClient } from "../server";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { Address } from "@prisma/client";
import { BadRequestsException } from "../exceptions/bad-requests";

export const addAddress = async (req: Request, res: Response) => {
  AddressSchema.parse(req.body);
  const address = await prismaClient.address.create({
    data: {
      ...req.body,
      userId: req.user.id,
    },
  });
  res.json(address);
};

export const deleteAddress = async (req: Request, res: Response) => {
  try {
    await prismaClient.address.delete({
      where: {
        id: +req.params.id,
      },
    });
    res.json({ success: true });
  } catch (err) {
    throw new NotFoundException(
      "Address not found",
      ErrorCode.ADDRESS_NOT_FOUND
    );
  }
};

export const listAddress = async (req: Request, res: Response) => {
  const addresses = await prismaClient.address.findMany({
    where: {
      userId: req.user.id,
    },
  });
  res.json(addresses);
};

//------------------------------------/-------------------/------------------------------------------

export const updateUser = async (req: Request, res: Response) => {
  const validatedData = UpdateUserSchema.parse(req.body);

  let shippingAddress: Address;
  let billingAddress: Address;

  if (validatedData.defaultShippingAddress) {
    try {
      shippingAddress = await prismaClient.address.findFirstOrThrow({
        where: {
          id: validatedData.defaultShippingAddress,
        },
      });
    } catch (err) {
      throw new NotFoundException(
        "Address not found",
        ErrorCode.ADDRESS_NOT_FOUND
      );
    }
    if (shippingAddress.userId != req.user.id) {
      throw new BadRequestsException(
        "Address does not belong to user!",
        ErrorCode.ADDRESS_DOES_NOT_MATCH
      );
    }
  }

  if (validatedData.defaultBillingAddress) {
    try {
      billingAddress = await prismaClient.address.findFirstOrThrow({
        where: {
          id: validatedData.defaultBillingAddress,
        },
      });
    } catch (err) {
      throw new NotFoundException(
        "Address not found",
        ErrorCode.ADDRESS_NOT_FOUND
      );
    }
    if (billingAddress.userId != req.user.id) {
      throw new BadRequestsException(
        "Address does not belong to user!",
        ErrorCode.ADDRESS_DOES_NOT_MATCH
      );
    }
  }

  const updatedUser = await prismaClient.user.update({
    where: {
      id: req.user.id,
    },
    data: validatedData,
  });
  res.json(updatedUser);
};

export const listUsers = async (req: Request, res: Response) => {
  const users = await prismaClient.user.findMany({
    skip: +req.query.skip || 0,
    take: 5,
  });
  res.json(users);
};

export const getUserById = async (req: Request, res: Response) => {
 
  try {
    const user = await prismaClient.user.findFirstOrThrow({
      where: {
        id: +req.params.id
      },
      include: {
        addresses: true
      }
    })
    res.json(user)
  } catch (err) {
    throw new NotFoundException('User(s) not found!', ErrorCode.USER_NOT_FOUND)
  }
};

export const changeUserRole = async (req: Request, res: Response) => {
  //validation 
  try {
    const user = await prismaClient.user.update({
      where: {
        id: +req.params.id
      },
      data: {
        role: req.body.role
      }
    })
    res.json(user)
  } catch (err) {
    throw new NotFoundException('User(s) not found!', ErrorCode.USER_NOT_FOUND)
  }
};

