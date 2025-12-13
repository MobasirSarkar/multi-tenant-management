import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { GET_DASHBOARD_DATA, GET_MY_ORGS } from "../graphql/queries";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectCard, type ProjectProps } from "@/features/dashboard/ProjectCard";
import { CheckCircle2, Clock, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/features/dashboard/DashboardHeader";

export const DashboardPage = () => {
    const { orgSlug } = useParams();
    const navigate = useNavigate();

    const { data: meData, loading: meLoading } = useQuery(GET_MY_ORGS, {
        fetchPolicy: "cache-first"
    });

    const currentOrg = meData?.me?.organizations?.find((o: any) => o.slug === orgSlug);
    const orgName = currentOrg?.name || orgSlug; // Fallback to slug while loading

    const { loading, error, data } = useQuery(GET_DASHBOARD_DATA, {
        variables: { orgSlug: orgSlug || "" },
        skip: !orgSlug,
        fetchPolicy: "cache-and-network"
    });

    useEffect(() => {
        if (!orgSlug && meData?.me?.organizations?.length > 0) {
            const firstOrgSlug = meData.me.organizations[0].slug;
            console.log("Redirecting to:", firstOrgSlug);
            navigate(`/${firstOrgSlug}`, { replace: true });
        }
    }, [orgSlug, meData, navigate]);

    if (!orgSlug) {
        if (meLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
        if (!meData?.me?.organizations?.length) return <div className="p-10">You are not a member of any organization.</div>;
        return null; // The useEffect will trigger the redirect
    }

    if (error) {
        return (
            <div className="flex h-screen flex-col items-center justify-center gap-4 bg-red-50 text-red-600 font-mono">
                <h2 className="text-xl font-bold">SYSTEM ERROR</h2>
                <p>{error.message}</p>
                <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
            </div>
        );
    }

    const myTasks = data?.myTasks || [];
    const projects = data?.projects || [];
    const isAdmin = meData?.me?.isStaff

    return (
        <div className="min-h-screen bg-gray-50/50 p-8 pb-20 font-mono text-foreground flex flex-col">

            <DashboardHeader
                orgName={orgName}
                orgSlug={orgSlug}
                isAdmin={isAdmin}
            />

            {/* My Active Tasks Section */}
            <div className="px-4 md:px-8 w-full max-w-[1600px] mx-auto">
                <div className="mb-12">
                    <h2 className="text-xl font-black uppercase tracking-tighter mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5" /> My Active Tasks
                    </h2>

                    {myTasks.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {myTasks.map((task: any) => (
                                <Link
                                    key={task.id}
                                    to={`/${orgSlug}/projects/${task.project.id}`}
                                    className="group block border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] font-bold uppercase bg-gray-100 px-2 py-1 border border-black/10 truncate max-w-[120px]">
                                            {task.project.name}
                                        </span>
                                        <span className={`text-[10px] font-bold uppercase px-2 py-1 border border-black ${task.status === 'DONE' ? 'bg-black text-white' : 'bg-white text-black'}`}>
                                            {task.status.replace("_", " ")}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-sm leading-tight mb-4 group-hover:underline decoration-2">
                                        {task.title}
                                    </h3>
                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="flex items-center text-[10px] text-gray-500 gap-1 font-bold uppercase">
                                            <Clock className="w-3 h-3" />
                                            {new Date(task.createdAt).toLocaleDateString()}
                                        </div>
                                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 border-2 border-dashed border-gray-300 text-gray-400 text-center uppercase text-sm">
                            No active tasks assigned to you.
                        </div>
                    )}
                </div>

                {/* Projects Grid */}
                <main>
                    <h2 className="text-xl font-black uppercase tracking-tighter mb-4">Projects</h2>

                    {loading ? (
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex flex-col space-y-3 border-2 border-transparent p-6">
                                    <Skeleton className="h-[125px] w-full rounded-none bg-gray-200" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-[250px] rounded-none bg-gray-200" />
                                        <Skeleton className="h-4 w-[200px] rounded-none bg-gray-200" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="flex h-64 items-center justify-center border-2 border-dashed border-gray-300">
                            <p className="text-muted-foreground">NO PROJECTS FOUND</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {projects.map((project: ProjectProps) => (
                                <ProjectCard key={project.id} project={project} />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};
