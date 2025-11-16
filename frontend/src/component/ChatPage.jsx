import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setSelectedUser } from "@/redux/authSlice";
import { MessageCircleCode } from "lucide-react";
// import store from '@/redux/store'
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Message from "./Message";
import axios from "axios";
import { setMessages } from "@/redux/chatSlice";

const ChatPage = () => {
  const { user, suggestedUsers, selectedUser } = useSelector(
    (store) => store.auth
  );
  const dispatch = useDispatch();
  // const {suggestedUser}=useSelector()
  const {onlineUsers,messages}=useSelector(store=>store.chat)
  const [textMessage,setTextMessage]=useState("")
  const sendMessageHandler=async(recieverId)=>{
    try {
      const res=await axios.post(`http://localhost:8000/api/v1/message/send/${recieverId}`,{textMessage},{
        headers:{
          'content-type':'application/json'
        },
        withCredentials:true
      })
      if (res.data.success){

        dispatch(setMessages([...messages,res.data.newMessage]))
      }
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(()=>{
    dispatch(setSelectedUser(null))
  },[])
  return (
    <div className="flex ml-[16%] h-screen">
      <section className=" w-full md:w-1/4 my-8">
        <h1 className="font-bold mb-4 px-3 text-xl">{user?.username}</h1>
        <hr className="mb-4 border-gray-300" />
        <div className="overflow-y-auto h-[80vh]">
          {suggestedUsers.map((suggestedUser) => {
            const isOnline=onlineUsers.includes(suggestedUser?._id)
            return (
              <div
                onClick={() => dispatch(setSelectedUser(suggestedUser))}
                className="flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer"
              >
                <Avatar className="w-14 h-14">
                  <AvatarImage src={suggestedUser?.profilePicture} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{suggestedUser?.username}</span>
                  <span
                    className={`text-xs ${
                      isOnline ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isOnline ? "online" : "offline"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
     {selectedUser ? (
  <section className="flex-1 border-l border-gray-300 flex flex-col h-screen">
    
    {/* Header */}
    <div className="flex gap-3 items-center px-3 py-3 border-b border-gray-300 bg-white sticky top-0 z-10">
      <Avatar>
        <AvatarImage src={selectedUser?.profilePicture} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="font-medium text-lg">{selectedUser?.username}</span>
      </div>
    </div>

    {/* SCROLLABLE MESSAGES SECTION */}
    <div className="flex-1 overflow-y-auto px-4 py-3">
      <Message />
    </div>

    {/* INPUT BOX PINNED AT BOTTOM */}
    <div className="flex items-center p-4 border-t border-gray-300 bg-white">
      <Input
        type="text"
        value={textMessage}
        onChange={(e)=>setTextMessage(e.target.value)}
        className="flex-1 mr-3 focus-visible:ring-transparent"
        placeholder="Messages...."
      />
      <Button onClick={()=>sendMessageHandler(selectedUser?._id)}>Send</Button>
    </div>
  </section>
) : (
  <div className="flex flex-col items-center justify-center mx-auto">
    <MessageCircleCode className="w-32 h-32 my-4" />
    <h1 className="font-medium text-xl">Your Message</h1>
    <span>send a message to start</span>
  </div>
)}

    </div>
  );
};

export default ChatPage;
