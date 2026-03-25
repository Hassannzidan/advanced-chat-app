import { NextFunction, Request, Response } from "express";

/**
 * Express route/controller that performs async work and returns a Promise.
 */
type AsyncController = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<any>;

/**
 * Wraps an async Express controller so rejected promises and thrown errors
 * are passed to `next(error)` instead of leaving the request hanging.
 *
 * @param controller - Async route handler to wrap
 * @returns Express middleware that invokes the controller and forwards errors
 */
export const asyncHandler = (controller: AsyncController) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await controller(req, res, next);
        } catch (error) {
            next(error);
        }
    }
}

