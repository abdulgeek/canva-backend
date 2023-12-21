// Importing Libraries
import { Response } from "express";
import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";

// Importing dependencies
import { User } from "../models/User";
import { generateToken } from "../utils/token";
import { Message } from "../utils/helper";
import Api from "../utils/helper";

/**
 * @description - To Register a User
 **/
export const userRegister = expressAsyncHandler(
    async (req: any, res: Response) => {
        let { name, email, password } = req.body;
        try {
            // Check if user already exists
            let user = await User.findOne({ email });
            if (user) {
                return Api.badRequest(res, " ", Message.UserExist);
            }
            email = email.toLowerCase();
            const defaultPassword = bcrypt.hashSync(password);

            user = new User({
                name,
                email,
                password: defaultPassword,
            });
            await user.save();

            Api.created(res, user, Message.CreateAccount);
        } catch (error: any) {
            return Api.serverError(req, res, error, Message.ServerError);
        }
    }
);


/**
 * @description - To Login a User
 **/
export const userLogin = expressAsyncHandler(
    async (req: any, res: Response) => {
        let { email, password } = req.body;
        email = email.toLowerCase();

        try {
            // Check if email and password are provided
            if (!email || !password) {
                return Api.badRequest(
                    res,
                    "Email and password are required",
                    Message.NotFound
                );
            }

            // Check if user exists
            const userFound = await User.findOne({ email }).select('+password'); // Ensure password field is selected

            if (!userFound) {
                return Api.unauthorized(res, "User does not exist", Message.NotFound);
            }

            // Check if password is correct
            const isPasswordCorrect = bcrypt.compareSync(password, userFound.password);

            if (!isPasswordCorrect) {
                return Api.unauthorized(
                    res,
                    "Invalid Login Credentials",
                    Message.NotAuthorized
                );
            }

            Api.ok(
                res,
                {
                    _id: userFound._id,
                    name: userFound.name,
                    email: userFound.email,
                    token: generateToken(req, res, userFound),
                },
                Message.LoginSuccess
            );
        } catch (error: any) {
            return Api.serverError(req, res, error, Message.ServerError);
        }
    }
);

export const fetchUserDetailsOnLoad = expressAsyncHandler(
    async (req: any, res: Response) => {
        const { _id } = req.user;

        try {
            const user = await User.findById(_id)
            if (user) {
                const token = generateToken(req, res, user);
                const result = {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    token
                };
                Api.ok(res, result, Message.Fetched);
            } else {
                Api.notFound(req, res, Message.UserNotFound);
            }
        } catch (error: any) {
            return Api.serverError(req, res, error, Message.ServerError);
        }
    }
);