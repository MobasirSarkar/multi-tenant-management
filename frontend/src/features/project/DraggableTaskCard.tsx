import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"

interface Task {
    id: string;
    title: string;
    assigneeEmail: string;
}

export const TaskCard = ({ task, isOverlay = false }: { task: Task, isOverlay?: boolean }) => {
    return (
        <Card className={`
      rounded-none border-2 border-black bg-white mb-4
      ${isOverlay ? 'shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] cursor-grabbing' : 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-grab hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'}
      transition-all
    `}>
            <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-bold leading-tight select-none">
                    {task.title}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="mt-2">
                    <span className="text-[10px] bg-gray-100 px-1 border border-black/10 font-mono uppercase select-none">
                        {task.assigneeEmail || "Unassigned"}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
};


export const DraggableTaskCard = ({ task }: { task: Task }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging
    } = useDraggable({
        id: task.id,
        data: { task }
    })

    const style = transform ? {
        transform: CSS.Translate.toString(transform)
    } : undefined

    if (isDragging) {
        return (
            <div ref={setNodeRef} style={style} className="opacity-30,">
                <TaskCard task={task} />
            </div>
        )
    }

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="touch-none">
            <TaskCard task={task} />
        </div>
    );
}
