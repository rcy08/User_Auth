import {Outlet, Navigate } from 'react-router-dom';

const PrivateRoute = () => {
    return (
        localStorage.getItem('userToken') ? <Outlet /> : <Navigate to='/login' />
    );
}
 
export default PrivateRoute;