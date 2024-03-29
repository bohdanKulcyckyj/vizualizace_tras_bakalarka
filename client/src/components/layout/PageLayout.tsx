import React from 'react'
import { Outlet } from 'react-router-dom'

// components
import Loading from '../Loading'

const PageLayout: React.FC = () => {
  return (
    <>
      <main className='main-content'>
        <Loading />
        <Outlet />
      </main>
    </>
  )
}

export default PageLayout
