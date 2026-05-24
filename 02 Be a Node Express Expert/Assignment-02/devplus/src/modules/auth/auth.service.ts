import { pool } from "../../db";
import type { SignupBody } from "./auth.type";
import bcrypt from 'bcrypt';

const createUserIntoDB = async (body: SignupBody) => {
  const { name, email, password, role } = body;
  const userRole = role ?? "contributor";

  // Check duplicate email
  const existing = await pool.query("SELECT id FROM users WHERE email = $1", [
    email,
  ]);
  if (existing.rows.length > 0) {
    throw { statusCode: 400, message: "Email already registered" };
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert and return user(no password)
  const result = await pool.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, created_at, updated_at`,
    [name, email, hashedPassword, userRole],
  );

  return result.rows[0];
};;

export const authService = {
  createUserIntoDB,
};
