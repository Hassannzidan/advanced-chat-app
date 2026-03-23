import cookieParser from "cookie-parser";
import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import { envConfig } from "./config/env.config";
import { HTTPSTATUS } from "./config/http.config";
import { asyncHandler } from "./middlewares/asyncHandler.middleware";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: envConfig.FRONTEND_ORIGIN,
    credentials: true,
}));

app.get("/health", 
    asyncHandler(async (req: Request, res: Response) => {
    res.status(HTTPSTATUS.OK).json({
        status: "OK",
        message: "Server is healthy",
    });
}));

app.listen(envConfig.PORT, () => {
    console.log(`Server is running on port ${envConfig.PORT} in ${envConfig.NODE_ENV} mode`);
});