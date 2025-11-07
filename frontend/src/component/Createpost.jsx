import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { readFileAsDataURL } from '@/lib/utils'
import React, { useRef, useState } from 'react'

const Createpost = ({open,setOpen}) => {
  const imageRef=useRef()
  const [file,setFile]=useState("")
  const [caption,setCaption]=useState("")
  const [imagePreview,setImagePreview]=useState("")
  const fileChangeHandler=async (e)=>{
    const file=e.target.files?.[0]
    if (file){
      setFile(file)
      const dataUrl= await readFileAsDataURL(file);
      setImagePreview(dataUrl)

    }
  }
  const createposthandler=async(e)=>{
    e.preventDefault()
    try {
        
    } catch (error) {
        // 6:09 tk
    }
}
  return (
    <Dialog open={open}>
        <DialogContent onInteractOutside={()=>setOpen(false)}>
            <DialogHeader className='text-center font-semibold'>
              Create new post
            </DialogHeader>
            <div className='flex gap-3 items-center'>
              <Avatar>
                <AvatarImage src='' alt='img'/>
                <AvatarFallback>
                  CN
                </AvatarFallback>
                </Avatar>
                <div >
                  <h1 className='font-semibold text-xs'>Username</h1>
                  <span className='text-gray-600 text-xs'>Bio here....</span>
                </div>
            </div>
            <Textarea className='focus-visible:ring-transparent border-none' placeholder="write a caption"/>
            {
              imagePreview &&(
                <div className='w-full h-64 flex items-center justify-center'>
                <img src={imagePreview} alt="imgpreview" className="max-h-64 rounded-lg object-contain" />
                </div>

              )
            }
            <input ref={imageRef} type="file" className='hidden' onChange={fileChangeHandler} />
            <Button onClick={()=>imageRef.current.click()} className='w-fit mx-auto bg-[#0095F6] hover:bg-[#1672af]'>Select from computer</Button>
        </DialogContent>
    </Dialog>
  )
}

export default Createpost
