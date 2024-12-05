import React from 'react'
import { assets } from '../assets/assets'
import {motion} from "framer-motion"

const Description = () => {
  return (
    <motion.div className='flex flex-col items-center justify-center my-24 p-6 md:px-28' 
    initial={{opacity:0.2,y:100}}
    transition={{duration:1}}
    whileInView={{opacity:1,y:0}}
    viewport={{once:true}}>
        <h1 className='text-3xl sm:text-4xl font-semibold mb-2'>Create AI Images</h1>
        <p className='text-gray-500 mb-8'>Turn your imagination into visuals</p>

        <div className='flex flex-col gap-5 md:gap-14 md:flex-row items-center'>
            <img src={assets.sample_img_1} className='w-80 xl:w-96 rounded-lg'/>
            <div>
                <h2 className='text-3xl font-medium max-w-lg mb-4'>Introducing the AI-powered Text to Image Generator</h2>
                <p className='text-gray-600 mb-4'>Unleash your creativity with our cutting-edge AI image generator! Transform your ideas into stunning visuals effortlessly. Whether you’re an artist, designer, or hobbyist, our intuitive platform lets you generate high-quality, customizable images for any purpose. With AI-driven precision and endless possibilities, bring your imagination to life in seconds!</p>
                <p className='text-gray-600 mb-4'>Experience the future of design with our AI-powered image generation tool. From vibrant illustrations to photorealistic visuals, our platform caters to all your creative needs. Simply input your concept, and watch as the AI crafts unique, professional-grade images tailored to your vision. Perfect for projects, marketing, or personal inspiration—creativity has never been this accessible!</p>
            </div>
        </div>
    </motion.div>
  )
}

export default Description