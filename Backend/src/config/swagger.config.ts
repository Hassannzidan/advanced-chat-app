import { envConfig } from "./env.config";

const port = String(envConfig.PORT || "3000");
const serverBaseUrl = `http://localhost:${port}`;

export const swaggerSpec = {
    openapi: "3.0.3",
    info: {
        title: "Advanced Chat App API",
        version: "1.0.0",
        description: "API documentation for authentication and health routes.",
    },
    servers: [
        {
            url: serverBaseUrl,
            description: "Local development server",
        },
    ],
    tags: [
        { name: "Health", description: "Service health checks" },
        { name: "Auth", description: "Authentication endpoints" },
    ],
    components: {
        securitySchemes: {
            cookieAuth: {
                type: "apiKey",
                in: "cookie",
                name: "jwt",
                description: "JWT auth cookie set after login/register.",
            },
        },
        schemas: {
            User: {
                type: "object",
                properties: {
                    _id: { type: "string", example: "65dff5fd8d2bfc2212f50f58" },
                    name: { type: "string", example: "John Doe" },
                    email: { type: "string", format: "email", example: "john@example.com" },
                    profilePicture: {
                        type: "string",
                        nullable: true,
                        example: "https://cdn.example.com/avatars/john.png",
                    },
                    isVerified: { type: "boolean", example: true },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" },
                },
            },
            RegisterRequest: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                    name: { type: "string", minLength: 2, example: "John Doe" },
                    email: { type: "string", format: "email", example: "john@example.com" },
                    password: { type: "string", minLength: 6, example: "StrongPass123" },
                },
            },
            LoginRequest: {
                type: "object",
                required: ["email", "password"],
                properties: {
                    email: { type: "string", format: "email", example: "john@example.com" },
                    password: { type: "string", minLength: 6, example: "StrongPass123" },
                },
            },
            SuccessAuthResponse: {
                type: "object",
                properties: {
                    status: { type: "string", example: "success" },
                    message: { type: "string" },
                    user: { $ref: "#/components/schemas/User" },
                },
            },
            LogoutResponse: {
                type: "object",
                properties: {
                    status: { type: "string", example: "success" },
                    message: { type: "string", example: "User logged out successfully" },
                },
            },
            AuthStatusResponse: {
                type: "object",
                properties: {
                    status: { type: "string", example: "success" },
                    message: { type: "string", example: "User is authenticated" },
                    user: { type: "string", example: "65dff5fd8d2bfc2212f50f58" },
                },
            },
            ErrorResponse: {
                type: "object",
                properties: {
                    success: { type: "boolean", example: false },
                    message: { type: "string", example: "Validation failed" },
                    errors: {
                        type: "array",
                        items: { type: "string" },
                        example: ["Email is required"],
                    },
                },
            },
        },
    },
    paths: {
        "/health": {
            get: {
                tags: ["Health"],
                summary: "Check API health status",
                responses: {
                    "200": {
                        description: "Server is healthy",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        status: { type: "string", example: "OK" },
                                        message: { type: "string", example: "Server is healthy" },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/api/auth/register": {
            post: {
                tags: ["Auth"],
                summary: "Register a new user",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/RegisterRequest" },
                        },
                    },
                },
                responses: {
                    "201": {
                        description: "User registered successfully",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/SuccessAuthResponse" },
                            },
                        },
                    },
                    "400": {
                        description: "Validation error or bad request",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" },
                            },
                        },
                    },
                },
            },
        },
        "/api/auth/login": {
            post: {
                tags: ["Auth"],
                summary: "Log in with credentials",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/LoginRequest" },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "User logged in successfully",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/SuccessAuthResponse" },
                            },
                        },
                    },
                    "400": {
                        description: "Validation error or invalid credentials",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" },
                            },
                        },
                    },
                    "401": {
                        description: "Unauthorized",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" },
                            },
                        },
                    },
                },
            },
        },
        "/api/auth/logout": {
            post: {
                tags: ["Auth"],
                summary: "Log out current user",
                responses: {
                    "200": {
                        description: "User logged out successfully",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/LogoutResponse" },
                            },
                        },
                    },
                },
            },
        },
        "/api/auth/status": {
            get: {
                tags: ["Auth"],
                summary: "Get auth status for current user",
                security: [{ cookieAuth: [] }],
                responses: {
                    "200": {
                        description: "User is authenticated",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/AuthStatusResponse" },
                            },
                        },
                    },
                    "401": {
                        description: "Unauthorized",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" },
                            },
                        },
                    },
                },
            },
        },
    },
} as const;
