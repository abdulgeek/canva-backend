/** Importing Libraries */
import express, { Application } from "express";
import * as dotenv from "dotenv";
import http from "http";
import cors from "cors";
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoSanitize from "express-mongo-sanitize";
import compression from "compression";
import * as bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

/** Importing Dependencies */
import dbConnect from "./config/connectionDB";
import Logging from "./utils/logging";
import { config } from "./config/config";
import Api, { Message } from "./utils/helper";
import { morganMiddleware, systemLogs } from "./utils/Logger";
import userRoute from "./routes/user.route";
import designRoute from "./routes/design.route";
import multer from 'multer';
import path from "path";

dotenv.config();
/** DB configuration */
dbConnect();


/** Using Express Server */
const app: Application = express();

const swaggerOptions = {
	swaggerDefinition: {
		openapi: '3.0.0',
		info: {
			title: 'Canva API',
			version: '1.0.0',
			description: 'API documentation for Canva application',
		},
		servers: [
			{
				url: 'http://localhost:5001/api',
			},
		],
	},
	apis: [`${__dirname}/routes/*.ts`]

};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


/** Middleware */
if (process.env.NODE_ENV !== "production") {
	app.use(morgan("dev"));
}
app.use(helmet())
app.use(
	cors({
		origin: (origin, callback) => {
			callback(null, true);
		},
		credentials: true, 
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
	})
);
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
	  cb(null, 'uploads/');
	},
	filename: (req, file, cb) => {
	  cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
	}
  });
  
  const upload = multer({ storage: storage });
app.use(morganMiddleware);
app.use(mongoSanitize());
app.use(compression());
app.use(express.json());
app.use(cookieParser());

// server
const server = http.createServer(app);

/**  Only Start Server if Mongoose Connects */
const StartServer = () => {
	/** Log the request */
	app.use((req, res, next) => {
		/** Log the req */
		Logging.info(
			`Incoming - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`
		);

		res.on("finish", () => {
			/** Log the res */
			Logging.info(
				`Result - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - STATUS: [${res.statusCode}]`
			);
		});
		next();
	});

	app.use(express.urlencoded({ extended: true }));
	app.use(express.json());

	/** Rules of our API */
	app.use((req, res, next) => {
		// Set CORS headers
		res.header("Access-Control-Allow-Origin", req.headers.origin);
		res.header(
			"Access-Control-Allow-Headers",
			"Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials"
		);
		res.header("Access-Control-Allow-Credentials", "true");

		// Handle pre-flight request
		if (req.method === "OPTIONS") {
			res.header(
				"Access-Control-Allow-Methods",
				"PUT, POST, PATCH, DELETE, GET"
			);
			return Api.ok(res, {}, '');
		}

		next();
	});


	/** Health Check */
	app.get("/api/ping", (req, res, next) =>
		Api.ok(res, { hello: "hello word" }, Message.Found)
	);


	/**  Routes */
	app.use("/api/user", userRoute);
	app.use("/api/design", designRoute);

	/** Error handling */
	app.use((req, res, next) => {
		Logging.error(`That route does not exist - ${req.originalUrl}`);
		Api.notFound(req, res, `That route does not exist - ${req.originalUrl}`);
	});

	server
		.listen(config.server.port, () =>
			Logging.info(`Server is running on port ${config.server.port}`)
		);
	systemLogs.info(
		`Server running in ${process.env.NODE_ENV} mode on port ${config.server.port}`
	);
};

StartServer();
