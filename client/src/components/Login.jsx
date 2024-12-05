import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { Appcontext } from '../context/Appcontext'
import {motion} from "framer-motion"
import axios from "axios"
import {toast} from "react-toastify"


const Login = () => {

    const [state,setState] = useState("Login")
    const {setShowLogin,backendUrl,setToken,setUser} = useContext(Appcontext)
    const[name,setName] = useState("")
    const[email,setEmail]= useState("")
    const[password,setPassword] = useState(" ")

    useEffect(()=> {
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "unset";
        }
    })

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            if(state === "Login"){
               const {data} =  await axios.post(backendUrl + "/api/user/login" , {email,password})

               if(data.success){
                setToken(data.token)
                setUser(data.user)
                localStorage.setItem("token",data.token)
                setShowLogin(false)
               }else{
                toast.error(data.message)
               }
            }else{
                const {data} =  await axios.post(backendUrl + "/api/user/register" , {name,email,password})

                if(data.success){
                 setToken(data.token)
                 setUser(data.user)
                 localStorage.setItem("token",data.token)
                 setShowLogin(false)
                }else{
                 toast.error(data.message)
                }
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

  return (
    <div 
        className='fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>
        <motion.form  onSubmit={onSubmitHandler}
        initial={{opacity:0.2,y:100}}
        transition={{duration:1}}
        whileInView={{opacity:1,y:0}}
        viewport={{once:true}}
     className='relative bg-white p-10 rounded-xl text-slate-500'>
            <h1 className='text-center text-2xl text-neutral-700 font-medium'>{state}</h1>
            <p className='text-sm'>Welcome back! Please {state} to continue</p>

           {state === "Signup" ? <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
                <img className='w-6' src={assets.profile_icon}/>
                <input onChange={(e) => setName(e.target.value)} className='outline-none text-sm' type='text' placeholder='Full Name' required/>
            </div> : "" } 
            <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
                <img src={assets.email_icon}/>
                <input onChange={(e) => setEmail(e.target.value)} className='outline-none text-sm' type='email' placeholder='Email id' required/>
            </div>
            <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
                <img src={assets.lock_icon}/>
                <input onChange={(e) => setPassword(e.target.value)} className='outline-none text-sm' type='password' placeholder='Password' required/>
            </div>
            <p className='text-sm text-blue-600 my-4 cursor-pointer'>Forgot Password?</p>
            <button className='bg-blue-600 w-full text-white py-2 rounded-full '>{state==="Login"?"Login":"Create Account"}</button>
            <p onClick={() => setState("Signup")} className={`${state==="Login"?"":"hidden"} mt-5 text-center`}>Don't have an account?<span className='text-blue-500 cursor-pointer'>Sign Up</span></p>
            <p onClick={() => setState("Login")} className={` ${state==="Signup"?"":"hidden"} mt-5 text-center`}>Already have an account?<span className='text-blue-500 cursor-pointer'>Login</span></p>
            <img onClick={()=>setShowLogin(false)} src={assets.cross_icon} className='absolute top-5 right-5 cursor-pointer'/>
        </motion.form>
    </div>
  )
}

export default Login