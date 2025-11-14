import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";

const Comment = ({ comment }) => {
  return (
    <div className="flex items-start gap-3 my-3">
      {/* Avatar */}
      <Avatar className="h-8 w-8">
        <AvatarImage src={comment?.author?.profilePicture} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>

      {/* Text */}
      <p className="text-sm leading-tight">
        <span className="font-semibold mr-1">
          {comment?.author?.username}
        </span>
        {comment?.text}
      </p>
    </div>
  );
};

export default Comment;
