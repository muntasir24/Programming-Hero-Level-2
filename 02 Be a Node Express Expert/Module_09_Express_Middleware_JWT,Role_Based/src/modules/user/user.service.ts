//buinsess logic for user module will be here
//const bcrypt = require("bcrypt");
import bcrypt from "bcryptjs";
import { pool } from "../../db";
import type Iuser from "./user.interface";

//query to insert data into database will be here
const creaateUserIntoDB = async (payload: Iuser) => {
    const { name, email, password, age } = payload; 
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = await bcrypt.hashSync(password, salt);
    const result = await pool.query(
      "INSERT INTO users (name, email, password, age) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, hashPassword, age],
    );
    delete result.rows[0].password; // Remove password from the result before returning
    return result;
}
const getAllUsersFromDB = async() => {
    const result = await pool.query("SELECT * FROM users");
    return result;
}
const getUserByIdFromDB = async (userId: string) => {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);
    return result;
}
const updateUserIntoDB = async (userId: string, payload: Iuser) => {
    const { name, email, password, age } = payload;
    const result = await pool.query(
      "UPDATE users SET name = COALESCE($1, name), email = COALESCE($2, email), password = COALESCE($3, password), age = COALESCE($4, age), updated_at = NOW() WHERE id = $5 RETURNING *",
      [name, email, password, age, userId],
    );
    return result;
}
const deleteUserFromDB = async (userId: string) => {
    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [userId],
    );
    return result;
}   

export const userService = {
    creaateUserIntoDB,
    getAllUsersFromDB,
    getUserByIdFromDB,
    updateUserIntoDB,
    deleteUserFromDB
}   
