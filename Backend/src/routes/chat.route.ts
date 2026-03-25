import { Router } from "express";
import { passportAuthenticateJwt } from "../config/passport.config";
import { createChatController, getUsersChatsController, getSingleChatController } from "../controllers/chat.controller";
import { sendMessageController } from "../controllers/message.controller";

const chatRoutes = Router()
    .use(passportAuthenticateJwt)
    .post("/create", createChatController)
    .post("/message/send", sendMessageController)
    .get("/all", getUsersChatsController)
    .get("/:id", getSingleChatController)
    
export default chatRoutes;