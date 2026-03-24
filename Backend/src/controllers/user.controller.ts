import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import { getUsersService } from "../services/user.service";
import { UnauthorizedException } from "../utils/app-error";

export const getUserController = asyncHandler(
    async (req: Request, res: Response) => {
        if (!req.user?._id) {
            throw new UnauthorizedException("Unauthorized");
        }

        const userId = req.user._id.toString();
        const users = await getUsersService(userId);
        return res.status(HTTPSTATUS.OK).json({
            status: "success",
            message: "Users fetched successfully",
            users,
        });
    }
)