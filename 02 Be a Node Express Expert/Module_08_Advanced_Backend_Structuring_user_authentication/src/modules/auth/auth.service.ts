import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../../db";
import { config } from "../../config";

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
  const jwtPayload = { userId: user.id, email: user.email }; // Example payload for JWT
  const secretKey = config.secret; // Replace with your actual secret key
  const token = jwt.sign(jwtPayload, secretKey, { expiresIn: "1h" }); // Generate JWT token with expiration

  delete user.password; // Remove password from the user data before returning
return {token}; // Return the generated token or user data as needed
};
export const authService = {
  loginUserInDB,
  // Add more authentication-related service functions here
};
