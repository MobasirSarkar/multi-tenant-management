import { Link, useNavigate } from "react-router-dom";
import { useApolloClient } from "@apollo/client/react";
import {
    Menu,
    User,
    Users,
    LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateProjectModel } from "@/features/dashboard/CreateProjectForm";

interface DashboardHeaderProps {
    orgSlug: string;
    orgName: string;
    isAdmin: boolean;
}

export const DashboardHeader = ({ orgSlug, orgName, isAdmin }: DashboardHeaderProps) => {
    const navigate = useNavigate();
    const client = useApolloClient();

    const handleLogout = async () => {
        localStorage.removeItem("token");
        await client.clearStore();
        navigate("/login");
    };

    return (
        // 👇 STICKY HEADER CHANGES
        // 1. sticky top-0: Sticks to viewport
        // 2. z-50: Stays above content
        // 3. bg-white/90 + backdrop-blur: "Frosted glass" effect to hide scrolling content
        <header className="sticky top-0 z-50 w-full border-b-2 border-black bg-white/90 backdrop-blur-md transition-all mb-8">

            {/* Added padding directly to header content since we removed it from the page */}
            <div className="flex flex-row items-center justify-between gap-4 p-4 md:px-8 md:py-4">

                {/* --- LEFT: Branding --- */}
                <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="bg-black text-white text-[10px] font-bold px-1.5 py-0.5 uppercase tracking-widest">
                            Workspace
                        </span>
                        {/* Hide decorative line on mobile to save space */}
                        <div className="hidden sm:block h-0.5 w-8 bg-black/10"></div>
                    </div>

                    {/* Truncate text on mobile so it doesn't push buttons off screen */}
                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none truncate">
                        {orgName}
                    </h1>
                </div>

                {/* --- RIGHT: Actions --- */}
                {/* Always flex-row to keep menu right-aligned */}
                <div className="flex items-center gap-2 md:gap-4 shrink-0">

                    {isAdmin && (
                        // On mobile, this button might be large. 
                        // The flex layout handles it, but ensures Menu is always visible.
                        <div>
                            <CreateProjectModel orgSlug={orgSlug} />
                        </div>
                    )}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className="h-10 w-10 md:h-12 md:w-12 shrink-0 p-0 rounded-none border-2 border-black bg-white hover:bg-gray-100 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
                            >
                                <Menu className="w-5 h-5 md:w-6 md:h-6" />
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-56 rounded-none border-2 border-black bg-white p-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <DropdownMenuLabel className="border-b-2 border-black bg-gray-50 px-4 py-3 text-xs font-black uppercase tracking-widest text-gray-500">
                                My Account
                            </DropdownMenuLabel>

                            <div className="p-1">
                                <Link to="/profile">
                                    <DropdownMenuItem className="cursor-pointer rounded-none p-3 text-xs font-bold uppercase focus:bg-black focus:text-white">
                                        <User className="mr-2 h-4 w-4" />
                                        Profile
                                    </DropdownMenuItem>
                                </Link>

                                {isAdmin && (
                                    <Link to={`/${orgSlug}/settings`}>
                                        <DropdownMenuItem className="cursor-pointer rounded-none p-3 text-xs font-bold uppercase focus:bg-black focus:text-white">
                                            <Users className="mr-2 h-4 w-4" />
                                            Team Settings
                                        </DropdownMenuItem>
                                    </Link>
                                )}

                                <DropdownMenuSeparator className="bg-black/10" />

                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="cursor-pointer rounded-none p-3 text-xs font-bold uppercase text-red-600 focus:bg-red-600 focus:text-white"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Log Out
                                </DropdownMenuItem>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
};
