import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/ui/floating-input"; // 👈 Import new component
import { Loader2, ArrowRight } from "lucide-react";
import { LOGIN_MUTATION } from "@/graphql/mutation";
import { useMutation } from "@apollo/client/react";

export const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const [login, { loading, error }] = useMutation(LOGIN_MUTATION, {
        onCompleted: (data) => {
            localStorage.setItem("token", data.tokenAuth.token);
            navigate("/");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        login({ variables: { username, password } });
    };

    return (
        <div className="min-h-screen w-full flex bg-white font-mono overflow-hidden">

            {/* LEFT SIDE: Branding / Art */}
            <div className="hidden lg:flex w-1/2 bg-black text-white flex-col justify-between p-12 relative border-r-2 border-black">
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: "radial-gradient(circle, #333 1px, transparent 1px)",
                    backgroundSize: "20px 20px"
                }}></div>

                <div className="z-10">
                    <div className="h-12 w-12 bg-white text-black flex items-center justify-center font-black text-2xl mb-6 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]">
                        TN
                    </div>
                    <h1 className="text-6xl font-black uppercase tracking-tighter leading-none mb-4">
                        Technova<br />Solutions
                    </h1>
                    <p className="text-gray-400 max-w-md text-lg">
                        Manage your organizations, projects, and tasks in a strictly ordered environment.
                    </p>
                </div>

                <div className="z-10 text-xs text-gray-500 uppercase tracking-widest">
                    System v1.0.0 // Production Ready
                </div>
            </div>

            {/* RIGHT SIDE: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50/50">
                <div className="w-full max-w-md animate-in slide-in-from-bottom-4 duration-700 fade-in">

                    <div className="mb-8 text-center lg:text-left">
                        <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Welcome Back</h2>
                        <p className="text-gray-500 text-sm">Enter your credentials to access the workspace.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border-2 border-red-500 text-red-600 p-4 text-xs font-bold uppercase tracking-wide flex items-center animate-pulse">
                                <span className="mr-2">⚠️</span> Invalid Credentials
                            </div>
                        )}

                        <div className="space-y-4">
                            <FloatingInput
                                label="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />

                            <FloatingInput
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 rounded-none border-2 border-black bg-black text-white hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase font-bold tracking-widest text-xs"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin w-4 h-4" />
                            ) : (
                                <>Authenticate <ArrowRight className="ml-2 w-4 h-4" /></>
                            )}
                        </Button>

                        <div className="text-center">
                            <span className="text-[10px] text-gray-400 uppercase tracking-widest cursor-pointer hover:text-black hover:underline">
                                Forgot Password?
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
