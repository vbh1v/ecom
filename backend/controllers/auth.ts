import { NextFunction, Request, Response } from "express";
import { prismaClient } from "../server";
import { hashSync, compareSync } from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { BadRequestsException } from "../exceptions/bad-requests";
import { ErrorCode } from "../exceptions/root";
import { SignupSchema } from "../schema/users";
import { NotFoundException } from "../exceptions/not-found";

export const signup = async (req: Request, res:Response, next: NextFunction) => {
    SignupSchema.parse(req.body)
    const {email, password, name} = req.body;

    let user = await prismaClient.user.findFirst({where: {email}})
    if (user) {
        new BadRequestsException('User already exists!', ErrorCode.USER_ALREADY_EXISTS)
    }
    user = await prismaClient.user.create({
        data:{
            name,
            email,
            password: hashSync(password, 10)
        }
    })
    res.json(user)
    
}

export const login = async (req: Request, res:Response) => {
    const {email, password} = req.body;

    let user = await prismaClient.user.findFirst({where: {email}})
    if (!user) {
        throw new NotFoundException('User not found.', ErrorCode.USER_NOT_FOUND)
    }
    if(!compareSync(password, user.password)) {
        throw new BadRequestsException('Incorrect password', ErrorCode.INCORRECT_PASSWORD)
    }
    const token = jsonwebtoken.sign({
        userId: user.id
    },JWT_SECRET)


    res.json({user, token})
}

// /me ->  return the logged in user
export const me = async (req: Request, res:Response) => {

    res.json(req.user)
}