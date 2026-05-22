import type { Request, Response } from "express";
import { authService } from "./auth.service";

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUserInDB({ email, password });
    const { refreshToken } = result;
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, //in production, set this to true to ensure cookies are only sent over HTTPS
      sameSite: "lax", // Adjust as needed (e.g., "lax" or "none")
      maxAge: 7 * 24 * 60 * 60 * 1000, // Set cookie expiration (e.g., 7 days)
    });
    // Implement login logic here (e.g., check credentials, generate token)
    res.status(200).json({
      success: true,
      message: "Login successful",
      // token: generatedToken, // Include token if using JWT or similar
      data: result, // Include user data or relevant information as needed
    });
  } catch (error) {
    console.error("Error during login:", error);
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({
      success: false,
      message: message || "Internal server error",
    });
  }
};

const refreshToken = async (req: Request, res: Response) => {
   try {
     const refreshToken = req.cookies.refreshToken; // Assuming the refresh token is sent in cookies
     if (!refreshToken) {
       return res.status(401).json({
         success: false,
         message: "Refresh token not provided",
       });
     }
     // Implement logic to verify the refresh token and generate a new access token
     // For example, you can verify the refresh token, check its validity, and then generate a new access token
     const newAccessToken = authService.generateRefreshToken(
       req.cookies.refreshToken,
     ); // Example function to generate a new access token based on the refresh token
     res.status(200).json({
       success: true,
       message: "access token refreshed successfully",
       token: newAccessToken, // Include the new access token in the response
     });
   } catch (error) {
     console.error("Error during token refresh:", error);
     const message = error instanceof Error ? error.message : String(error);
     res.status(500).json({
       success: false,
       message: message || "Internal server error",
     });
   } 
};

export const authController = {
  loginUser,
  refreshToken,
  // Add more authentication-related controller functions here
};
