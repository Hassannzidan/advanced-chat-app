import mongoose, { Document, Schema } from "mongoose";

export interface MessageDocument extends Document {
    chatId: mongoose.Types.ObjectId;
    sender: mongoose.Types.ObjectId;
    content?: string;
    image?: string;
    replyTo?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const messageSchema = new Schema<MessageDocument>({
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required: true,
    },
    content: {
        type: String,
        default: null,
    },
    image: {
        type: String,
        default: null,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    replyTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: null,
    },
}, { timestamps: true });

const MessageModel = mongoose.model<MessageDocument>("Message", messageSchema);
export default MessageModel;