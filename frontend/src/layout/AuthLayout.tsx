import { Navigate, Outlet, useLocation } from "react-router-dom"
export const AuthLayout = () => {
    const token = localStorage.getItem("token")
    const location = useLocation()

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    return <Outlet />
}
