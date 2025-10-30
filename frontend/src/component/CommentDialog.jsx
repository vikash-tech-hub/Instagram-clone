import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { MoreHorizontal } from 'lucide-react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const CommentDialog = ({ open, setOpen }) => {
  const[text,setText]=useState("")  
  const changeEventHandler=(e)=>{
    const inputText=e.target.value
    if (inputText.trim()){
      setText(inputText)
    }else{
      setText("")
    }
    
  }
  const sendMessageHandler=async()=>{
    alert(text)
  }

  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        style={{ maxWidth: '80rem', width: '60%', height: '400px' }}
        className="p-0 flex flex-col"

      >
        <div className="flex flex-1">
          <div className="w-1/2">
            <img
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170"
              alt=""
              className="w-full h-full object-cover rounded-l-lg"
            />
          </div>

          <div className="w-1/2 flex flex-col justify-between p-4">
            <div className="flex items-center justify-between">
              <div className='flex gap-3 items-center'>
                <Link>
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className='font-semibold text-xs'>username</Link>
                  {/* <span className='text-gray-600 text-sm'>bio here....</span> */}
                </div>

              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className='cursor-pointer' />
                </DialogTrigger>
                <DialogContent className='flex flex-col items-center text-sm text-center gap-4'>
                  <div className='cursor-pointer w-full text-[#ED4956] font-bold'>
                    Unfollow
                  </div>
                  <div className='cursor-pointer w-full'>
                    Add to Favourite
                  </div>
                  <div className='cursor-pointer w-full '>
                    Report
                  </div>
                </DialogContent>
              </Dialog>

            </div>
            <hr />
            <div className='flex-1 overflow-y-auto max-h-96 p-4'>
              comment aayenge
            </div>
            <div className='p-4'>
              <div className='flex items-center gap-2 '>
                <input
                  type='text'
                  onChange={changeEventHandler}
                  value={text}
                  placeholder='Add a comment'
                  className='w-full outline-none border border-gray-300 p-2 rounded'
                />
                <button disabled={!text.trim()}onClick={sendMessageHandler} variant='outline'>
               send
              </button>
              </div>
              
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CommentDialog
