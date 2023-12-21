/** Importing Libraries */
import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
dotenv.config();

/**
 * @description - Function to Send Email
 **/
export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: String(process.env.EMAIL),
        pass: String(process.env.PASSWORD),
    },
});

