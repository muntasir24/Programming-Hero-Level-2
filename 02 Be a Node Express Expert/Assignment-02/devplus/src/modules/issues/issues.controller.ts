import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { sendError, sendSuccess } from "../../utils/response";
import type { CreateIssueBody } from "./issues.types";
import { issueService } from "./issues.service";

const createIssue = async (req: Request, res: Response) => {
  const { title, description, type }: CreateIssueBody = req.body;

  //    Validation (controller's job) ---

  // 1. check required fields exist
  if (!title || !description || !type) {
    sendError(
      res,
      StatusCodes.BAD_REQUEST,
      "Title, description, and type are required",
    );
    return;
  }

  // 2. title max 150 characters
  if (title.length > 150) {
    sendError(
      res,
      StatusCodes.BAD_REQUEST,
      "Title must not exceed 150 characters",
    );
    return;
  }
  // 3. description min 20 characters
  if (description.length < 20) {
    sendError(
      res,
      StatusCodes.BAD_REQUEST,
      "Description must be at least 20 characters",
    );
    return;
  }

  // 4. type must be bug or feature_request
  const allowedTypes = ["bug", "feature_request"];
  if (!allowedTypes.includes(type)) {
    sendError(
      res,
      StatusCodes.BAD_REQUEST,
      "Type must be bug or feature_request",
    );
    return;
  }

  // --- Get reporter_id from JWT (NOT from request body) ---
  // authenticate middleware already verified the token
  // and attached decoded payload to req.user
  if (!req.user) {
    return sendError(res, StatusCodes.UNAUTHORIZED, "Unauthorized");
  }
  const reporterId = req.user.id;

  try {
    const newIssue = await issueService.createIssueinDB(
      req.body,
      reporterId,
    );
    sendSuccess(
      res,
      StatusCodes.CREATED,
      "Issue created successfully",
      newIssue,
    );
  } catch (err: unknown) {
    sendError(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Internal server error",
      err,
    );
  }
};

export const issuController = {
  createIssue,
};
