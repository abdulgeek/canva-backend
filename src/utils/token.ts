/** Importing Libraries */
import jwt from "jsonwebtoken";

/** Importing Dependencies **/
import Api, { Message } from "./helper";
import * as dotenv from 'dotenv';
dotenv.config();

/**
 * @description - Function for Generating Token with Mongo User info and Activation Code and Secret Key
**/
export const generateToken = (req: any, res: any, user: any) => {
    const _id = user?._id
    try {
        const payload: Record<string, any> = {
            _id
        };
        const token = jwt.sign(payload, String(process.env.JWT_ACCESS_SECRET_KEY), { expiresIn: "3d" });
        return token
    } catch (error) {
        return Api.serverError(req, res, Message.ServerError, 'Something went wrong!!!')
    }
};