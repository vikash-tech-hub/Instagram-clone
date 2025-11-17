import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./component/Home";
import Login from "./component/Login";
import Signup from "./component/Signup";
import MainLayout from "./component/MainLayout";
import Profile from "./component/Profile";
import EditProfile from "./component/EditProfile";
import ChatPage from "./component/ChatPage";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { setOnlineUsers } from "./redux/chatSlice";
import { setSocket } from "./redux/socketSlice";
import { setLikeNotification } from "./redux/rtmSlice";
import ProtectedRoutes from "./component/ProtectedRoutes";

const approuter = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoutes><MainLayout /></ProtectedRoutes>,
    children: [
      { path: "/", element: <Home /> },
      { path: "/profile/:id", element: <Profile /> },
      { path: "/account/edit", element: <EditProfile /> },
      { path: "/chat", element: <ChatPage /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
]);

function App() {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      dispatch(setSocket(null));
      dispatch(setOnlineUsers([]));
      return;
    }

    // Connect to socket
    const socketio = io("http://localhost:8000", {
      query: { userId: user._id },
      transports: ["websocket"],
    });

    dispatch(setSocket(socketio));

    socketio.on("getOnlineUsers", (onlineUsers) => {
      dispatch(setOnlineUsers(onlineUsers));
    });

    socketio.on('notification',(notification)=>{
      dispatch(setLikeNotification(notification))
    })
    return () => {
      socketio.disconnect();
      dispatch(setSocket(null));
    };
  }, [user, dispatch]);

  return <RouterProvider router={approuter} />;
}

export default App;
