import React from 'react'
import Headers from '../components/Headers'
import Steps from '../components/Steps'
import Description from '../components/Description'
import Testimonial from '../components/Testimonial'
import Generatebtn from '../components/Generatebtn'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div>
      <Headers/>
      <Steps/>
      <Description/>
      <Testimonial />
      <Generatebtn />
    </div>
  )
}

export default Home