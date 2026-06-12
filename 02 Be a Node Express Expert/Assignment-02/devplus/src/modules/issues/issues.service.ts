import { pool } from "../../db";
import { ROLES, type Role } from "../../types";
import type {
  CreateIssueBody,
  GetAllIssuesQuery,
  IssueWithReporter,
  UpdateIssueBody,
} from "./issues.types";

// ─── helper: fetch reporter separately  ───────────────────
const getReporterById = async (reporterId: number) => {
  const result = await pool.query(
    "SELECT id, name, role FROM users WHERE id = $1",
    [reporterId],
  );
  return result.rows[0];
};

const createIssueinDB = async (
  body: CreateIssueBody,
  reporterId: number, // comes from req.user.id, NOT request body
) => {
  const { title, description, type } = body;
  // Insert issue — status defaults to 'open' in DB
  const result = await pool.query(
    `INSERT INTO issues (title, description, type, reporter_id)
     VALUES ($1, $2, $3, $4)
     RETURNING id, title, description, type, status, reporter_id, created_at, updated_at`,
    [title, description, type, reporterId],
  );

  return result.rows[0];
};

const getSingleIssueService = async (id: number) => {
  // 1. fetch issue by id
  const issueResult = await pool.query(
    `SELECT id, title, description, type, status, reporter_id, created_at, updated_at
     FROM issues WHERE id = $1`,
    [id],
  );
  // 2. if not found throw error — controller will catch it
  if (issueResult.rows.length === 0) {
    throw { statusCode: 404, message: "Issue not found" };
  }
  const issue = issueResult.rows[0];

  // 3. fetch reporter separately
  const reporter = await getReporterById(issue.reporter_id);

  // 4. build response ,replace reporter_id with reporter object
  return {
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    reporter, // nested object instead of reporter_id
    created_at: issue.created_at,
    updated_at: issue.updated_at,
  };
};

//------update isuue---------------
const updateIssueService = async (
  id: number,
  body: UpdateIssueBody,
  userId: number,
  userRole: Role,
) => {
  // 1. check issue exists first
  const issueResult = await pool.query("SELECT * FROM issues WHERE id = $1", [
    id,
  ]);

  if (issueResult.rows.length === 0) {
    throw { statusCode: 404, message: "Issue not found" };
  }
  const issue = issueResult.rows[0];

  //2.permisiion check
  if (userRole === ROLES.CONTRIBUTOR) {
    //contributer only can update their own issue
    if (issue.reporter_id !== userId) {
      throw {
        statusCode: 403,
        message: "You can only update your own issues",
      };
    }
    // contributor can only update if status is open
    if (issue.status !== "open") {
      throw {
        statusCode: 409,
        message: "You can only update issues that are open",
      };
    }
  }
  // maintainer can update ANY issue — no extra checks needed

  // 3. only update fields that were actually sent
  //    if not sent → keep existing value from DB
  const updatedTitle = body.title ?? issue.title;
  const updatedDescription = body.description ?? issue.description;
  const updatedType = body.type ?? issue.type;
  // 4. run the update
  const result = await pool.query(
    `UPDATE issues
     SET title = $1, description = $2, type = $3, updated_at = NOW()
     WHERE id = $4
     RETURNING id, title, description, type, status, reporter_id, created_at, updated_at`,
    [updatedTitle, updatedDescription, updatedType, id],
  );

  return result.rows[0];
};

//---------delete issue-------
const deleteIssueService = async (id: number) => {
  // 1. check issue exists
  const issueResult = await pool.query("SELECT id FROM issues WHERE id = $1", [
    id,
  ]);

  if (issueResult.rows.length === 0) {
    throw { statusCode: 404, message: "Issue not found" };
  }

  // 2. delete it
  await pool.query("DELETE FROM issues WHERE id = $1", [id]);
};

//------query get issue---------

const getAllIssuesService = async (query: GetAllIssuesQuery) => {
  const { sort = "newest", type, status } = query;
  // 1. decide sort order
  const orderClause =
    sort === "oldest" ? "ORDER BY created_at ASC" : "ORDER BY created_at DESC";
  // 2. fetch issues based on which filters were sent
  let issueResult;

  if (type && status) {
    issueResult = await pool.query(
      `SELECT * FROM issues WHERE type = $1 AND status = $2 ${orderClause}`,
      [type, status],
    );
  } else if (type) {
    issueResult = await pool.query(
      `SELECT * FROM issues WHERE type = $1 ${orderClause}`,
      [type],
    );
  } else if (status) {
    issueResult = await pool.query(
      `SELECT * FROM issues WHERE status = $1 ${orderClause}`,
      [status],
    );
  } else {
    issueResult = await pool.query(`SELECT * FROM issues ${orderClause}`, []);
  }

  const issues = issueResult.rows;
  if (issues.length === 0) return [];
  // 3. fetch reporter for each issue, one at a time
  const issuesWithReporters: IssueWithReporter[] = [];

  for (const issue of issues) {
    const reporterResult = await pool.query(
      `SELECT id, name, role FROM users WHERE id = $1`,
      [issue.reporter_id],
    );

    issuesWithReporters.push({
      id: issue.id,
      title: issue.title,
      description: issue.description,
      type: issue.type,
      status: issue.status,
      reporter: reporterResult.rows[0],
      created_at: issue.created_at,
      updated_at: issue.updated_at,
    });
  }
  return issuesWithReporters;
};

export const issueService = {
  createIssueinDB,
  getSingleIssueService,
  updateIssueService,
  deleteIssueService,
  getAllIssuesService
};
