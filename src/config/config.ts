/** Importing Libraries */
import dotenv from "dotenv";

dotenv.config();

const MONGO_OPTIONS = {
	useUnifiedTopology: true,
	useNewUrlParser: true,
	socketTimeoutMS: 30000,
	autoIndex: false,
	retryWrites: false,
};

const MONGO_USERNAME = process.env.MONGO_USERNAME || "";
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "";
const MONGO_DB = process.env.MONGO_DB || "";
const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.20sbpue.mongodb.net/${MONGO_DB}?w=majority`;
const SERVER_PORT = process.env.SERVER_PORT
	? Number(process.env.SERVER_PORT)
	: 5001;

export const config = {
	mongo: {
		username: MONGO_USERNAME,
		password: MONGO_PASSWORD,
		url: MONGO_URL,
		options: MONGO_OPTIONS,
	},
	server: {
		port: SERVER_PORT,
	},
};
