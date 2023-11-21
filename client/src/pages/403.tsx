import React from 'react'
import { Link } from 'react-router-dom'

const Unauthorized = () => {
    return (
        <div className="error-page">
            <div className="flex flex-col">
                <h1>403</h1>
                <p className="text-center mb-6">Forbidden</p>
                <div className="flex justify-center">
                <Link to="/login">
                    <button className="primary-button">Sign in</button>
                </Link>
                </div>
            </div>
        </div>
      )
}

export default Unauthorized