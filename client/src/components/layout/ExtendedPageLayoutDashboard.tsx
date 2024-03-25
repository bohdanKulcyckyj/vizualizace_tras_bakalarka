import React from 'react'
import { Outlet } from 'react-router-dom'

// components
import Header from '../Header'

const ExtendedPageLayoutDashboard: React.FC = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

export default ExtendedPageLayoutDashboard
