import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import { UnauthorizedException } from "../utils/app-error";
import { chatIdSchema, createChatSchema } from "../vaildators/chat.vaildator";
import { createChatService, getSingleChatService, getUsersChatsService } from "../services/chat.service";

export const createChatController = asyncHandler(
    async (req: Request, res: Response) => {
        if (!req.user?._id) {
            throw new UnauthorizedException("Unauthorized");
        }

        const userId = req.user._id.toString();

        const body = createChatSchema.parse(req.body);
        const chat = await createChatService(userId, body);

        return res.status(HTTPSTATUS.OK).json({
            status: "success",
            message: "Chat created or retrieved successfully",
            chat,
        });
    }
)

export const getUsersChatsController = asyncHandler(
    async (req: Request, res: Response) => {
        if (!req.user?._id) {
            throw new UnauthorizedException("Unauthorized");
        }
        const userId = req.user._id.toString();
        const chats = await getUsersChatsService(userId);
        return res.status(HTTPSTATUS.OK).json({
            status: "success",
            message: "Users chats fetched successfully",
            chats,
        });
    }
)

export const getSingleChatController = asyncHandler(
    async (req: Request, res: Response) => {
        if (!req.user?._id) {
            throw new UnauthorizedException("Unauthorized");
        }
        const userId = req.user._id.toString();

        const { id } = chatIdSchema.parse(req.params);
        const { chat, messages } = await getSingleChatService(userId, id);
        return res.status(HTTPSTATUS.OK).json({
            status: "success",
            message: "Chat fetched successfully",
            chat,
            messages,
        });
    }
)