import { Router } from "express";
import { logoutController, loginController, registerController, authStatusController } from "../controllers/auth.controller";
import { passportAuthenticateJwt } from "../config/passport.config";

const authRouter = Router()
    .post("/register", registerController)
    .post("/login", loginController)
    .post("/logout", logoutController)
    .get("/status", passportAuthenticateJwt, authStatusController);
    
export default authRouter;