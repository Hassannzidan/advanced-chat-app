import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../utils/app-error";
import { envConfig } from "./env.config";
import { findByIdService } from "../services/user.service";

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => { 
            const token = req.cookies.accessToken;
            if(!token) return new UnauthorizedException("Unauthorized");
            return token;
        }
    ]),
    secretOrKey: envConfig.JWT_SECRET,
    audience: ["user"],
    algorithms: ["HS256"],
}, 
async ({userId}, done) => {
    try {
        const user = userId && (await findByIdService(userId));
        return done(null, user || false);
    } catch (error) {
        return done(error, false);
    }
})
);
export const passportAuthenticateJwt = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("jwt", { session: false }, (err: unknown, user: Express.User | false) => {
        if (err) return next(err);
        if (!user) return next(new UnauthorizedException("Unauthorized"));

        req.user = user;
        return next();
    })(req, res, next);
};