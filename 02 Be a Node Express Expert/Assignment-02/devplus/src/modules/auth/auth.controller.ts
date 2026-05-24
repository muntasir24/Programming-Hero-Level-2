import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ROLES } from "../../types";
import { sendError, sendSuccess } from "../../utils/response";
import { authService } from "./auth.service";
import type { LoginBody, SignupBody } from "./auth.type";

const createUser = async (req: Request, res: Response) => {
  const { name, email, password, role }: SignupBody = req.body;

  // --- High level Validation (controller's job) ---
  if (!name || !email || !password) {
    sendError(
      res,
      StatusCodes.BAD_REQUEST,
      "Name, email, and password are required",
    );
    return;
  }

  const allowedRoles = [ROLES.CONTRIBUTOR, ROLES.MAINTAINER];
  if (role && !allowedRoles.includes(role)) {
    sendError(
      res,
      StatusCodes.BAD_REQUEST,
      "Role must be contributor or maintainer",
    );
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    sendError(res, StatusCodes.BAD_REQUEST, "Invalid email format");
    return;
  }

  try {
    const result = await authService.createUserIntoDB(req.body);
    sendSuccess(
      res,
      StatusCodes.CREATED,
      "User registered successfully",
      result,
    );
  } catch (err: unknown) {
    const error = err as { statusCode?: number; message?: string };
    if (error.statusCode) {
      // Known business logic error thrown from service
      sendError(res, error.statusCode, error.message ?? "Something went wrong");
    } else {
      // Unexpected DB or runtime error
      sendError(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Internal server error",
        err,
      );
    }
  }
};

const loginUser = async (req: Request, res: Response) => {
  const { email, password }: LoginBody = req.body;
  // Validate required fields
  if (!email || !password) {
    sendError(res, StatusCodes.BAD_REQUEST, "Email and password are required");
    return;
  }
  try {
    const result = await authService.loginService(req.body);
    const { refreshToken } = result;
    // Store refresh token in HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // set true in production (HTTPS only)
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    sendSuccess(res, StatusCodes.OK, "Login Successful", {
      token: result.accessToken,
      user: result.user,
    });
  } catch (err: unknown) {
    const error = err as { statusCode?: number; message?: string };
    if (error.statusCode) {
      sendError(res, error.statusCode, error.message ?? "Something went wrong");
    } else {
      sendError(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Internal server error",
        err,
      );
    }
  }
};

const refreshToken = async (req: Request, res: Response) => {
  try {
    // Read refresh token from cookie (set during login)
    const token: string | undefined = req.cookies.refreshToken;

    if (!token) {
      sendError(res, StatusCodes.UNAUTHORIZED, "Refresh token not provided");
      return;
    }

    // Verify and generate new access token cause previous acces token is expires and client want new access token
    const newAccessToken = authService.refreshTokenService(token);
    sendSuccess(res, StatusCodes.OK, "Access token refreshed successfully", {
      token: newAccessToken,
    });
  } catch (err: unknown) {
    const error = err as { statusCode?: number; message?: string };
    if (error.statusCode) {
      sendError(res, error.statusCode, error.message ?? "Something went wrong");
    } else {
      sendError(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Internal server error",
        err,
      );
    }
  }
};

export const userController = {
  createUser,
  loginUser,
  refreshToken,
};
