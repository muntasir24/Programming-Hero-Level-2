import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import type { JwtPayload } from "../modules/auth/auth.type";
import { JWT } from "../utils/jwt";
import { sendError } from "../utils/response";

// Extend Express Request so req.user is available in all controllers
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 1. read token from Authorization header
  const token = req.headers["authorization"];

  if (!token) {
    sendError(res, StatusCodes.UNAUTHORIZED, "Access token is required");
    return;
  }
  try {
    // 2. verify signature + expiry
    const decoded = JWT.verifyAccessToken(token);

    // 3. attach decoded payload to request
    // now req.user.id, req.user.role available in every controller
    req.user = decoded;

    next();
  } catch {
    sendError(res, StatusCodes.UNAUTHORIZED, "Invalid or expired access token");
    return;
  }
};
