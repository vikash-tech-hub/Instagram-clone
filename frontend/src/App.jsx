import { useState } from "react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./component/Home";
import Login from "./component/Login";
import Signup from "./component/Signup";
import MainLayout from "./component/MainLayout";
import Profile from "./component/Profile";
import EditProfile from "./component/EditProfile";
import ChatPage from "./component/ChatPage";

const approuter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/profile/:id",
        element: <Profile />,
      },
      {
        path: "/account/edit",
        element: <EditProfile />,
      },
      {
              path: "/chat",
              element: <ChatPage />,
       },

    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
]);

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <RouterProvider router={approuter} />
    </>
  );
}

export default App;
