import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from "@/components/ui/button"

import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'

const Login = () => {
    const [input, setInput] = useState({
     
        email: "",
        password: ""
    })
    const [loading, setLoading] = useState(false)
    const changeEventHandler=(e)=>{
        setInput({...input,[e.target.name]:e.target.value})
    }
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
        <Button className='bg-blue-500 text-white font-semibold rounded-md mt-4 py-1'type='submit'>Login</Button>
      </form>
    </div>
  )
}

export default Login
