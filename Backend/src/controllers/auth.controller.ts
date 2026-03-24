import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { loginSchema, registerSchema } from "../vaildators/auth.vaildator";
import { loginService, registerService } from "../services/auth.service";
import { clearJwtAuthCookie, setJwtAuthCookie } from "../utils/cookie";
import { HTTPSTATUS } from "../config/http.config";
import { clear } from "console";

export const registerController = asyncHandler(
    async (req: Request, res: Response) => {
        const body = registerSchema.parse(req.body);

        const user = await registerService(body);
        const userId = user._id.toString();

        return setJwtAuthCookie({res, userId})
        .status(HTTPSTATUS.CREATED)
        .json({
            status: "success",
            message: "User registered successfully",
            user: user,
        });
    }
)
export const loginController = asyncHandler(
    async (req: Request, res: Response) => {
        const body = loginSchema.parse(req.body);

        const user = await loginService(body);
        const userId = user._id.toString();

        return setJwtAuthCookie({res, userId})
        .status(HTTPSTATUS.OK)
        .json({
            status: "success",
            message: "User logged in successfully",
            user: user,
        });
    }
)
export const logoutController = asyncHandler(
    async (req: Request, res: Response) => {
        return clearJwtAuthCookie(res)
        .status(HTTPSTATUS.OK)
        .json({
            status: "success",
            message: "User logged out successfully",
        });
    }
)
export const authStatusController = asyncHandler(
    async (req: Request, res: Response) => {
        const user = req.user?._id;
        return res.status(HTTPSTATUS.OK).json({
            status: "success",
            message: "User is authenticated",
            user: user,
        });
    }
)
        