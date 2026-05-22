import type { Request, Response } from "express";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const data = req.body;
    const { name, email, password, age, role } = data;
    const result = await userService.creaateUserIntoDB({
      name,
      email,
      password,
      age,
      role,
    });

    res.status(201).json({
      message: "Data created successfully",

      data: result.rows[0],
    });
  } catch (error: any) {
    console.error("Error inserting data:", error);

    // Postgres Error Code '23505' means "unique_violation"
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "This email is already registered!",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getAllUsers = async (req: Request, res: Response): Promise<any> => {
  console.log(req.user);
  try {
    const result = await userService.getAllUsersFromDB();
    res.status(200).json({
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getUserById = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.params.id as string;
    const result = await userService.getUserByIdFromDB(userId);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      message: "User retrieved successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const updateUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.params.id as string;
    const { name, email, password, age } = req.body;
    const result = await userService.updateUserIntoDB(userId, {
      name,
      email,
      password,
      age,
    });
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      message: "User updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const deleteUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.params.id as string;
    const result = await userService.deleteUserFromDB(userId);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      message: "User deleted successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const userController = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
