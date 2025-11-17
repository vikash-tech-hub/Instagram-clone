import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from "@/components/ui/button"

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice'

const Login = () => {
    const [input, setInput] = useState({
     
        email: "",
        password: ""
    })
    const [loading, setLoading] = useState(false)
    const {user}=useSelector(store=>store.auth)
    const navigate=useNavigate()
    const changeEventHandler=(e)=>{
        setInput({...input,[e.target.name]:e.target.value})
    }
    const dispatch=useDispatch()
    const signupHandler=async(e)=>{
        e.preventDefault();
        console.log(input);
        try {
            setLoading(true)
            const res=await axios.post("http://localhost:8000/api/v1/user/login",input,{
                headers:{
                    "Content-Type":"application/json"
                },
                withCredentials:true
            })
            if(res.data.success){
                dispatch(setAuthUser(res.data.user))
                navigate("/")
                toast.success(res.data.message)
                setInput({
                    email: "",
                    password: ""
                })
            }
            console.log(res.data);
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)
            
        }
        finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        if(user){
            navigate("/")
        }
    })
  return (
    <div className='flex items-center w-screen h-screen justify-center'>
      <form onSubmit={signupHandler} className='shadow-lg flex flex-col gap-5 p-8'>
        <div>
            <h1 className='text-center font-bold text-xl'>LOGO</h1>
            <p className='text-sm text-center'>Login to see photo and video from your friends</p>
        </div>
        
        <div>
            <Label className='py-1 font-medium'>Email</Label>
            <Input
            type='text'
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            className='focus-visible:ring-transparent my-1'/>
        </div>
        <div>
            <Label className='py-1 font-medium'>Password</Label>
            <Input
            type='password'
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            className='focus-visible:ring-transparent my-1'/>
        </div>
        {
            loading?(
                <Button>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                    please wait
                </Button>
            ):(
                <Button className='bg-blue-500 text-white font-semibold rounded-md mt-4 py-1'type='submit'>Login</Button>
            )
        }
        
        <span className='text-center'>Does not have an account ?<Link to="/signup" className='text-blue-600'>Signup</Link></span>
      </form>
    </div>
  )
}

export default Login
