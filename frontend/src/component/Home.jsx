import React from 'react'
import Feed from './Feed'
import { Outlet } from 'react-router-dom'
import useGetAllPost from '@/hooks/useGetAllPost'   // FIXED

const Home = () => {
  useGetAllPost();   // runs once on page load

  return (
    <div className='flex'>
      <div className='flex-grow'>
        <Feed />
        <Outlet />
      </div>
    </div>
  )
}

export default Home
