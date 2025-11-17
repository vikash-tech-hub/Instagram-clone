import { setSuggestedUsers, setUserProfile } from "@/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";


const UseGetUserProfile = (userId) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await axios.get(`https://instagram-clone-1-xltx.onrender.com/api/v1/user/${userId}/profile`, { withCredentials: true });
                if (res.data.success) { 
                    dispatch(setUserProfile(res.data.user));

                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchUserProfile(userId);
    }, []);
};
export default UseGetUserProfile;