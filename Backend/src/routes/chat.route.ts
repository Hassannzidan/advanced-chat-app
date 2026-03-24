import { Router } from "express";
import { passportAuthenticateJwt } from "../config/passport.config";
import { createChatController, getUsersChatsController, getSingleChatController } from "../controllers/chat.controller";

const chatRoutes = Router()
    .use(passportAuthenticateJwt)
    .post("/create", createChatController)
    .get("/all", getUsersChatsController)
    .get("/:id", getSingleChatController)
    
export default chatRoutes;