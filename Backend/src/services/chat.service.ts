import ChatModel from "../modles/chat.model";
import UserModel from "../modles/user.model";
import { BadRequestException, NotFoundException } from "../utils/app-error";
import MessageModel from "../modles/message.model";

export const createChatService = async (
    userId: string,
    body: {
        participantId?: string, 
        isGroup?: boolean, 
        participants?: string[], 
        groupName?: string
    }
) => {
    const { participantId, isGroup, participants, groupName } = body;
    let chat;
    let allParticipantIds: string[] = [];
    if (isGroup && participants?.length && groupName) {
        allParticipantIds = [...participants, userId];
        chat = await ChatModel.create({
            participants: allParticipantIds,
            isGroup: true,
            groupName,
            createdBy: userId,
        });
    } else if (participantId) {
        const otherUser = await UserModel.findById(participantId);
        if (!otherUser) {
            throw new NotFoundException("User not found");
        }
        allParticipantIds = [userId, participantId];
        const existingChat = await ChatModel.findOne({ 
            participants: { 
                $all: allParticipantIds, 
                $size: 2 
            },
         }).populate("participants", "name avatar");
         if (existingChat) return existingChat;
         chat = await ChatModel.create({
            participants: allParticipantIds,
            isGroup: false,
            createdBy: userId,
         });
    }

    return chat;
    // implement socket.io to send notification to the other user
}

export const getUsersChatsService = async (userId: string) => {
    const chats = await ChatModel.find({ participants: { $in: [userId] } })
    .populate("participants", "name avatar")
    .populate({ 
        path:"lastMessage",
        populate:{
            path:"sender",
            select:"name avatar email",
        },
    })
    .sort({ updatedAt: -1 });
    return chats;
} 

export const getSingleChatService = async (userId: string, chatId: string) => {
    const chat = await ChatModel.findOne({
        _id: chatId,
        participants: { $in: [userId] },
    })
    if (!chat) {
        throw new BadRequestException("Chat not found or you are not authorized to access this chat");
    }
    const messages = await MessageModel.find({
        chat: chatId,
    })
    .populate("sender", "name avatar email")
    .populate({
        path:"replyTo",
        select:"content image sender", 
        populate:{
            path:"sender",
            select:"name avatar",
        },
    })
    .sort({ createdAt: 1 });
    return { 
        chat, 
        messages
 };
}