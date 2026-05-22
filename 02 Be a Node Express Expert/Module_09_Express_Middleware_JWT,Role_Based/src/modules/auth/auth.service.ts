import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../../config";
import { pool } from "../../db";

const loginUserInDB = async (payload: { email: string; password: string }) => {
  // Implement database logic to check user credentials and return user data if valid
  // For example, you can query the users table to find a user with the given email and compare the password
  // Return user data if credentials are valid, otherwise return null or throw an error
  const { email, password } = payload;
  console.log(email);
  // Example query to check user credentials (you should implement proper password hashing and comparison)

  //1.check if the user ezists with
  //2.compare the password with the hashed password in the database
  //3.return user data if valid, otherwise throw an error or return null
  // return null; // Placeholder return value, replace with actual user data if credentials are valid
  const userData = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  if (userData.rows.length === 0) {
    throw new Error("Invalid email or password");
  }
  const user = userData.rows[0];
  const matchedPassword = await bcrypt.compare(password, user.password);
  if (!matchedPassword) {
    throw new Error("Invalid email or password");
  }
  //generate token logic can be implemented here if using JWT or similar authentication mechanism
  const jwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  }; // Example payload for JWT
  const secretKey = config.secret; // Replace with your actual secret key
  const refreshTokenSecretKey = config.refreshTokenSecret; // Replace with your actual refresh token secret key
  const token = jwt.sign(jwtPayload, secretKey, { expiresIn: "1d" }); // Generate JWT token with expiration
  const refreshToken= jwt.sign(jwtPayload, refreshTokenSecretKey, { expiresIn: "7d" }); // Generate refresh token with longer expiration
  delete user.password; // Remove password from the user data before returning
  return { token, refreshToken }; // Return the generated token or user data as needed
};

const generateRefreshToken = async (token: string) => {
    const decoded = jwt.verify(
      token as string,
      config.refreshTokenSecret as string,
    ) as jwt.JwtPayload;
 const userData=await pool.query("SELECT * FROM users WHERE email = $1", [
decoded.email,
 ]);
  const user = userData.rows[0];
  if (userData.rows.length === 0) {
    throw new Error("User not found");
  
  }
  if (!user.is_active) {
    throw new Error("User is inactive");
  }
  const jwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  }; // Example payload for JWT
  const secretKey = config.secret; // Replace with your actual secret key
  const newAccessToken = jwt.sign(jwtPayload, secretKey, { expiresIn: "1d" }); // Generate new JWT token with expiration
  return newAccessToken; // Return the new access token
  // so our step was
  //1. verify the refresh token to ensure it's valid and not expired
  //2. if valid, extract user information from the refresh token (e.g., user ID, email, role)
  //3. check if the user still exists and is active in the database
  //4. if the user is valid and active, generate a new access token (JWT) with the same user information and return it to the client
  
 
};
export const authService = {
  loginUserInDB,
  generateRefreshToken,
  // Add more authentication-related service functions here
};
