import React from 'react'
import Navbar from '../components/Navbar';

function About() {
  return (
    <div>
      <Navbar showCart={false} />
      <div className="px-4 py-16 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold mb-4">About Us</h1>
            <p className="text-lg text-gray-700">
                Welcome to our story! We are a team of passionate individuals dedicated to bringing you the best Zambian flavors.
            </p>
        </div>
    </div>
    
  )
}

export default About