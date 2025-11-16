import { Conversation } from "../models/conversationmodel.js"
import { Message } from "../models/messagemodel.js"
import { getRecieverSocketId } from "../Socket/Socket.js"

export const sendMessage = async (req, res) => {
    try {
        const senderId=req.id
        const receiverId=req.params.id
        const {textMessage:message}=req.body

        let conversation=await Conversation.findOne({
            participants:{$all:[senderId,receiverId]}

        })
        // establish conversation if not exists
        if(!conversation){
            conversation=await Conversation.create({
                participants:[senderId,receiverId]
            })
        }
        const newMessage=await Message.create({
            senderId,
            receiverId,
            message
        })
        if(newMessage){
            conversation.messages.push(newMessage._id)
            await Promise.all([conversation.save(),newMessage.save()])
            // impolement socket io

            const recieverSocketId=getRecieverSocketId(receiverId);
             if (recieverSocketId){
                io.to(recieverSocketId).emit('newMessage',newMessage)
             }

            return res.status(200).json({   
                message:"Message sent successfully",
                newMessage,
                success:true
            })    
            
        }

    } catch (error) {
        console.log(error);
        
    }
}
export const getAllMessages=async(req,res)=>{
    try {
        const senderId=req.id
        const receiverId=req.params.id
        const conversation=await Conversation.findOne({
            participants:{$all:[senderId,receiverId]}
        })   
        if(!conversation){
            return res.status(200).json({
                message:"No conversation found",
                messages:[],
                success:true
            })
        }
        return res.status(200).json({
            message:"All messages",
            messages:conversation.messages,
            success:true
        })
    } catch (error) {
        console.log(error);
        
    }
}
