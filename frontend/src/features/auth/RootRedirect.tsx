import { useQuery } from "@apollo/client/react";
import { Navigate } from "react-router-dom";
import { GET_MY_ORGS } from "@/graphql/queries";
import { Loader2 } from "lucide-react";

export const RootRedirect = () => {
    const { data, loading, error } = useQuery(GET_MY_ORGS);

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    if (error) return <div>Error loading profile</div>;

    const orgs = data?.me?.organizations || [];

    if (orgs.length > 0) {
        // 🚀 AUTOMATIC REDIRECT to the first organization's dashboard
        return <Navigate to={`/${orgs[0].slug}`} replace />;
    }

    return (
        <div className="h-screen flex items-center justify-center text-center p-4">
            <div>
                <h1 className="text-xl font-bold uppercase">No Organizations Found</h1>
                <p className="text-gray-500">You are not a member of any organization.</p>
            </div>
        </div>
    );
};
