import React from 'react'

const Home = () => {
  return (
    <section className="welcome-section">
      <div className='text-white absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 z-10'>
        <p className="text-center text-18px md:text-22px lg:text-26px font-medium">Create your own</p>
        <h1 className="text-center text-32px md:text-38px lg:text-50px font-bold uppercase mb-8">Wander Map <span className="text-secondaryColor">3D</span></h1>
        <div className="flex justify-center">
          <button className="secondary-button">learn more</button>
        </div>
      </div>
    </section>
  )
}

export default Home