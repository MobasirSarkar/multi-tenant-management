import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client/react";
import { DndContext, type DragEndEvent, type DragStartEvent, DragOverlay, useSensor, useSensors, MouseSensor, TouchSensor } from "@dnd-kit/core";
import { ArrowLeft, Calendar, Settings, Clock } from "lucide-react";

// GraphQL
import { GET_PROJECTS_DETAILS } from "@/graphql/queries";
import { UPDATE_TASK_STATUS } from "@/graphql/mutation";

// Components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DroppableColumn } from "@/features/project/DroppableColumn";
import { DraggableTaskCard, TaskCard } from "@/features/project/DraggableTaskCard";
import { TaskDetailModal, type Task } from "@/features/project/TaskDetailModal";
import { CreateTaskModal } from "@/features/project/CreateTaskModal";
import { EditProjectModal } from "@/features/project/EditProjectModal";
import { Badge } from "@/components/ui/badge";

const COLUMNS = [
    { id: "TODO", title: "To Do", color: 'bg-white' },
    { id: "IN_PROGRESS", title: "In Progress", color: "bg-gray-50" },
    { id: 'DONE', title: 'Done', color: 'bg-black text-white' }
]

export const ProjectDetailsPage = () => {
    // --- Router Params (Typed) ---
    const { orgSlug, id } = useParams<{ orgSlug: string; id: string }>();

    // --- State ---
    const [updateTaskStatus] = useMutation(UPDATE_TASK_STATUS)
    const [localTasks, setLocalTasks] = useState<Task[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    // --- Query ---
    const { loading, error, data } = useQuery(GET_PROJECTS_DETAILS, {
        variables: { id },
        fetchPolicy: "cache-and-network",
        skip: !id // Don't run if ID is missing
    })

    // --- Drag & Drop Logic ---
    const activeTask = localTasks.find(t => t.id === activeId)
    const sensors = useSensors(useSensor(MouseSensor, {
        activationConstraint: { distance: 5 }
    }), useSensor(TouchSensor, {
        activationConstraint: { delay: 250, tolerance: 5 }
    }))

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string)
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;
        const taskId = active.id as string;
        const newStatus = over.id as string;
        if (active.id !== over.id) {
            setLocalTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: newStatus as any } : t)))
            updateTaskStatus({
                variables: { taskId, status: newStatus }
            }).catch((err) => console.error("failed: " + err))
        }
    }

    useEffect(() => {
        if (data?.project?.tasks) {
            setLocalTasks(data.project.tasks);
        }
    }, [data])

    // --- Render Loading/Error States ---
    if (!orgSlug || !id) return <div className="p-10 text-red-600 font-mono">ERROR: INVALID URL PARAMETERS</div>;
    if (loading && !data) return <div className="p-10 font-mono">LOADING PROJECT...</div>
    if (error) return <div className="p-10 text-red-600 font-mono">Error: {error.message}</div>

    const project = data.project;

    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} sensors={sensors}>
            <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 font-mono">

                {/* --- HEADER SECTION --- */}
                <div className="mb-8 max-w-7xl mx-auto">
                    {/* Back Link - Uses orgSlug safely now */}
                    <Link
                        to={`/${orgSlug}`}
                        className="inline-flex items-center text-xs font-bold uppercase hover:underline mb-4 text-gray-500 hover:text-black transition-colors"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                    </Link>

                    {/* Project Info Card */}
                    <Card className="rounded-none border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-6 justify-between items-start">

                                {/* LEFT: Title & Info */}
                                <div className="space-y-4 flex-1 w-full">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-3 mb-2">
                                            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none break-words">
                                                {project.name}
                                            </h1>
                                            <Badge variant="outline" className="rounded-none border-black bg-gray-100 text-[10px] uppercase">
                                                {project.status || 'Active'}
                                            </Badge>
                                        </div>

                                        <div className="flex flex-wrap gap-4 text-xs font-bold text-gray-500 uppercase tracking-wide">
                                            {project.dueDate && (
                                                <div className="flex items-center gap-1.5 text-black">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>Due: {new Date(project.dueDate).toLocaleDateString()}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-4 h-4" />
                                                <span>{project.taskCount} Tasks</span>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-600 leading-relaxed max-w-3xl border-l-2 border-black/10 pl-4">
                                        {project.description || "No description provided."}
                                    </p>
                                </div>

                                {/* RIGHT: Actions */}
                                <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto pt-2 md:pt-0">
                                    <CreateTaskModal projectId={id} />

                                    <Button
                                        variant="outline"
                                        onClick={() => setIsEditOpen(true)}
                                        className="rounded-none border-2 border-black hover:bg-gray-100 flex items-center justify-center gap-2 flex-1 md:flex-none"
                                    >
                                        <Settings className="w-4 h-4" />
                                        <span className="md:hidden">Settings</span>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Edit Modal */}
                    {project && (
                        <EditProjectModal
                            project={project}
                            open={isEditOpen}
                            setOpen={setIsEditOpen}
                        />
                    )}
                </div>

                {/* --- KANBAN BOARD --- */}
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[calc(100vh-350px)] min-h-[500px]">
                    {COLUMNS.map((col) => {
                        const columnTasks = localTasks.filter((t) => t.status === col.id);
                        return (
                            <DroppableColumn key={col.id} id={col.id} title={col.title} count={columnTasks.length}>
                                {columnTasks.map((task) => (
                                    <div key={task.id} onClick={() => setSelectedTask(task)}>
                                        <DraggableTaskCard key={task.id} task={task} />
                                    </div>
                                ))}
                            </DroppableColumn>
                        );
                    })}
                </div>

                {/* --- DRAG OVERLAY --- */}
                <DragOverlay>
                    {activeId && activeTask ? (
                        <div className="rotate-3 opacity-90 cursor-grabbing">
                            <TaskCard task={activeTask} isOverlay />
                        </div>
                    ) : null}
                </DragOverlay>

                {/* --- TASK DETAIL MODAL --- */}
                <TaskDetailModal
                    isOpen={!!selectedTask}
                    onClose={() => setSelectedTask(null)}
                    task={selectedTask}
                    projectId={id}
                />
            </div>
        </DndContext >
    );
}
