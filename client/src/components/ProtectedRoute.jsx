import {useSelector} from 'react-redux';
import {selectLoggedIn} from '../state/authSlice.js';
import {Navigate} from 'react-router-dom';

export function ProtectedRoute({ children, redirectTo }) {
    const isAuthenticated = useSelector(selectLoggedIn);

    if (!isAuthenticated) {
        return <Navigate to={redirectTo} state={{redirected: true}}/>;
    }

    return children;
}