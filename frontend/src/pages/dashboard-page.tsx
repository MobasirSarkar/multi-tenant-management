import { Button } from '@/components/ui/button';
import { GET_DASHBOARD_DATA, GET_PROJECTS } from '../graphql/queries';
import { Skeleton } from '@/components/ui/skeleton';
import { ProjectCard, type ProjectProps } from '@/features/dashboard/ProjectCard';
import { useQuery } from '@apollo/client/react';
import { CreateProjectModel } from '@/features/dashboard/CreateProjectForm';
import { CheckCircle2, Clock } from 'lucide-react';

const ORG_SLUG = "technova-solutions";

export const DashboardPage = () => {
    const { loading, error, data } = useQuery(GET_DASHBOARD_DATA, {
        variables: { orgSlug: ORG_SLUG || "" },
        skip: !ORG_SLUG,
        fetchPolicy: "cache-and-network"
    });

    const myTasks = data?.myTasks || [];
    const projects = data?.projects || [];

    if (error) {
        return (
            <div className="flex h-screen flex-col items-center justify-center gap-4 bg-red-50 text-red-600">
                <h2 className="font-mono text-xl font-bold">SYSTEM ERROR</h2>
                <p>{error.message}</p>
                <Button variant="outline" onClick={() => window.location.reload()}>
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 p-8 pb-20 font-mono text-foreground">
            {/* Header */}
            <header className="mb-12 flex flex-col gap-4 border-b-2 border-black pb-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter">
                        WorkOS <span className="text-muted-foreground">/ {ORG_SLUG}</span>
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Overview of your active projects
                    </p>
                </div>
                <CreateProjectModel orgSlug={ORG_SLUG} />
            </header>

            <div className="mb-12">
                <h2 className="text-xl font-black uppercase tracking-tighter mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" /> My Active Tasks
                </h2>

                {myTasks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {myTasks.map((task: any) => (
                            <div key={task.id} className="border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] font-bold uppercase bg-gray-100 px-2 py-1 border border-black/10">
                                            {task.project.name}
                                        </span>
                                        <span className={`text-[10px] font-bold uppercase px-2 py-1 border border-black ${task.status === 'DONE' ? 'bg-black text-white' : 'bg-white text-black'}`}>
                                            {task.status.replace("_", " ")}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-sm leading-tight mb-1">{task.title}</h3>
                                </div>
                                <div className="mt-4 flex items-center text-xs text-gray-500 gap-1">
                                    <Clock className="w-3 h-3" />
                                    {new Date(task.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-8 border-2 border-dashed border-gray-300 text-gray-400 text-center uppercase text-sm">
                        No active tasks assigned to you.
                    </div>
                )}
            </div>

            {/* Grid Content */}
            <main>
                {loading ? (
                    // Loading Skeletons
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
                ) : data?.projects.length === 0 ? (
                    <div className="flex h-64 items-center justify-center border-2 border-dashed border-gray-300">
                        <p className="text-muted-foreground">NO PROJECTS FOUND</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {data.projects.map((project: ProjectProps) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};
