import React from 'react'
import { Outlet } from 'react-router-dom';
import Footer from './Footer'

const PageLayoutWithFooter = () => {
  return (
    <>
        <Outlet />
        <Footer />
    </>
  )
}

export default PageLayoutWithFooter