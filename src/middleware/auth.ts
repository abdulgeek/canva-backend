// Importing Libraries
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";

// Importing Dependencies
import { User } from "../models/User";
import { JwtPayload } from "../interfaces/interfaces";
import Api, { Message } from "../utils/helper";

// Function for Authenticating Middleware on routes so that logged in user can access routes.
export const authMiddleware = expressAsyncHandler(
    async (req: any, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer")) {
            return Api.unauthorized(
                res,
                "No token provided or token does not start with 'Bearer'",
                Message.NotAuthorized
            );
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return Api.unauthorized(
                res,
                "Token not found after 'Bearer'",
                Message.NotAuthorized
            );
        }

        try {
            const decoded = jwt.verify(
                token,
                String(process.env.JWT_ACCESS_SECRET_KEY)
            ) as JwtPayload;

            const user = await User.findById(decoded?._id).select("-password");
            if (!user) {
                return Api.unauthorized(
                    res,
                    "User not found",
                    Message.NotAuthorized
                );
            }

            req.user = user;
            next();
        } catch (error) {
            return Api.unauthorized(
                res,
                "Invalid or expired token",
                Message.NotAuthorized
            );
        }
    }
);
