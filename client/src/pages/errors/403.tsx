import { Link } from 'react-router-dom'
import routes from '../../constants/routes'

const Forbidden = () => {
    return (
        <div className="error-page">
            <div className="flex flex-col">
                <h1>403</h1>
                <p className="text-center mb-6">Forbidden</p>
                <div className="flex justify-center">
                <Link to={routes.login}>
                    <button className="primary-button">Sign in</button>
                </Link>
                </div>
            </div>
        </div>
      )
}

export default Forbidden