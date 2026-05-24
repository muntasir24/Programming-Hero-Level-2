import jwt from "jsonwebtoken";
import { config } from "../config";
import type { JwtPayload } from "../modules/auth/auth.type";

const Access_secret = config.access_secret as string;
const Refresh_secret = config.refresh_secret as string;

const generateAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, Access_secret, { expiresIn: "15m" });
};

 const generateRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, Refresh_secret, { expiresIn: "7d" });
};

 const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, Access_secret) as JwtPayload;
};

 const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, Refresh_secret) as JwtPayload;
 };

export const JWT={
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
 }