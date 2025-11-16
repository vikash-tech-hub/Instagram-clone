import { Conversation } from "../models/conversationmodel.js";
import { Message } from "../models/messagemodel.js";
import { getRecieverSocketId, io } from "../Socket/Socket.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ success: false, message: "Message cannot be empty" });
    }

    // Find conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    });

    // Create new conversation if not exists
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId]
      });
    }

    // Create message
    const newMessage = await Message.create({
      senderId,
      receiverId,
      message
    });

    // Save message inside conversation
    conversation.messages.push(newMessage._id);
    await conversation.save();

    // ===== 🔥 REAL-TIME SOCKET.IO EMIT (added here) =====
    const receiverSocketId = getRecieverSocketId(receiverId);

    console.log("Receiver Socket ID:", receiverSocketId);

    if (receiverSocketId) {
      console.log("🟣 EMITTING newMessage TO socket:", receiverSocketId);
      io.to(receiverSocketId).emit("newMessage", newMessage);
    } else {
      console.log("🔴 USER OFFLINE, no real-time emit");
    }
    // ===== END EMIT =====

    return res.status(200).json({
      success: true,
      newMessage
    });

  } catch (error) {
    console.log(error);
  }
};


export const getAllMessages = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    })
      .populate("messages") // populate messages
      .sort({ createdAt: 1 });

    if (!conversation) {
      return res.status(200).json({
        success: true,
        messages: []
      });
    }

    return res.status(200).json({
      success: true,
      messages: conversation.messages
    });

  } catch (error) {
    console.log(error);
  }
};
