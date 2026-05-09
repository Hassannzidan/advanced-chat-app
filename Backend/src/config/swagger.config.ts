import { envConfig } from "./env.config";

const port = String(envConfig.PORT || "3000");
const serverBaseUrl = `http://localhost:${port}`;

export const swaggerSpec = {
    openapi: "3.0.3",
    info: {
        title: "Advanced Chat App API",
        version: "1.0.0",
        description: "API documentation for the Advanced Chat App backend.",
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
        { name: "Chat", description: "Chat creation and retrieval" },
        { name: "Message", description: "Send and retrieve messages" },
        { name: "User", description: "User listing and lookup" },
    ],
    components: {
        securitySchemes: {
            cookieAuth: {
                type: "apiKey",
                in: "cookie",
                name: "accessToken",
                description: "JWT auth cookie set after login/register (httpOnly).",
            },
        },
        schemas: {
            User: {
                type: "object",
                properties: {
                    _id: { type: "string", example: "65dff5fd8d2bfc2212f50f58" },
                    name: { type: "string", example: "John Doe" },
                    email: { type: "string", format: "email", example: "john@example.com" },
                    avatar: {
                        type: "string",
                        nullable: true,
                        example: "https://cdn.example.com/avatars/john.png",
                    },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" },
                },
            },
            UserPublic: {
                type: "object",
                properties: {
                    _id: { type: "string", example: "65dff5fd8d2bfc2212f50f58" },
                    name: { type: "string", example: "John Doe" },
                    email: { type: "string", format: "email", example: "john@example.com" },
                    avatar: {
                        type: "string",
                        nullable: true,
                        example: "https://cdn.example.com/avatars/john.png",
                    },
                },
            },
            RegisterRequest: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                    name: { type: "string", minLength: 1, example: "John Doe" },
                    email: { type: "string", format: "email", example: "john@example.com" },
                    password: { type: "string", minLength: 8, maxLength: 32, example: "StrongPass123" },
                    avatar: { type: "string", example: "data:image/png;base64,iVBORw0KGgo..." },
                },
            },
            LoginRequest: {
                type: "object",
                required: ["email", "password"],
                properties: {
                    email: { type: "string", format: "email", example: "john@example.com" },
                    password: { type: "string", minLength: 8, maxLength: 32, example: "StrongPass123" },
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
            CreateChatRequest: {
                description:
                    "Create a direct chat (provide participantId) or a group chat (provide isGroup=true, participants, groupName).",
                oneOf: [
                    {
                        type: "object",
                        required: ["participantId"],
                        properties: {
                            participantId: { type: "string", example: "65dff5fd8d2bfc2212f50f58" },
                        },
                        additionalProperties: false,
                    },
                    {
                        type: "object",
                        required: ["isGroup", "participants", "groupName"],
                        properties: {
                            isGroup: { type: "boolean", enum: [true], example: true },
                            participants: {
                                type: "array",
                                items: { type: "string" },
                                minItems: 1,
                                example: ["65dff5fd8d2bfc2212f50f58", "65dff5fd8d2bfc2212f50f59"],
                            },
                            groupName: { type: "string", minLength: 1, example: "Project Team" },
                        },
                        additionalProperties: false,
                    },
                ],
            },
            SendMessageRequest: {
                description: "Either content or image is required (validator enforces this).",
                oneOf: [
                    {
                        type: "object",
                        required: ["chatId", "content"],
                        properties: {
                            chatId: { type: "string", example: "65dff5fd8d2bfc2212f50f70" },
                            content: { type: "string", minLength: 1, example: "Hello!" },
                            replyToId: { type: "string", nullable: true, example: "65dff5fd8d2bfc2212f50f99" },
                        },
                        additionalProperties: false,
                    },
                    {
                        type: "object",
                        required: ["chatId", "image"],
                        properties: {
                            chatId: { type: "string", example: "65dff5fd8d2bfc2212f50f70" },
                            image: {
                                type: "string",
                                description: "Base64 or data URL image; uploaded to Cloudinary if provided.",
                                example: "data:image/png;base64,iVBORw0KGgo...",
                            },
                            content: { type: "string", nullable: true, example: null },
                            replyToId: { type: "string", nullable: true, example: "65dff5fd8d2bfc2212f50f99" },
                        },
                        additionalProperties: false,
                    },
                ],
            },
            Chat: {
                type: "object",
                properties: {
                    _id: { type: "string", example: "65dff5fd8d2bfc2212f50f70" },
                    participants: {
                        type: "array",
                        items: {
                            oneOf: [
                                { type: "string", example: "65dff5fd8d2bfc2212f50f58" },
                                { $ref: "#/components/schemas/UserPublic" },
                            ],
                        },
                    },
                    lastMessage: {
                        oneOf: [
                            { type: "string", nullable: true, example: "65dff5fd8d2bfc2212f50f99" },
                            { $ref: "#/components/schemas/Message" },
                        ],
                        nullable: true,
                    },
                    isGroup: { type: "boolean", example: false },
                    groupName: { type: "string", nullable: true, example: null },
                    createdBy: { type: "string", example: "65dff5fd8d2bfc2212f50f58" },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" },
                },
            },
            Message: {
                type: "object",
                properties: {
                    _id: { type: "string", example: "65dff5fd8d2bfc2212f50f99" },
                    chatId: { type: "string", example: "65dff5fd8d2bfc2212f50f70" },
                    sender: {
                        oneOf: [
                            { type: "string", example: "65dff5fd8d2bfc2212f50f58" },
                            { $ref: "#/components/schemas/UserPublic" },
                        ],
                    },
                    content: { type: "string", nullable: true, example: "Hello!" },
                    image: { type: "string", nullable: true, example: "https://res.cloudinary.com/.../image.png" },
                    replyTo: {
                        oneOf: [{ type: "string" }, { $ref: "#/components/schemas/Message" }],
                        nullable: true,
                    },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" },
                },
            },
            CreateChatResponse: {
                type: "object",
                properties: {
                    status: { type: "string", example: "success" },
                    message: { type: "string", example: "Chat created or retrieved successfully" },
                    chat: { $ref: "#/components/schemas/Chat" },
                },
            },
            UsersChatsResponse: {
                type: "object",
                properties: {
                    status: { type: "string", example: "success" },
                    message: { type: "string", example: "Users chats fetched successfully" },
                    chats: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Chat" },
                    },
                },
            },
            SingleChatResponse: {
                type: "object",
                properties: {
                    status: { type: "string", example: "success" },
                    message: { type: "string", example: "Chat fetched successfully" },
                    chat: { $ref: "#/components/schemas/Chat" },
                    messages: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Message" },
                    },
                },
            },
            SendMessageResponse: {
                type: "object",
                properties: {
                    status: { type: "string", example: "success" },
                    message: { type: "string", example: "Message sent successfully" },
                    userMessage: { $ref: "#/components/schemas/Message" },
                    chatId: { type: "string", example: "65dff5fd8d2bfc2212f50f70" },
                },
            },
            UsersResponse: {
                type: "object",
                properties: {
                    status: { type: "string", example: "success" },
                    message: { type: "string", example: "Users fetched successfully" },
                    users: {
                        type: "array",
                        items: { $ref: "#/components/schemas/User" },
                    },
                },
            },
            ErrorResponse: {
                type: "object",
                required: ["message", "errorCode", "timestamp"],
                properties: {
                    message: { type: "string", example: "Unauthorized" },
                    error: { type: "string", nullable: true, example: "Extra error details (only on 500s)" },
                    errorCode: { type: "string", example: "ERR_UNAUTHORIZED" },
                    timestamp: { type: "string", format: "date-time", example: "2026-03-25T12:34:56.789Z" },
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
                    "401": {
                        description: "Unauthorized (e.g., user already exists)",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" },
                            },
                        },
                    },
                    "500": {
                        description: "Internal server error",
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
                    "401": {
                        description: "Unauthorized (invalid credentials)",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" },
                            },
                        },
                    },
                    "404": {
                        description: "Not found (email or password is incorrect)",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" },
                            },
                        },
                    },
                    "500": {
                        description: "Internal server error",
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
                    "500": {
                        description: "Internal server error",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" },
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
                    "500": {
                        description: "Internal server error",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" },
                            },
                        },
                    },
                },
            },
        },
        "/api/chat/create": {
            post: {
                tags: ["Chat"],
                summary: "Create a direct chat or group chat",
                security: [{ cookieAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/CreateChatRequest" },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Chat created or retrieved successfully",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/CreateChatResponse" },
                            },
                        },
                    },
                    "400": {
                        description: "Bad request",
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
                    "404": {
                        description: "Not found (e.g., participant user not found)",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" },
                            },
                        },
                    },
                    "500": {
                        description: "Internal server error",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" },
                            },
                        },
                    },
                },
            },
        },
        "/api/chat/all": {
            get: {
                tags: ["Chat"],
                summary: "Get all chats for current user",
                security: [{ cookieAuth: [] }],
                responses: {
                    "200": {
                        description: "Users chats fetched successfully",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/UsersChatsResponse" },
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
                    "500": {
                        description: "Internal server error",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" },
                            },
                        },
                    },
                },
            },
        },
        "/api/chat/{id}": {
            get: {
                tags: ["Chat"],
                summary: "Get a single chat and its messages",
                security: [{ cookieAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                        example: "65dff5fd8d2bfc2212f50f70",
                    },
                ],
                responses: {
                    "200": {
                        description: "Chat fetched successfully",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/SingleChatResponse" },
                            },
                        },
                    },
                    "400": {
                        description: "Bad request",
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
                    "500": {
                        description: "Internal server error",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" },
                            },
                        },
                    },
                },
            },
        },
        "/api/chat/message/send": {
            post: {
                tags: ["Message"],
                summary: "Send a message in a chat (optionally with image/reply)",
                security: [{ cookieAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/SendMessageRequest" },
                        },
                    },
                },
                responses: {
                    "201": {
                        description: "Message sent successfully",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/SendMessageResponse" },
                            },
                        },
                    },
                    "400": {
                        description: "Bad request",
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
                    "500": {
                        description: "Internal server error",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" },
                            },
                        },
                    },
                },
            },
        },
        "/api/user/all": {
            get: {
                tags: ["User"],
                summary: "List all users except the current user",
                security: [{ cookieAuth: [] }],
                responses: {
                    "200": {
                        description: "Users fetched successfully",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/UsersResponse" },
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
                    "500": {
                        description: "Internal server error",
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
