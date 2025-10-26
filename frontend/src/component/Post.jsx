import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import React from 'react'
import { FaRegHeart } from "react-icons/fa";
import CommentDialog from './CommentDialog'


const Post = () => {
    return (
        <div className='my-8 w-full max-w-sm mx-auto'>
            <div className='flex items-center justify-between'>


                <div className='flex items-center gap-2'>


                    <Avatar>
                        <AvatarImage src='' alt="post image" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <h1>username</h1>
                </div>
                <Dialog >
                    <DialogTrigger asChild>
                        <MoreHorizontal className='cursor-pointer' />
                    </DialogTrigger>
                    <DialogContent className='flex flex-col items-center text-sm text-center'>
                        <Button variant='ghost' className='cursor-pointer w-fit text-[#ed4956] font-bold'>Unfollow</Button>
                        <Button variant='ghost' className='cursor-pointer w-fit '>Add to Favourite</Button>
                        <Button variant='ghost' className='cursor-pointer w-fit '>Cancel</Button>
                    </DialogContent>
                </Dialog>


            </div>
            <img className='rounded-sm my-2 w-full aspect-square object-cover'
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170"
                alt="post image" />

            <div className=''>
                <div className='flex items-center justify-between my-2'>
                    <div className='flex items-center gap-3'>
                        <FaRegHeart size={'22px'} className='cursor-pointer hover:text-gray-600' />
                        <MessageCircle className='cursor-pointer hover:text-gray-600' />
                        <Send className='cursor-pointer hover:text-gray-600' />
                    </div>
                    <Bookmark className='cursor-pointer hover:text-gray-600' />
                </div>



                
            </div>
            <span className='font-medium block mb-2'>1k likes</span>
            <p>
                <span className='font-medium mr-2'>username</span>
                caption
            </p>
            <span>view all comments</span>
            <CommentDialog/>
            <div>
                <input
                type='text'
                placeholder='Add a comment'
                className='outline-none text-sm w-full'/>
                <span className='text-[#3BADF8]'>Post</span>
            </div>

        </div>
    )
}

export default Post
