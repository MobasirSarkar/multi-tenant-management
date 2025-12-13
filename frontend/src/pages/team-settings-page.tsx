import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_ORG_TEAM, GET_MY_ORGS } from "@/graphql/queries"; // 👈 Import GET_MY_ORGS
import { ArrowLeft, Loader2, UserPlus, Shield, User as UserIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FloatingInput } from "@/components/ui/floating-input";
import { CREATE_USER } from "@/graphql/mutation";

export const TeamSettingsPage = () => {
    const { orgSlug } = useParams();
    const [isInviteOpen, setIsInviteOpen] = useState(false);

    // Fetch Current User (to get ID)
    const { data: meData } = useQuery(GET_MY_ORGS);
    const currentUserId = meData?.me?.id;

    const { data, loading, error, refetch } = useQuery(GET_ORG_TEAM, {
        variables: { slug: orgSlug },
        fetchPolicy: "cache-and-network"
    });

    const [createUser, { loading: inviting }] = useMutation(CREATE_USER, {
        onCompleted: () => {
            setIsInviteOpen(false);
            refetch();
            setFormData({ username: "", email: "", password: "" }); // Reset form
        },
        onError: (err) => alert(err.message)
    });

    const [formData, setFormData] = useState({ username: "", email: "", password: "" });

    const handleInvite = () => {
        createUser({ variables: { orgSlug, ...formData } });
    };

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
    if (error) return <div className="p-10 text-red-600 font-mono">ERROR: {error.message}</div>;

    const org = data.organization;

    const membersToDisplay = org.members.filter((member: any) => member.id !== currentUserId);

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 font-mono text-foreground">

            {/* --- HEADER --- */}
            <header className="mb-12 max-w-5xl mx-auto">
                <Link
                    to={`/${orgSlug}`}
                    className="inline-flex items-center text-xs font-bold uppercase hover:underline mb-6 text-gray-500 hover:text-black transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                </Link>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-black pb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="bg-black text-white text-[10px] md:text-xs font-bold px-2 py-0.5 uppercase tracking-widest">
                                Settings
                            </span>
                            <div className="h-0.5 w-12 bg-black/10"></div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
                            Team Members
                        </h1>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">
                    // Manage access for {org.name}
                        </p>
                    </div>

                    <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-12 rounded-none border-2 border-black bg-white text-black hover:bg-black hover:text-white uppercase font-bold tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all gap-2">
                                <UserPlus className="w-4 h-4" /> Add Member
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="w-[95vw] max-w-md rounded-none border-2 border-black p-0 bg-white">
                            <DialogHeader className="p-6 border-b-2 border-black bg-gray-50">
                                <DialogTitle className="text-2xl font-black uppercase tracking-tighter">
                                    Add New Member
                                </DialogTitle>
                            </DialogHeader>
                            <div className="p-6 space-y-4">
                                <div className="space-y-4">
                                    <FloatingInput
                                        label="Username"
                                        value={formData.username}
                                        onChange={e => setFormData({ ...formData, username: e.target.value })}
                                    />
                                    <FloatingInput
                                        label="Email Address"
                                        type="email"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                    <FloatingInput
                                        label="Temporary Password"
                                        type="password"
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                                <Button
                                    onClick={handleInvite}
                                    disabled={inviting}
                                    className="w-full h-12 mt-4 rounded-none border-2 border-black bg-black text-white hover:bg-gray-800 uppercase font-bold tracking-widest"
                                >
                                    {inviting ? <Loader2 className="animate-spin w-4 h-4" /> : "Create User & Add"}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </header>

            {/* --- MEMBERS LIST --- */}
            <main className="max-w-5xl mx-auto">
                <div className="border-2 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <div className="grid grid-cols-12 gap-4 p-4 border-b-2 border-black bg-gray-50 text-xs font-black uppercase tracking-widest text-gray-500">
                        <div className="col-span-4">User</div>
                        <div className="col-span-4">Email</div>
                        <div className="col-span-2 text-center">Role</div>
                        <div className="col-span-2 text-right">Action</div>
                    </div>

                    {/* 👇 Render filtered list */}
                    {membersToDisplay.length > 0 ? (
                        membersToDisplay.map((member: any) => (
                            <div key={member.id} className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 items-center hover:bg-gray-50 transition-colors group">

                                {/* User Column */}
                                <div className="col-span-4 flex items-center gap-3">
                                    <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-bold text-xs">
                                        {member.username.substring(0, 2).toUpperCase()}
                                    </div>
                                    <span className="font-bold text-sm">{member.username}</span>
                                </div>

                                {/* Email Column */}
                                <div className="col-span-4 text-sm font-mono text-gray-600 truncate">
                                    {member.email}
                                </div>

                                {/* Role Column */}
                                <div className="col-span-2 flex justify-center">
                                    {member.isStaff ? (
                                        <span className="inline-flex items-center gap-1 bg-black text-white text-[10px] font-bold px-2 py-1 uppercase">
                                            <Shield className="w-3 h-3" /> Admin
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 bg-gray-200 text-gray-600 text-[10px] font-bold px-2 py-1 uppercase">
                                            <UserIcon className="w-3 h-3" /> Member
                                        </span>
                                    )}
                                </div>

                                {/* Action Column */}
                                <div className="col-span-2 flex justify-end">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none hover:bg-red-100 hover:text-red-600">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-gray-400 font-mono text-sm uppercase">
                            No other members in this team.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};
