import type { NextFunction, Request, Response } from "express";

const auth = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        //  console.log(req.headers.authorization)
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // Here you would typically verify the token and extract user information
        // For example, using JWT:
        // try {
        //     const decoded = jwt.verify(token, "your_secret_key");
        //     req.user = decoded; // Attach user info to the request object
        // } catch (err) {
        //     return res.status(401).json({ message: "Invalid token" });
        // }
        next();
  };
};

export default auth;