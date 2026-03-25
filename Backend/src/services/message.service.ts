import ChatModel from "../modles/chat.model";
import MessageModel from "../modles/message.model";
import { BadRequestException, NotFoundException } from "../utils/app-error";
import cloudinary from "../config/cloudinary.config";

export const sendMessageService = async (
  userId: string,
  body: {
    chatId: string;
    content?: string;
    image?: string;
    replyToId?: string;
  },
) => {
  const { chatId, content, image, replyToId } = body;

  const chat = await ChatModel.findOne({
    _id: chatId,
    participants: {
      $in: [userId],
    },
  });

  if (!chat) throw new BadRequestException("Chat not found or unauthorized");
  
  if (replyToId) {
    const replyMessage = await MessageModel.findOne({
      _id: replyToId,
      chatId,
    });
    if (!replyMessage) throw new BadRequestException("Reply message not found");
  }
  let imageUrl;
  if (image) {
    const uploadResult = await cloudinary.uploader.upload(image, {
      folder: "messages",
    });
    imageUrl = uploadResult.secure_url;
  }
  const newMessage = await MessageModel.create({
    chatId,
    sender: userId,
    content,
    image: imageUrl,
    replyTo: replyToId || null,
  });
  
  await newMessage.populate([
    { path: "sender", select: "name avatar" },
    {
      path: "replyTo",
      select: "content image sender",
      populate: {
        path: "sender",
        select: "name avatar",
      },
    },
  ]);

  //websocket here

  return {
    message: newMessage,
    chatId,
  };
};
