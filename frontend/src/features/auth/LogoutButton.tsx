import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { client } from "@/lib/apollo";

export const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        // 1. Remove Token
        localStorage.removeItem("token");

        // 2. Clear Apollo Cache (Crucial for security)
        await client.clearStore();

        // 3. Redirect to Login
        navigate("/login");
    };

    return (
        <Button
            variant="ghost"
            onClick={handleLogout}
            className="h-12 w-12 rounded-none border-2 border-transparent hover:border-red-600 hover:bg-red-50 hover:text-red-600 transition-all"
            title="Sign Out"
        >
            <LogOut className="w-5 h-5" />
        </Button>
    );
};
