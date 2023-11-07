import react from 'react';
import { Outlet } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

const RouteGuard = () => {
    const hasValidJWT = () => {
        let isValid = false;
        sessionStorage.getItem("token") ? isValid=true : isValid=false;
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