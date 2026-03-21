import { getEnv } from "../utils/get-env";

export const envConfig: Record<string, string> = {
    NODE_ENV: getEnv("NODE_ENV", "development"),
    PORT: getEnv("PORT", "3000"),
    MONGO_URI: getEnv("MONGO_URI"),
    JWT_SECRET: getEnv("JWT_SECRET"),
    JWT_EXPIRES_IN: getEnv("JWT_EXPIRES_IN", "7d"),
    JWT_COOKIE_EXPIRES_IN: getEnv("JWT_COOKIE_EXPIRES_IN", "30"),
    FRONTEND_ORIGIN: getEnv("FRONTEND_ORIGIN", "http://localhost:5173"),
} as const;