import react from 'react';
import { Route, redirect, Navigate } from 'react-router-dom';
import IRouteGuard from '../interfaces/IRouteGuard';

const RouteGuard: react.FC<IRouteGuard> = ({children}) => {
    const hasValidJWT = () => {
        let isValid = false;
        localStorage.getItem("token") ? isValid=true : isValid=false;
        console.log(isValid);
        return isValid;
    }

    return (
        <>
        {hasValidJWT() ? <>{children}</> : <Navigate to="/prihlaseni" replace />}
        </>
    )
}

export default RouteGuard;