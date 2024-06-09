import jsonwebtoken from "jsonwebtoken";
import { UnauthorisedException } from "./../exceptions/unauthorised-exception";
import { NextFunction, Request, Response } from "express";
import { ErrorCode } from "../exceptions/root";
import { JWT_SECRET } from "../secrets";
import { prismaClient } from "../server";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;

  if (!token) {
    return next(new UnauthorisedException("Unauthorised!", ErrorCode.UNAUTHORISED));
  }
  try {
    const payload = jsonwebtoken.verify(token, JWT_SECRET) as any;
    const user = await prismaClient.user.findFirst({
      where: { id: payload.userId },
    });
    if (!user) {
      return next(new UnauthorisedException("Unauthorised!", ErrorCode.UNAUTHORISED));
    }
    req.user = user;
    next()
    
  } catch (error) {
    return next(new UnauthorisedException("Unauthorised!", ErrorCode.UNAUTHORISED));
  }
};

export default authMiddleware;
