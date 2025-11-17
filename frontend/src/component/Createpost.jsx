import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { readFileAsDataURL } from '@/lib/utils'
import { setPosts } from '@/redux/postSlice'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'

const Createpost = ({open,setOpen}) => {
  const imageRef=useRef()
  const [file,setFile]=useState("")
  const [caption,setCaption]=useState("")
  const [imagePreview,setImagePreview]=useState("")
  const [loading,setLoading]=useState(false)
  const {user}=useSelector(store=>store.auth)
  const {posts}=useSelector(store=>store.post)
  const dispatch=useDispatch()
  const fileChangeHandler=async (e)=>{
    const file=e.target.files?.[0]
    if (file){
      setFile(file)
      const dataUrl= await readFileAsDataURL(file);
      setImagePreview(dataUrl)

    }
  }
  const createposthandler=async(e)=>{
const formData=new FormData();
formData.append("caption",caption )
if (imagePreview){
  formData.append("image",file)
}
    try {
      setLoading(true)
      const res=await axios.post("https://instagram-clone-1-xltx.onrender.com/api/v1/post/addpost",formData,{
        headers:{
          "Content-Type":"multipart/form-data"
        },
        withCredentials:true
      })
        if (res.data.success){
          dispatch(setPosts([res.data.post,...posts]))
          toast.success(res.data.message)
          setOpen(false)
        }
    } catch (error) {
        // 6:09 tk
        toast.error(error.response?.data?.message || "Something went wrong")
    }
    finally{
      setLoading(false)
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
                <AvatarImage src='{user?.profilePicture}' alt='img'/>
                <AvatarFallback>
                  CN
                </AvatarFallback>
                </Avatar>
                <div >
                  <h1 className='font-semibold text-xs'>{user?.username}</h1>
                  <span className='text-gray-600 text-xs'>Bio here....</span>
                </div>
            </div>
            <Textarea value={caption} onChange={(e)=>setCaption(e.target.value)}className='focus-visible:ring-transparent border-none' placeholder="write a caption"/>
            {
              imagePreview &&(
                <div className='w-full h-64 flex items-center justify-center'>
                <img src={imagePreview} alt="imgpreview" className="max-h-64 rounded-lg object-contain" />
                </div>

              )
            }
            <input ref={imageRef} type="file" className='hidden' onChange={fileChangeHandler} />
            <Button onClick={()=>imageRef.current.click()} className='w-fit mx-auto bg-[#0095F6] hover:bg-[#1672af]'>Select from computer</Button>
            {
              imagePreview &&(
                loading ? (
                  <Button>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                  </Button>
                ):(
                  <Button type='submit' onClick={createposthandler} className='w-full'>Post</Button>
                )
              )
              
            }
        </DialogContent>
    </Dialog>
  )
}

export default Createpost
