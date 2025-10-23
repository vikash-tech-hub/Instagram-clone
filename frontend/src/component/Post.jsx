import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { MoreHorizontal } from 'lucide-react'
import React from 'react'

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
                

            </div>

        </div>
    )
}

export default Post
