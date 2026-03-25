import { Request, Response } from "express";
import { HTTPSTATUS } from "../config/http.config";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { sendMessageSchema } from "../vaildators/message.vaildator";
import { UnauthorizedException } from "../utils/app-error";
import { sendMessageService } from "../services/message.service";

export const sendMessageController = asyncHandler(
    async (req: Request, res: Response) => {
        if (!req.user?._id) {
            throw new UnauthorizedException("Unauthorized");
        }
        const userId = req.user._id.toString();
        const body = sendMessageSchema.parse(req.body);
        const result = await sendMessageService(userId, body);
    return res.status(HTTPSTATUS.CREATED).json({
        status: "success",
        messageText: "Message sent successfully",
        ...result,
    });
})