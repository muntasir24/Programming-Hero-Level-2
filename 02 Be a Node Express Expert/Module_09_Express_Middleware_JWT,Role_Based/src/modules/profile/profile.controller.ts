import type { Request, Response } from "express";
import { profileService } from "./profile.service";

const createProfile = async (req: Request, res: Response) => {
    try {
      
        const result = await profileService.createProfileintoDB(req.body);
        res.status(201).json({ message: "Profile created successfully", profile: result });

  } catch (error: any) {
    console.error("Error creating profile:", error);
    const code = error?.code;
    const message = error?.message;
    if (code === "23505") {
      res.status(400).json({ message: "Profile already exists for this user" });
    } else if (message === "User not found") {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const profileController = {
  createProfile,
  // Add more profile-related controller functions here
};
