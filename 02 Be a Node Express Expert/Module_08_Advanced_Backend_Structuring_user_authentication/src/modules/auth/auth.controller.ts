import type { Request, Response } from "express";
import { authService } from "./auth.service";

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUserInDB({ email, password });
    // Implement login logic here (e.g., check credentials, generate token)
    res.status(200).json({
      success: true,
      message: "Login successful",
      // token: generatedToken, // Include token if using JWT or similar
        data: result, // Include user data or relevant information as needed
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const authController = {
  loginUser,
  // Add more authentication-related controller functions here
};
