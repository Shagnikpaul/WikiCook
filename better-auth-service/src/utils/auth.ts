import * as dotenv from "dotenv";
dotenv.config();


import { betterAuth } from "better-auth";
import { Pool } from "pg";



export const auth = betterAuth({
    database: new Pool({
        connectionString: process.env.DATABASE_URL,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
        maxLifetimeSeconds: 60,
        ssl: true
    }),
    emailAndPassword: {
        enabled: true,
    },
    baseURL: process.env.BETTER_AUTH_URL,
})