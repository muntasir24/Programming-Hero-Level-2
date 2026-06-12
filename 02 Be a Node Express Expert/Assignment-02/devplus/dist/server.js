

   import { createRequire } from 'module';

   const require = createRequire(import.meta.url);

  

// src/app.ts
import express from "express";

// src/middleware/errorHandler.ts
var errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Something went wrong"
  });
};

// src/modules/auth/auth.route.ts
import { Router } from "express";

// src/modules/auth/auth.controller.ts
import { StatusCodes as StatusCodes2 } from "http-status-codes";

// src/types/index.ts
var ROLES = {
  CONTRIBUTOR: "contributor",
  MAINTAINER: "maintainer"
};

// src/utils/response.ts
import { StatusCodes } from "http-status-codes";
var sendSuccess = (res, statusCode, message, data) => {
  const payload = {
    success: true,
    message,
    ...data !== void 0 && { data }
  };
  return res.status(statusCode).json(payload);
};
var sendError = (res, statusCode, message, errors) => {
  const payload = {
    success: false,
    message,
    errors
  };
  return res.status(statusCode).json(payload);
};
var handleError = (res, err) => {
  const error = err;
  if (error.statusCode) {
    sendError(res, error.statusCode, error.message ?? "Something went wrong");
  } else {
    sendError(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Internal server error",
      err
    );
  }
};

// src/modules/auth/auth.service.ts
import bcrypt from "bcrypt";

// src/db/index.ts
import { Pool } from "pg";

// src/config/index.ts
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
var config = {
  port: Number(process.env.PORT),
  db_url: process.env.DATABASE_URL,
  access_secret: process.env.JWT_ACCESS_SECRET,
  refresh_secret: process.env.JWT_REFRESH_SECRET
};

// src/db/index.ts
var pool = new Pool({
  connectionString: config.db_url
});
pool.on("error", (err, client) => {
  console.log("Unexpected error on idle client", err);
});
var initDB = async () => {
  let client;
  try {
    client = await pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'contributor' CHECK (role IN ('contributor', 'maintainer')),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    await client.query(`
      CREATE TABLE  IF NOT EXISTS issues (
  id SERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('bug', 'feature_request')),
  status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
  reporter_id INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
  `);
    console.log("Connected to DB");
  } catch (err) {
    console.log("Error connecting to the database:", err);
  } finally {
    if (client) {
      client.release();
    }
  }
};

// src/utils/jwt.ts
import jwt from "jsonwebtoken";
var Access_secret = config.access_secret;
var Refresh_secret = config.refresh_secret;
var generateAccessToken = (payload) => {
  return jwt.sign(payload, Access_secret, { expiresIn: "30m" });
};
var generateRefreshToken = (payload) => {
  return jwt.sign(payload, Refresh_secret, { expiresIn: "7d" });
};
var verifyAccessToken = (token) => {
  return jwt.verify(token, Access_secret);
};
var verifyRefreshToken = (token) => {
  return jwt.verify(token, Refresh_secret);
};
var JWT = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
};

// src/modules/auth/auth.service.ts
var createUserIntoDB = async (body) => {
  const { name, email, password, role } = body;
  const userRole = role ?? "contributor";
  const existing = await pool.query("SELECT id FROM users WHERE email = $1", [
    email
  ]);
  if (existing.rows.length > 0) {
    throw { statusCode: 400, message: "Email already registered" };
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, created_at, updated_at`,
    [name, email, hashedPassword, userRole]
  );
  return result.rows[0];
};
var loginService = async (body) => {
  const { email, password } = body;
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email
  ]);
  if (result.rows.length === 0) {
    throw { statusCode: 400, message: "Invalid email or password" };
  }
  const user = result.rows[0];
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw { statusCode: 400, message: "Invalid email or password" };
  }
  const payload = {
    id: user.id,
    name: user.name,
    role: user.role
  };
  const accessToken = JWT.generateAccessToken(payload);
  const refreshToken2 = JWT.generateRefreshToken(payload);
  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    created_at: user.created_at,
    updated_at: user.updated_at
  };
  return { accessToken, refreshToken: refreshToken2, user: safeUser };
};
var refreshTokenService = (refreshToken2) => {
  const decoded = JWT.verifyRefreshToken(refreshToken2);
  const newAccessToken = JWT.generateAccessToken({
    id: decoded.id,
    name: decoded.name,
    role: decoded.role
  });
  return newAccessToken;
};
var authService = {
  createUserIntoDB,
  loginService,
  refreshTokenService
};

// src/modules/auth/auth.controller.ts
var createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    sendError(
      res,
      StatusCodes2.BAD_REQUEST,
      "Name, email, and password are required"
    );
    return;
  }
  const allowedRoles = [ROLES.CONTRIBUTOR, ROLES.MAINTAINER];
  if (role && !allowedRoles.includes(role)) {
    sendError(
      res,
      StatusCodes2.BAD_REQUEST,
      "Role must be contributor or maintainer"
    );
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    sendError(res, StatusCodes2.BAD_REQUEST, "Invalid email format");
    return;
  }
  try {
    const result = await authService.createUserIntoDB(req.body);
    sendSuccess(
      res,
      StatusCodes2.CREATED,
      "User registered successfully",
      result
    );
  } catch (err) {
    const error = err;
    if (error.statusCode) {
      sendError(res, error.statusCode, error.message ?? "Something went wrong");
    } else {
      sendError(
        res,
        StatusCodes2.INTERNAL_SERVER_ERROR,
        "Internal server error",
        err
      );
    }
  }
};
var loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    sendError(res, StatusCodes2.BAD_REQUEST, "Email and password are required");
    return;
  }
  try {
    const result = await authService.loginService(req.body);
    const { refreshToken: refreshToken2 } = result;
    res.cookie("refreshToken", refreshToken2, {
      httpOnly: true,
      secure: false,
      // set true in production (HTTPS only)
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1e3
      // 7 days
    });
    sendSuccess(res, StatusCodes2.OK, "Login Successful", {
      token: result.accessToken,
      user: result.user
    });
  } catch (err) {
    const error = err;
    if (error.statusCode) {
      sendError(res, error.statusCode, error.message ?? "Something went wrong");
    } else {
      sendError(
        res,
        StatusCodes2.INTERNAL_SERVER_ERROR,
        "Internal server error",
        err
      );
    }
  }
};
var refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      sendError(res, StatusCodes2.UNAUTHORIZED, "Refresh token not provided");
      return;
    }
    const newAccessToken = authService.refreshTokenService(token);
    sendSuccess(res, StatusCodes2.OK, "Access token refreshed successfully", {
      token: newAccessToken
    });
  } catch (err) {
    const error = err;
    if (error.statusCode) {
      sendError(res, error.statusCode, error.message ?? "Something went wrong");
    } else {
      sendError(
        res,
        StatusCodes2.INTERNAL_SERVER_ERROR,
        "Internal server error",
        err
      );
    }
  }
};
var userController = {
  createUser,
  loginUser,
  refreshToken
};

// src/modules/auth/auth.route.ts
var router = Router();
router.post("/signup", userController.createUser);
router.post("/login", userController.loginUser);
router.post("/refresh", userController.refreshToken);
var authRoute = router;

// src/app.ts
import cookieParser from "cookie-parser";

// src/modules/issues/issues.routes.ts
import { Router as Router2 } from "express";

// src/middleware/auth.ts
import { StatusCodes as StatusCodes3 } from "http-status-codes";
var authenticate = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    sendError(res, StatusCodes3.UNAUTHORIZED, "Access token is required");
    return;
  }
  try {
    const decoded = JWT.verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch {
    sendError(res, StatusCodes3.UNAUTHORIZED, "Invalid or expired access token");
    return;
  }
};

// src/modules/issues/issues.controller.ts
import { StatusCodes as StatusCodes4 } from "http-status-codes";

// src/modules/issues/issues.service.ts
var getReporterById = async (reporterId) => {
  const result = await pool.query(
    "SELECT id, name, role FROM users WHERE id = $1",
    [reporterId]
  );
  return result.rows[0];
};
var createIssueinDB = async (body, reporterId) => {
  const { title, description, type } = body;
  const result = await pool.query(
    `INSERT INTO issues (title, description, type, reporter_id)
     VALUES ($1, $2, $3, $4)
     RETURNING id, title, description, type, status, reporter_id, created_at, updated_at`,
    [title, description, type, reporterId]
  );
  return result.rows[0];
};
var getSingleIssueService = async (id) => {
  const issueResult = await pool.query(
    `SELECT id, title, description, type, status, reporter_id, created_at, updated_at
     FROM issues WHERE id = $1`,
    [id]
  );
  if (issueResult.rows.length === 0) {
    throw { statusCode: 404, message: "Issue not found" };
  }
  const issue = issueResult.rows[0];
  const reporter = await getReporterById(issue.reporter_id);
  return {
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    reporter,
    // nested object instead of reporter_id
    created_at: issue.created_at,
    updated_at: issue.updated_at
  };
};
var updateIssueService = async (id, body, userId, userRole) => {
  const issueResult = await pool.query("SELECT * FROM issues WHERE id = $1", [
    id
  ]);
  if (issueResult.rows.length === 0) {
    throw { statusCode: 404, message: "Issue not found" };
  }
  const issue = issueResult.rows[0];
  if (userRole === ROLES.CONTRIBUTOR) {
    if (issue.reporter_id !== userId) {
      throw {
        statusCode: 403,
        message: "You can only update your own issues"
      };
    }
    if (issue.status !== "open") {
      throw {
        statusCode: 409,
        message: "You can only update issues that are open"
      };
    }
  }
  const updatedTitle = body.title ?? issue.title;
  const updatedDescription = body.description ?? issue.description;
  const updatedType = body.type ?? issue.type;
  const result = await pool.query(
    `UPDATE issues
     SET title = $1, description = $2, type = $3, updated_at = NOW()
     WHERE id = $4
     RETURNING id, title, description, type, status, reporter_id, created_at, updated_at`,
    [updatedTitle, updatedDescription, updatedType, id]
  );
  return result.rows[0];
};
var deleteIssueService = async (id) => {
  const issueResult = await pool.query("SELECT id FROM issues WHERE id = $1", [
    id
  ]);
  if (issueResult.rows.length === 0) {
    throw { statusCode: 404, message: "Issue not found" };
  }
  await pool.query("DELETE FROM issues WHERE id = $1", [id]);
};
var getAllIssuesService = async (query) => {
  const { sort = "newest", type, status } = query;
  const orderClause = sort === "oldest" ? "ORDER BY created_at ASC" : "ORDER BY created_at DESC";
  let issueResult;
  if (type && status) {
    issueResult = await pool.query(
      `SELECT * FROM issues WHERE type = $1 AND status = $2 ${orderClause}`,
      [type, status]
    );
  } else if (type) {
    issueResult = await pool.query(
      `SELECT * FROM issues WHERE type = $1 ${orderClause}`,
      [type]
    );
  } else if (status) {
    issueResult = await pool.query(
      `SELECT * FROM issues WHERE status = $1 ${orderClause}`,
      [status]
    );
  } else {
    issueResult = await pool.query(`SELECT * FROM issues ${orderClause}`, []);
  }
  const issues = issueResult.rows;
  if (issues.length === 0) return [];
  const issuesWithReporters = [];
  for (const issue of issues) {
    const reporterResult = await pool.query(
      `SELECT id, name, role FROM users WHERE id = $1`,
      [issue.reporter_id]
    );
    issuesWithReporters.push({
      id: issue.id,
      title: issue.title,
      description: issue.description,
      type: issue.type,
      status: issue.status,
      reporter: reporterResult.rows[0],
      created_at: issue.created_at,
      updated_at: issue.updated_at
    });
  }
  return issuesWithReporters;
};
var issueService = {
  createIssueinDB,
  getSingleIssueService,
  updateIssueService,
  deleteIssueService,
  getAllIssuesService
};

// src/modules/issues/issues.controller.ts
var createIssue = async (req, res) => {
  const { title, description, type } = req.body;
  if (!title || !description || !type) {
    sendError(
      res,
      StatusCodes4.BAD_REQUEST,
      "Title, description, and type are required"
    );
    return;
  }
  if (title.length > 150) {
    sendError(
      res,
      StatusCodes4.BAD_REQUEST,
      "Title must not exceed 150 characters"
    );
    return;
  }
  if (description.length < 20) {
    sendError(
      res,
      StatusCodes4.BAD_REQUEST,
      "Description must be at least 20 characters"
    );
    return;
  }
  const allowedTypes = ["bug", "feature_request"];
  if (!allowedTypes.includes(type)) {
    sendError(
      res,
      StatusCodes4.BAD_REQUEST,
      "Type must be bug or feature_request"
    );
    return;
  }
  if (!req.user) {
    return sendError(res, StatusCodes4.UNAUTHORIZED, "Unauthorized");
  }
  const reporterId = req.user.id;
  try {
    const newIssue = await issueService.createIssueinDB(req.body, reporterId);
    sendSuccess(
      res,
      StatusCodes4.CREATED,
      "Issue created successfully",
      newIssue
    );
  } catch (err) {
    sendError(
      res,
      StatusCodes4.INTERNAL_SERVER_ERROR,
      "Internal server error",
      err
    );
  }
};
var getValidIssueId = (req, res) => {
  const idParam = req.params.id;
  if (typeof idParam !== "string") {
    sendError(res, StatusCodes4.BAD_REQUEST, "Invalid issue id not string");
    return null;
  }
  const id = parseInt(idParam, 10);
  if (isNaN(id)) {
    sendError(res, StatusCodes4.BAD_REQUEST, "Invalid issue id format");
    return null;
  }
  return id;
};
var getSingleIssue = async (req, res) => {
  const id = getValidIssueId(req, res);
  if (id === null) return;
  try {
    const issue = await issueService.getSingleIssueService(id);
    sendSuccess(res, StatusCodes4.OK, "Issue fetched successfully", issue);
  } catch (err) {
    handleError(res, err);
  }
};
var updateIssue = async (req, res) => {
  const id = getValidIssueId(req, res);
  if (id === null) return;
  const { title, description, type } = req.body;
  if (title !== void 0 && title.length > 150) {
    sendError(
      res,
      StatusCodes4.BAD_REQUEST,
      "Title must not exceed 150 characters"
    );
    return;
  }
  if (description !== void 0 && description.length < 20) {
    sendError(
      res,
      StatusCodes4.BAD_REQUEST,
      "Description must be at least 20 characters"
    );
    return;
  }
  if (type !== void 0 && !["bug", "feature_request"].includes(type)) {
    sendError(
      res,
      StatusCodes4.BAD_REQUEST,
      "Type must be bug or feature_request"
    );
    return;
  }
  try {
    const updatedIssue = await issueService.updateIssueService(
      id,
      req.body,
      req.user.id,
      // who is making the request
      req.user.role
      // their role
    );
    sendSuccess(
      res,
      StatusCodes4.OK,
      "Issue updated successfully",
      updatedIssue
    );
  } catch (err) {
    handleError(res, err);
  }
};
var deleteIssue = async (req, res) => {
  const id = getValidIssueId(req, res);
  if (id === null) return;
  try {
    await issueService.deleteIssueService(id);
    sendSuccess(res, StatusCodes4.OK, "Issue deleted successfully");
  } catch (err) {
    handleError(res, err);
  }
};
var getAllIssues = async (req, res) => {
  const { sort, type, status } = req.query;
  if (sort !== void 0 && sort !== "newest" && sort !== "oldest") {
    sendError(res, StatusCodes4.BAD_REQUEST, "sort must be newest or oldest");
    return;
  }
  if (type !== void 0 && type !== "bug" && type !== "feature_request") {
    sendError(
      res,
      StatusCodes4.BAD_REQUEST,
      "type must be bug or feature_request"
    );
    return;
  }
  const allowedStatuses = ["open", "in_progress", "resolved"];
  if (status !== void 0 && !allowedStatuses.includes(status)) {
    sendError(
      res,
      StatusCodes4.BAD_REQUEST,
      "status must be open, in_progress, or resolved"
    );
    return;
  }
  try {
    const queryParams = {};
    if (sort !== void 0) queryParams.sort = sort;
    if (type !== void 0) queryParams.type = type;
    if (status !== void 0) queryParams.status = status;
    const issues = await issueService.getAllIssuesService(queryParams);
    sendSuccess(res, StatusCodes4.OK, "Issues fetched successfully", issues);
  } catch (err) {
    sendError(
      res,
      StatusCodes4.INTERNAL_SERVER_ERROR,
      "Internal server error",
      err
    );
  }
};
var issuController = {
  createIssue,
  getSingleIssue,
  updateIssue,
  deleteIssue,
  getAllIssues
};

// src/middleware/requireRole.ts
import { StatusCodes as StatusCodes5 } from "http-status-codes";
var requireMaintainer = (req, res, next) => {
  if (!req.user) {
    sendError(res, StatusCodes5.UNAUTHORIZED, "Unauthorized");
    return;
  }
  if (req.user.role !== ROLES.MAINTAINER) {
    sendError(
      res,
      StatusCodes5.FORBIDDEN,
      "Only maintainers can perform this action"
    );
    return;
  }
  next();
};

// src/modules/issues/issues.routes.ts
var router2 = Router2();
router2.post("/issues", authenticate, issuController.createIssue);
router2.get("/issues/:id", issuController.getSingleIssue);
router2.patch("/issues/:id", authenticate, issuController.updateIssue);
router2.delete("/issues/:id", authenticate, requireMaintainer, issuController.deleteIssue);
router2.get("/issues", issuController.getAllIssues);
var issuesRoute = router2;

// src/app.ts
var app = express();
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoute);
app.use("/api", issuesRoute);
app.use(errorHandler);
var app_default = app;

// src/server.ts
var main = async () => {
  try {
    await initDB();
    app_default.listen(config.port, () => {
      console.log(`app listening on port ${config.port}`);
    });
  } catch (err) {
    console.error("Server failed to start", err);
    process.exit(1);
  }
};
main();
//# sourceMappingURL=server.js.map