import * as dotenv from "dotenv";
dotenv.config();


import { betterAuth } from "better-auth";
import { Pool } from "pg";



export const auth = betterAuth({
    database: new Pool({
        host: 'localhost',
        port: 5432,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
        maxLifetimeSeconds: 60
    }),
    emailAndPassword: {
        enabled: true,
    },
    baseURL: process.env.BETTER_AUTH_URL,
})