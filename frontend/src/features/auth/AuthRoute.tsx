import { useQuery } from "@apollo/client/react";
import { Navigate, Outlet } from "react-router-dom";
import { GET_MY_ORGS } from "@/graphql/queries";

export const AdminRoute = () => {
    const { data, loading } = useQuery(GET_MY_ORGS);

    if (loading) return null; // Or a spinner

    if (!data?.me?.isStaff) {
        // If not admin, kick them back to the dashboard
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};
