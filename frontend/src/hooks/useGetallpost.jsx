import { setPosts } from "@/redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllPost = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllPost = async () => {
      try {
        const res = await axios.get(
          "https://instagram-clone-1-xltx.onrender.com/api/v1/post/all",
          { withCredentials: true }
        );

        if (res.data.success) {
          console.log(res.data.post);
          dispatch(setPosts(res.data.post)); 
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllPost();
  }, [dispatch]);
};

export default useGetAllPost;
