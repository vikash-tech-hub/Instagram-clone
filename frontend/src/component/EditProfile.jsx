import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { setAuthUser } from '@/redux/authSlice';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const EditProfile = () => {
    const imageRef = useRef();
    const { user } = useSelector(store => store.auth);

    const [loading, setLoading] = useState(false);

    // FIXED: file only, and preview stored separately
    const [input, setInput] = useState({
        profilePicture: null, 
        bio: user?.bio,
        gender: user?.gender
    });

    const [preview, setPreview] = useState(user?.profilePicture); // 🔥 live preview image

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // When user selects a file
    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setInput({ ...input, profilePicture: file });
            setPreview(URL.createObjectURL(file)); // 🔥 show preview immediately
        }
    };

    const selectChangeHandler = (value) => {
        setInput({ ...input, gender: value });
    };

    const editProfileHandler = async () => {
        const formData = new FormData();
        formData.append("bio", input.bio);
        formData.append("gender", input.gender);

        // Only append if file exists
        if (input.profilePicture instanceof File) {
            formData.append("profilePicture", input.profilePicture);
        }

        try {
            setLoading(true);

            const res = await axios.post(
                "http://localhost:8000/api/v1/user/profile/edit",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true
                }
            );

            if (res.data.success) {
                const updatedUserData = {
                    ...user,
                    bio: res.data.user?.bio,
                    profilePicture: res.data.user?.profilePicture,
                    gender: res.data.user?.gender
                };

                dispatch(setAuthUser(updatedUserData));
                toast.success("Profile updated!");

                navigate(`/profile/${user?._id}`);
            }

        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex max-w-2xl mx-auto pl-10'>
            <section className='flex flex-col gap-6 w-full my-8'>
                <h1 className='font-bold text-xl'>Edit Profile</h1>

                {/* PROFILE IMAGE + PREVIEW */}
                <div className='flex items-center justify-between bg-gray-100 rounded-xl p-4'>
                    <div className='flex items-center gap-3'>
                        <Avatar>
                            {/* 🔥 Live preview works here */}
                            <AvatarImage src={preview} alt="profile" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>

                        <div>
                            <h1 className='font-bold text-sm'>{user?.username}</h1>
                            <span className='text-gray-600'>{user?.bio || 'Bio here...'}</span>
                        </div>
                    </div>

                    <input
                        ref={imageRef}
                        onChange={fileChangeHandler}
                        type='file'
                        className='hidden'
                    />

                    <Button
                        onClick={() => imageRef?.current.click()}
                        className='bg-[#0095F6] h-8 hover:bg-[#318bc7]'
                    >
                        Change photo
                    </Button>
                </div>

                {/* BIO */}
                <div>
                    <h1 className='font-bold text-xl mb-2'>Bio</h1>
                    <Textarea
                        value={input.bio}
                        onChange={(e) => setInput({ ...input, bio: e.target.value })}
                        className="focus-visible:ring-transparent"
                    />
                </div>

                {/* GENDER */}
                <div>
                    <h1 className='font-bold mb-2'>Gender</h1>
                    <Select defaultValue={input.gender} onValueChange={selectChangeHandler}>
                        <SelectTrigger className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* SUBMIT BUTTON */}
                <div className='flex justify-end'>
                    {
                        loading ? (
                            <Button className='w-fit bg-[#0095F6] hover:bg-[#2a8ccd]'>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                Please wait
                            </Button>
                        ) : (
                            <Button
                                onClick={editProfileHandler}
                                className='w-fit bg-[#0095F6] hover:bg-[#2a8ccd]'
                            >
                                Submit
                            </Button>
                        )
                    }
                </div>
            </section>
        </div>
    );
};

export default EditProfile;
