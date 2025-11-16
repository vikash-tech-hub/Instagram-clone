import React from "react";
import { useSelector } from "react-redux";

const Message = ({ msg }) => {
  const { user } = useSelector((store) => store.auth);

  const isSender = String(msg.senderId) === String(user._id);

  return (
    <div className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-4 py-2 rounded-lg max-w-[60%] ${
          isSender ? "bg-blue-600 text-white" : "bg-gray-300 text-black"
        }`}
      >
        {msg.message}
      </div>
    </div>
  );
};

export default Message;
