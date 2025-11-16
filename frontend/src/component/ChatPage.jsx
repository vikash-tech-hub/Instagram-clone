import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setSelectedUser } from "@/redux/authSlice";
import { MessageCircleCode } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setMessages } from "@/redux/chatSlice";
import useGetAllMessage from "@/hooks/useGetAllMessage";
import Message from "./Message";
import useRTM from "@/hooks/useGetRTM";

const ChatPage = () => {
  // 🔥 Fix 1: NEVER reset selectedUser
  // useGetAllMessage runs automatically when selectedUser changes
  useGetAllMessage();
    useRTM()
  

  const { user, suggestedUsers, selectedUser } = useSelector(
    (store) => store.auth
  );
  const { onlineUsers, messages } = useSelector((store) => store.chat);
  const dispatch = useDispatch();

  const [textMessage, setTextMessage] = useState("");

  const sendMessageHandler = async (receiverId) => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/message/send/${receiverId}`,
        { message: textMessage },
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.newMessage]));
        setTextMessage("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex ml-[16%] h-screen">
      {/* LEFT SIDEBAR USER LIST */}
      <section className="w-full md:w-1/4 my-8">
        <h1 className="font-bold mb-4 px-3 text-xl">{user?.username}</h1>
        <hr className="mb-4 border-gray-300" />

        <div className="overflow-y-auto h-[80vh]">
          {suggestedUsers.map((sUser) => {
            const isOnline = onlineUsers.includes(sUser?._id);
            return (
              <div
                key={sUser._id}
                onClick={() => dispatch(setSelectedUser({ ...sUser }))}
                className="flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer"
              >
                <Avatar className="w-14 h-14">
                  <AvatarImage src={sUser?.profilePicture} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div className="flex flex-col">
                  <span className="font-medium">{sUser?.username}</span>
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

      {/* RIGHT CHAT WINDOW */}
      {selectedUser ? (
        <section className="flex-1 border-l border-gray-300 flex flex-col h-screen">
          {/* HEADER */}
          <div className="flex gap-3 items-center px-3 py-3 border-b border-gray-300 bg-white sticky top-0 z-10">
            <Avatar>
              <AvatarImage src={selectedUser?.profilePicture} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-lg">
                {selectedUser?.username}
              </span>
            </div>
          </div>

          {/* MESSAGE LIST */}
         <div className="flex-1 overflow-y-auto px-4 py-3">
  {Array.isArray(messages) &&
    messages
      .filter((m) => m && m.message && m.message.trim() !== "")
      .map((msg) => (
        <Message key={msg._id} msg={msg} />
      ))}
</div>


          {/* INPUT BOX */}
          <div className="flex items-center p-4 border-t border-gray-300 bg-white">
            <Input
              type="text"
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              className="flex-1 mr-3 focus-visible:ring-transparent"
              placeholder="Messages...."
            />
            <Button onClick={() => sendMessageHandler(selectedUser?._id)}>
              Send
            </Button>
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
