import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FolderGit2 } from "lucide-react"
import { Link } from "react-router-dom"
export interface ProjectProps {
    id: string;
    name: string;
    status: string;
    taskCount: number;
    completedTaskCount: number;
}

export const ProjectCard = ({ project }: { project: ProjectProps }) => {
    const progress = project.taskCount > 0 ? Math.round((project.completedTaskCount / project.taskCount) * 100) : 0;


    const getStatusVariant = (status: string) => {
        switch (status) {
            case "ACTIVE":
                return "default"
            case "COMPLETED":
                return "secondary"
            default:
                return "outline"
        }
    }
    return (
        <Link to={`/projects/${project.id}`} className="block h-full">
            <Card className="group flex h-full flex-col justify-between border-2 border-black shadow-none transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none">
                <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                        <div className="border border-black p-2 transition-colors group-hover:bg-black group-hover:text-white">
                            <FolderGit2 className="h-5 w-5" />
                        </div>
                        <Badge
                            variant={getStatusVariant(project.status)}
                            className="rounded-none border-black px-2 uppercase"
                        >
                            {project.status}
                        </Badge>
                    </div>
                    <CardTitle className="mt-4 text-xl font-bold uppercase leading-none tracking-tight">
                        {project.name}
                    </CardTitle>
                    <CardDescription className="font-mono text-xs">
                        Created: {new Date().toLocaleDateString()}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="text-sm font-medium">
                        {project.completedTaskCount} / {project.taskCount} Tasks Completed
                    </div>
                </CardContent>

                <CardFooter className="block pt-0">
                    <div className="mb-2 flex justify-between text-xs font-bold uppercase">
                        <span>Progress</span>
                        <span>{progress}%</span>
                    </div>
                    <Progress
                        value={progress}
                        className="h-3 rounded-none border border-black bg-white [&>div]:bg-black"
                    />
                </CardFooter>
            </Card>
        </Link>
    );
}
