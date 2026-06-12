import type { NextFunction, Request, Response } from "express";
import { sendError } from "../utils/response";
import { StatusCodes } from "http-status-codes";
import { ROLES } from "../types";

export const requireMaintainer = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // authenticate must run before this
  // so req.user is already attached at this point
  if (!req.user) {
    sendError(res, StatusCodes.UNAUTHORIZED, "Unauthorized");
    return;
  }
     if (req.user.role !== ROLES.MAINTAINER) {
       sendError(
         res,
         StatusCodes.FORBIDDEN,
         "Only maintainers can perform this action",
       );
       return;
     }

     next();
};