import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { handleError, sendError, sendSuccess } from "../../utils/response";
import { issueService } from "./issues.service";
import type { CreateIssueBody, UpdateIssueBody } from "./issues.types";

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
    const newIssue = await issueService.createIssueinDB(req.body, reporterId);
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

// Helper function to extract and validate ID
const getValidIssueId = (req: Request, res: Response): number | null => {
  const idParam = req.params.id;
  if (typeof idParam !== "string") {
    sendError(res, StatusCodes.BAD_REQUEST, "Invalid issue id not string");
    return null;
  }
  const id = parseInt(idParam, 10);
  if (isNaN(id)) {
    sendError(res, StatusCodes.BAD_REQUEST, "Invalid issue id format");
    return null;
  }
  return id;
};

// ─── Get Single Issue ─────────────────────────────────────────────────────────
const getSingleIssue = async (req: Request, res: Response) => {
  // :id comes from URL -> GET /api/issues/45
  const id = getValidIssueId(req, res);
  if (id === null) return;

  try {
    const issue = await issueService.getSingleIssueService(id);
    sendSuccess(res, StatusCodes.OK, "Issue fetched successfully", issue);
  } catch (err) {
    handleError(res, err);
  }
};

//---------Update Issue-------------------------------------------
const updateIssue = async (req: Request, res: Response) => {
  const id = getValidIssueId(req, res);
  if (id === null) return;
  const { title, description, type }: UpdateIssueBody = req.body;

  // validate only what was sent
  if (title !== undefined && title.length > 150) {
    sendError(
      res,
      StatusCodes.BAD_REQUEST,
      "Title must not exceed 150 characters",
    );
    return;
  }
  if (description !== undefined && description.length < 20) {
    sendError(
      res,
      StatusCodes.BAD_REQUEST,
      "Description must be at least 20 characters",
    );
    return;
  }
  if (type !== undefined && !["bug", "feature_request"].includes(type)) {
    sendError(
      res,
      StatusCodes.BAD_REQUEST,
      "Type must be bug or feature_request",
    );
    return;
  }

  try {
    const updatedIssue = await issueService.updateIssueService(
      id,
      req.body,
      req.user!.id, // who is making the request
      req.user!.role, // their role
    );
    sendSuccess(
      res,
      StatusCodes.OK,
      "Issue updated successfully",
      updatedIssue,
    );
  } catch (err) {
    handleError(res, err);
  }
};

//-------Delete isuue---------
const deleteIssue = async (req: Request, res: Response) => {
  const id = getValidIssueId(req, res);
  if (id === null) return;
  try {
    await issueService.deleteIssueService(id);
    sendSuccess(res, StatusCodes.OK, "Issue deleted successfully");
  } catch (err) {
    handleError(res, err);
  }
};

const getAllIssues = async (req: Request, res: Response) => {
  // read query params from URL
  // GET /api/issues?sort=oldest&type=bug&status=open
  const { sort, type, status } = req.query;
  // ── validate sort ──────────────────────────────────────────────────
  if (sort !== undefined && sort !== "newest" && sort !== "oldest") {
    sendError(res, StatusCodes.BAD_REQUEST, "sort must be newest or oldest");
    return;
  }
  // ── validate type ──────────────────────────────────────────────────
  if (type !== undefined && type !== "bug" && type !== "feature_request") {
    sendError(
      res,
      StatusCodes.BAD_REQUEST,
      "type must be bug or feature_request",
    );
    return;
  }
  // ── validate status ────────────────────────────────────────────────
  const allowedStatuses = ["open", "in_progress", "resolved"];
  if (status !== undefined && !allowedStatuses.includes(status as string)) {
    sendError(
      res,
      StatusCodes.BAD_REQUEST,
      "status must be open, in_progress, or resolved",
    );
    return;
  }
  try {
    const queryParams: Record<string, any> = {};
    if (sort !== undefined) queryParams.sort = sort;
    if (type !== undefined) queryParams.type = type;
    if (status !== undefined) queryParams.status = status;

    const issues = await issueService.getAllIssuesService(queryParams);

    sendSuccess(res, StatusCodes.OK, "Issues fetched successfully", issues);
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
  getSingleIssue,
  updateIssue,
  deleteIssue,
  getAllIssues,
};
