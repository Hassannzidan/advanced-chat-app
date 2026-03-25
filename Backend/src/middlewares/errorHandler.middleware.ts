import { ErrorRequestHandler } from "express";
import { HTTPSTATUS } from "../config/http.config";
import { AppError, ErrorCodes } from "../utils/app-error";


export const errorHandler: ErrorRequestHandler = (
    err, 
    req, 
    res, 
    next
): any => {
    console.log(`Error occurred: ${err.message} at ${req.originalUrl} on ${req.method}, path: ${req.path}`);
    
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            message: err.message,
            errorCode: err.errorCode,
            timestamp: new Date().toISOString(),
        });
    }
    
    
    return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
        error: err.message,
        errorCode: ErrorCodes.ERR_INTERNAL,
        timestamp: new Date().toISOString(),
    });
}