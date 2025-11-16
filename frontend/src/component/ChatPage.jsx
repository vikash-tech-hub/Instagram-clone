import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { setSelectedUser } from '@/redux/authSlice'
import store from '@/redux/store'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

const ChatPage = () => {
  const {user,suggestedUsers,selectedUser}=useSelector(store=>store.auth)
  const dispatch=useDispatch()
  // const {suggestedUser}=useSelector()
  const isOnline=true
  return (
    <div className='flex'>
     <section className=' ml-[16%] h-screen'>
    <h1 className='font-bold mb-4 px-3 text-xl'>
      {user?.username}
    </h1>
    <hr className='mb-4 border-gray-300'/>
    <div className='overflow-y-auto h-[80vh]'>
      {
        suggestedUsers.map((suggestedUser)=>{
          return(
            <div onClick={()=>(setSelectedUser(suggestedUser))}className='flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer'>
              <Avatar>
                <AvatarImage src={suggestedUser?.profilePicture}/>
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className='flex flex-col'>
                <span className='font-medium'>{suggestedUser?.username}</span>
                <span className={`text-xs ${isOnline? 'text-green-600':'text-red-600'}`}>{isOnline?'online':'offline'}</span>
              </div>
            </div>

          )
        })
      }

    </div>
     </section>
     {
      selectedUser?(
        <div>
          <Avatar>
          <AvatarImage src={selectedUser?.profilePicture}/>
          <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      )

      :(
<h1>hello</h1>
      )
     }
    </div>
  )
}

export default ChatPage
