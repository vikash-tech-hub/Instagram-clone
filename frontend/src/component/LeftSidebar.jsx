import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { setAuthUser } from '@/redux/authSlice'
import axios from 'axios'
import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import Createpost from './Createpost'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { clearNotifications } from '@/redux/rtmSlice'


const LeftSidebar = () => {
  const dispatch=useDispatch()
  const {user}=useSelector(store=>store.auth)
  const [openNotification, setOpenNotification] = useState(false);

  const [open,setOpen]=useState(false)
  const navigate=useNavigate()
  const {likeNotification}=useSelector(store=>store.realTimeNotification)
  const logoutHandler=async()=>{
    try {
     const res=await axios.get("http://localhost:8000/api/v1/user/logout",{

                withCredentials:true
            })
            if(res.data.success){
              dispatch(setAuthUser(null))
              dispatch(setSelectedPost(null))
              dispatch(setPosts(null))
              navigate("/login")
              toast.success(res.data.success)
            }
    } catch (error) {
      toast.error(error.res.data.message)
      console.log(error);

    }
  }

const sidebarHandler=(textType)=>{
  if(textType=="Logout"){
    logoutHandler()
  }else if(textType=="Create"){
    setOpen(true)
  }else if(textType=="Profile"){
    navigate(`profile/${user?._id}`)
  }else if(textType=="Home"){
    navigate('/')
  }else if(textType=="Message"){
    navigate('/chat')
  }
}
const sidebarItems = [
  { icon: <Home />, text: 'Home' },
  { icon: <Search />, text: 'Search' },
  { icon: <TrendingUp />, text: 'Explore' },
  { icon: <MessageCircle />, text: 'Message' },
  { icon: <Heart />, text: 'Notification' },
  { icon: <PlusSquare />, text: 'Create' },
  { icon: (
   <Avatar>
        <AvatarImage src={user?.profilepicture} alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>), text: 'Profile' },

    { icon: <LogOut />, text: 'Logout' },

]
  return (
    <div className='fixed top-0 z-10 left-0 px-4 border-r border-gray-400 w-[16%] h-screen'>
      <div className='flex flex-col'>
        <h1 className='my-8 pl-3 font-bold text-xl'>LOGO</h1>
        <div>

       
        {
      sidebarItems.map((item,index)=>{
        return(
          <div onClick={()=>sidebarHandler(item.text)} key={index}  className='flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3'>
            {item.icon  }
            <span>{item.text}</span>

            {item.text === "Notification" && (
  <Popover
    open={openNotification}
    onOpenChange={(isOpen) => {
      setOpenNotification(isOpen);
      if (!isOpen) {
        dispatch(clearNotifications());   // jab popover band hoga tab clear hoga
      }
    }}
  >
    <PopoverTrigger asChild>
     {likeNotification.length>0 &&  <Button
        size="icon"
        className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 left-6"
      >
        { likeNotification.length}
      </Button>
      }
    </PopoverTrigger>

    <PopoverContent>
      <div>
        {likeNotification.length === 0 ? (
          <p>No new Notification</p>
        ) : (
          likeNotification.map((notification) => (
            <div key={notification.userId} className="flex items-center gap-2 my-2">
              <Avatar>
                <AvatarImage src={notification?.userDetails?.profilePicture} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <p className="text-sm">
                <span className="font-bold">{notification?.userDetails?.username}</span> liked your post
              </p>
            </div>
          ))
        )}
      </div>
    </PopoverContent>
  </Popover>
)}

          </div>
        )
      })
}
   </div>
      </div>
      <Createpost open={open} setOpen={setOpen}/>
  </div>
  )
}

export default LeftSidebar
