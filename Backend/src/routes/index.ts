import { Router } from "express";
import authRouter from "./auth.route";

const router = Router();
router.use("/auth", authRouter);
//chat routes
//user routes

export default router;