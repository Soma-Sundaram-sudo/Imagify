import React, { useContext, useState } from 'react'
import {assets} from "../assets/assets"
import {Link, useNavigate} from "react-router-dom"
import { Appcontext } from '../context/Appcontext.jsx'
const Navbar = () => {
    const {user,setShowLogin,logout,credit} = useContext(Appcontext)
    const navigate = useNavigate()
  return (
    <div>
        <div className='flex items-center justify-between py-4'>
            <Link to={"/"}>
            <img src={assets.logo} className='w-28 sm:w-32 lg:w-40'/>
            </Link>
            <div>
            {
                user ? 
                <div className='flex items-center gap-2 sm:gap-5'>
                    <button onClick={()=>navigate("/buy")} className='flex items-center gap-2 bg-blue-100 px-4 sm:px-6 py-1.5 sm:py-3 rounded-full hover:scale-105 transition-all duration-100'>
                        <img className='w-5' src={assets.credit_star}/>
                        <p className='text-xs sm:text-sm font-medium text-gray-600'>credits left : {credit}</p>
                    </button>
                    <p className='text-xs sm:text-sm font-medium text-gray-600 max-sm:hidden'>Hi, {user.name}</p>
                    <div className='relative group'>
                        <img src={assets.profile_icon} className='w-10 drop-shadow'/>
                        <div className='absolute hidden group-hover:block top-0 right-0 z-10 rounded text-black pt-12'>
                            <ul onClick={logout} className='list-none m-0 p-2 rounded-md bg-white text-sm'>
                                <li className='py-1 px-2 cursor-pointer pr-10'>Logout</li>
                            </ul>
                        </div>
                    </div>
                </div>:
                <div className='flex items-center gap-2 sm:gap-5'>
                    <p onClick={()=>navigate("/buy")} className='cursor-pointer'>Pricing</p>
                    <button onClick={() => setShowLogin(true)} className='bg-zinc-800 text-white px-7 py-2 sm:px-10 rounded-full text-sm'>Login</button>
                </div>
            }
            </div>
           
        </div>
    </div>
  )
}

export default Navbar