import React from 'react'
import { Link } from 'react-router-dom'

const PageNotFound = () => {
  return (
    <div className="error-page">
        <div className="flex flex-col">
            <h1>404</h1>
            <p className="text-center mb-6">Page not found</p>
            <div className="flex justify-center">
                <Link to="/">
                    <button className="primary-button">Home</button>
                </Link>
            </div>
        </div>
    </div>
  )
}

export default PageNotFound