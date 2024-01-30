import { useEffect} from 'react';
import { getTokenFromCookie } from '../../utils/jwt';
import { Outlet, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const RouteGuard = () => {
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if(!getTokenFromCookie()) {
            navigate("/login", {
                replace: true
            })
        }
    }, [location])

    return (
        <Outlet />
    )
}

export default RouteGuard;