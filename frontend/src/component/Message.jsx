import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import useGetAllMessage from "@/hooks/useGetAllMessage";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Message = () => {
  useGetAllMessage()
  const { selectedUser } = useSelector((store) => store.auth);
  const {messages}=useSelector(store=>store.chat)
  return (
    <div className="overflow-y-auto flex-1 p-4">
      <div className="flex justify-center">
        <div className="flex flex-col items-center justify-center">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={selectedUser?.profilePicture}
              alt="profilepicture"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span>{selectedUser?.username}</span>
          <Link to={`/profile/${selectedUser?._id}`}>
            <Button variant="secondary" className="h-8 my-2">
              view profile
            </Button>
          </Link>
        </div>
        
      </div>
      <div className="flex flex-col gap-3">
          {
          messages&&messages.map((msg) => {
            return (
              <div className="flex">
                <div>{<p>{msg.message}</p>
}</div>
              </div>
            );
          })}
        </div>
    </div>
  );
};

export default Message;
