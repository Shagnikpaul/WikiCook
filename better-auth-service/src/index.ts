import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./utils/auth";
import morgan from "morgan";


const app = express();
const port = 8000;
app.use(morgan('dev'))
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