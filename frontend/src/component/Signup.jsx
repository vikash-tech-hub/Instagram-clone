import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from "@/components/ui/button"

import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'

const Signup = () => {
    const [input, setInput] = useState({
        username: "",
        email: "",
        password: ""
    })
    const [loading, setLoading] = useState(false)
    const navigate=useNavigate()
    const changeEventHandler=(e)=>{
        setInput({...input,[e.target.name]:e.target.value})
    }
    const signupHandler=async(e)=>{
        e.preventDefault();
        console.log(input);
        try {
            setLoading(true)
            const res=await axios.post("http://localhost:8000/api/v1/user/register",input,{
                headers:{
                    "Content-Type":"application/json"
                },
                withCredentials:true
            })
            if(res.data.success){
                navigate("/login")
                toast.success(res.data.message)
                setInput({
                    username: "",
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
  return (
    <div className='flex items-center w-screen h-screen justify-center'>
      <form onSubmit={signupHandler} className='shadow-lg flex flex-col gap-5 p-8'>
        <div>
            <h1 className='text-center font-bold text-xl'>LOGO</h1>
            <p className='text-sm text-center'>Signup to see photo and video from your friends</p>
        </div>
        <div>
            <Label className='py-1 font-medium'>Username</Label>
            <Input
            type='text'
            name="username"
            value={input.username}
            onChange={changeEventHandler}
            className='focus-visible:ring-transparent my-1'/>
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
                <Button className='bg-blue-500 text-white font-semibold rounded-md mt-4 py-1'type='submit'>Signup</Button>
            )
        }
        <span className='text-center'>Already have an account ?<Link to="/login" className='text-blue-600'>Login</Link></span>
      </form>
    </div>
  )
}

export default Signup
