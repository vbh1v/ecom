import { NextFunction, Request, Response } from "express";
import { UnauthorisedException } from "../exceptions/unauthorised-exception";
import { ErrorCode } from "../exceptions/root";

const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user.role == "ADMIN") {
    next();
  } else {
    next(new UnauthorisedException("Unauthorized", ErrorCode.UNAUTHORISED));
  }
};

export default adminMiddleware;
