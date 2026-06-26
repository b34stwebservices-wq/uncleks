import React from 'react'
import Navbar from '../components/Navbar';

function Contact() {
  return (
    <>
        <Navbar showCart={false} />
        <div className='px-4 py-16 sm:px-6 lg:px-8'>
            <h1 className='text-3xl font-bold mb-4'>Contact Us</h1>
            <p className='text-lg text-gray-700'>
                Have questions or feedback? We'd love to hear from you!
            </p>
        </div>
    </>
  )
}

export default Contact