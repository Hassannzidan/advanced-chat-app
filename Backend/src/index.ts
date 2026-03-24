import cookieParser from "cookie-parser";
import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import passport from "passport";
import { envConfig } from "./config/env.config";
import { HTTPSTATUS } from "./config/http.config";
import { asyncHandler } from "./middlewares/asyncHandler.middleware";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import connectDatabase from "./config/database.config";
import "./config/passport.config";
import routers from "./routes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.config";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: envConfig.FRONTEND_ORIGIN,
    credentials: true,
}));
app.use(passport.initialize());

app.get("/health", 
    asyncHandler(async (req: Request, res: Response) => {
    res.status(HTTPSTATUS.OK).json({
        status: "OK",
        message: "Server is healthy",
    });
}));

app.use("/api", routers);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
});

app.use(errorHandler)


app.listen(envConfig.PORT, async () => {
    await connectDatabase();
    console.log(`Server is running on port ${envConfig.PORT} in ${envConfig.NODE_ENV} mode`);
    console.log(`Swagger UI: http://localhost:${envConfig.PORT}/api-docs`);
    console.log(`Swagger JSON: http://localhost:${envConfig.PORT}/api-docs.json`);
});