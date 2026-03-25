import jwt from "jsonwebtoken";
import type { Response } from "express";
import { envConfig } from "../config/env.config";

type Cookie = {
    res: Response;
    userId: string; 
}

export const setJwtAuthCookie = ({res, userId}: Cookie) => {
   const payload = { userId };
   const expiresIn = envConfig.JWT_EXPIRES_IN;
   const token = jwt.sign(payload, envConfig.JWT_SECRET, { 
    audience:["user"],
    expiresIn: expiresIn || "7d",
 });

 return res.cookie("accessToken", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: envConfig.NODE_ENV === "production" ? true : false,
    sameSite: envConfig.NODE_ENV === "production" ? "strict" : "lax",
  });
}

export const clearJwtAuthCookie = (res: Response) => 
 res.clearCookie("accessToken", { path: "/" });
