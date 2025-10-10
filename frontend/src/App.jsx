import { useState } from 'react'


import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './component/Home'
import Login from './component/Login'
import Signup from './component/Signup'
import MainLayout from './component/MainLayout'


const approuter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children:[{
      path:"/",
      element:<Home/>
    },
    ]
  },
  {
    path:"/login",
    element:<Login/>
  },
  { 
    path:"/signup", 
    element:<Signup/>
  }
  
])

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <RouterProvider router={approuter} />
    </>
  )
}

export default App
