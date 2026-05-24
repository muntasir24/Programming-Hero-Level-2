import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { sendError, sendSuccess } from "../../utils/response";
import { authService } from "./auth.service";
import type { SignupBody } from "./auth.type";

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

  const allowedRoles = ["contributor", "maintainer"];
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

export const userController = {
  createUser,
};
