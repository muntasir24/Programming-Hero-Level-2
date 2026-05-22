import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { pool } from "../db";
import type { ROLES } from "../types";



const auth = (...roles: ROLES[]) => {
  console.log(roles)
  return async (req: Request, res: Response, next: NextFunction) => {
    //  console.log(req.headers.authorization)
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const decoded = jwt.verify(
        token as string,
        config.secret as string,
      ) as jwt.JwtPayload;
      // req.user = decoded; // Attach user info to the request object
      const userData = await pool.query(`SELECT * FROM users WHERE email= $1`, [
        decoded.email,
      ]);

      if (userData.rows.length === 0) {
        return res.status(401).json({ message: "User not found" });
      }
      const user = userData.rows[0];
      console.log(user,"decoded user data from token");
      if (!user.is_active) {
        return res.status(403).json({ message: "User is inactive" });
      }
      if (roles.length > 0 && !roles.includes(user.role)) {
        return res.status(403).json({ message: "Forbidden: Insufficient role" });
      } 
      if (user.role === "admin") {
        req.user = user; // Attach user info to the request object
        return next();
      } else if (user.role === "agent") {
        req.user = user; // Attach user info to the request object
        return next();
      } else if (user.role === "user") {
        req.user = user; // Attach user info to the request object
        return next();
      } else {
        return res.status(403).json({ message: "Forbidden: Invalid role" });
      } 
      req.user = user; // Attach user info to the request object
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    next();
  };
};

export default auth;
