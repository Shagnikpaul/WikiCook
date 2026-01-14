import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./utils/auth";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

var corsOptions = {
    origin: process.env.BETTER_AUTH_URL,
    credentials: true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const app = express();
const port = 8001;
app.use(morgan('dev'))
app.use(cors(corsOptions))
app.all('/api/auth/{*any}', toNodeHandler(auth));
app.get("/health", (_, res) => {
    res.json({ status: "ok" })
})
// Mount express json middleware after Better Auth handler
// or only apply it to routes that don't interact with Better Auth
app.use(express.json());

app.listen(port, () => {
    console.log(`Better Auth app listening on port ${port}`);
});