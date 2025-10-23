import React from 'react'
import Feed from './Feed'
import { Outlet } from 'react-router-dom'

const Home = () => {
  return (
    <div className='flex'>
      <div className='flex-grow'>
      <Feed/>
      <Outlet/>
      </div>
      {/* <Rightsidebar/> */}
    </div>
  )
}

export default Home
