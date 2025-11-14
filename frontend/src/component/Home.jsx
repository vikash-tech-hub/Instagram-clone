import React from 'react'
import Feed from './Feed'
import { Outlet } from 'react-router-dom'
import useGetAllPost from '@/hooks/useGetAllPost'   // FIXED
import Rightsidebar from './Rightsidebar'
import useGetSuggestedUsers from '@/hooks/UseGetSuggestedUser'

const Home = () => {
  useGetAllPost();   // runs once on page load
  useGetSuggestedUsers()

  return (
    <div className='flex'>
            <div className='flex-grow'>
                <Feed />
                <Outlet />
            </div>
            <Rightsidebar />
        </div>
    
  )
}

export default Home
