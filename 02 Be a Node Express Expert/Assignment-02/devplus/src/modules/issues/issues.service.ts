import { pool } from "../../db";
import type { CreateIssueBody } from "./issues.types";


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

export const issueService = {
    createIssueinDB
}