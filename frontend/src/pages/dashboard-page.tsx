import { Button } from '@/components/ui/button';
import { GET_PROJECTS } from '../graphql/queries';
import { Skeleton } from '@/components/ui/skeleton';
import { ProjectCard, type ProjectProps } from '@/features/dashboard/ProjectCard';
import { useQuery } from '@apollo/client/react';
import { CreateProjectModel } from '@/features/dashboard/CreateProjectForm';

const ORG_SLUG = "technova-solutions";

export const DashboardPage = () => {
    const { loading, error, data } = useQuery(GET_PROJECTS, {
        variables: { orgSlug: ORG_SLUG },
    });

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
