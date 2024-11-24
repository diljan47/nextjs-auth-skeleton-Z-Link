"use server";

import { validateUserAction } from "@/app/actions/actions";
import { z } from "zod";
import User from "@/models/User";

const updateProfileSchema = z.object({
  username: z.string(),
  bio: z.string().optional(),
});

export async function updateProfile(data: z.infer<typeof updateProfileSchema>) {
  try {
  
    const verifyData = updateProfileSchema.safeParse(data);
    if (!verifyData.success) {
      return {
        success: false,
        message: "Invalid data",
      };
    }
    const session = await validateUserAction();
    if (!session.success) {
      return {
        success: false,
        status: 401,
        message: "Unauthorized User",
      };
    }

    const user = await User.findById(session.userId);
    if (!user) {
      return {
        success: false,
        status: 404,
        message: "User not found",
      };
    }
    user.name = data.username;
    user.bio = data.bio;
    await user.save();
    return {
      success: true,
      message: "Profile updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Internal Server Error",
    };
  }
}
