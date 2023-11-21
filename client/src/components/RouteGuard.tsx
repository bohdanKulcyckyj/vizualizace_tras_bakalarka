import react from 'react';
import { getTokenFromCookie } from '../utils/jwt';
import { Outlet } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

const RouteGuard = () => {
    const hasValidJWT = () => {
        let isValid = false;
        getTokenFromCookie() ? isValid=true : isValid=false;
        console.log(isValid);
        return isValid;
    }

    return (
        <>
        {hasValidJWT() ? <Outlet /> : <Navigate to="/login" replace />}
        </>
    )
}

export default RouteGuard;