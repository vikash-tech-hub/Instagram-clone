import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MoreHorizontal } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Comment from "./Comment";
import axios from "axios";
import { toast } from "sonner";
import { setPosts } from "@/redux/postSlice";

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState("");
  const { selectedPost,posts } = useSelector((store) => store.post);
const [comment, setComment] = useState(selectedPost?.comments ?? []);
  const dispatch=useDispatch()


  useEffect(()=>{
    if(selectedPost){
      setComment(selectedPost.comments)
    }
  },[selectedPost])

  const changeEventHandler = (e) => {
    setText(e.target.value);
  };

  

  const sendMessageHandler = async () => {
    try {
      const res = await axios.post(
        `https://instagram-clone-1-xltx.onrender.com/api/v1/post/${selectedPost?._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedCommetData = [...comment, res.data.comment];
        setComment(updatedCommetData);
        const updatedPostdata = posts.map((p) =>
          p._id === selectedPost._id ? { ...p, comments: updatedCommetData } : p
        );
        dispatch(setPosts(updatedPostdata));
        toast.success(res.data.success);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <Dialog open={open}>
  <DialogContent
    onInteractOutside={() => setOpen(false)}
    className="p-0 w-[900px] max-w-[95vw] h-[600px] flex rounded-xl overflow-hidden"
  >
    <div className="flex w-full h-full">

      {/* LEFT IMAGE FIXED */}
      <div className="w-1/2 bg-black flex items-center justify-center">
        <img
          src={selectedPost?.image}
          alt="post"
          className="h-full w-full object-contain bg-black"
        />
      </div>

      {/* RIGHT COMMENT AREA */}
      <div className="w-1/2 flex flex-col bg-white">

        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={selectedPost?.author?.profilePicture} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <Link className="font-semibold text-sm">
              {selectedPost?.author?.username}
            </Link>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <MoreHorizontal className="cursor-pointer" />
            </DialogTrigger>
            <DialogContent className="flex flex-col gap-4 py-6 text-sm items-center">
              <div className="text-red-500 font-bold cursor-pointer">Unfollow</div>
              <div className="cursor-pointer">Add to Favourite</div>
              <div className="cursor-pointer">Report</div>
            </DialogContent>
          </Dialog>
        </div>

        {/* COMMENTS SCROLL AREA */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {comment.map((c) => (
            <Comment key={c._id} comment={c} />
          ))}
        </div>

        {/* INPUT */}
        <div className="px-4 py-3 border-t bg-white">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={text}
              onChange={changeEventHandler}
              placeholder="Add a comment..."
              className="w-full border rounded-lg px-3 py-2 text-sm outline-none"
            />

            <Button
              onClick={sendMessageHandler}
              disabled={!text.trim()}
              variant="secondary"
            >
              Send
            </Button>
          </div>
        </div>

      </div>
    </div>
  </DialogContent>
</Dialog>

  );
};

export default CommentDialog;
