import bcrypt from "bcrypt";
import { pool } from "../../db";
import { JWT } from "../../utils/jwt";
import type { JwtPayload, LoginBody, SignupBody } from "./auth.type";

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
};

const loginService = async (body: LoginBody) => {
  const { email, password } = body;
  // 1. Find user by email
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  if (result.rows.length === 0) {
    throw { statusCode: 400, message: "Invalid email or password" };
  }
  const user = result.rows[0];

  // 2. Compare plain password with hashed password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw { statusCode: 400, message: "Invalid email or password" };
  }

  //email and pass are okay

  // 3. Build JWT payload
  const payload: JwtPayload = {
    id: user.id,
    name: user.name,
    role: user.role,
  };
  // 4. Generate both tokens
  const accessToken = JWT.generateAccessToken(payload);
  const refreshToken = JWT.generateRefreshToken(payload);

 const safeUser = {
   id: user.id,
   name: user.name,
   email: user.email,
   role: user.role,
   created_at: user.created_at,
   updated_at: user.updated_at,
 };
  return { accessToken, refreshToken, user: safeUser };
};

// / Called from refresh route — reads cookie token, issues new access token
export const refreshTokenService = (refreshToken: string): string => {
  // Verify the refresh token (throws if invalid/expired)
  const decoded = JWT.verifyRefreshToken(refreshToken);

  // Issue brand new access token with same payload
  const newAccessToken = JWT.generateAccessToken({
    id:   decoded.id,
    name: decoded.name,
    role: decoded.role,
  });

  return newAccessToken;
};


export const authService = {
  createUserIntoDB,
  loginService,
  refreshTokenService
};
