import type React from "react";
import { useDroppable } from "@dnd-kit/core"
import { Badge } from "@/components/ui/badge";

interface DroppableColumnProps {
    id: string;
    title: string;
    count: number;
    children: React.ReactNode
}

export const DroppableColumn = ({ id, title, count, children }: DroppableColumnProps) => {
    const { setNodeRef, isOver } = useDroppable({
        id: id
    })
    return (
        <div
            ref={setNodeRef}
            className={`flex flex-col h-full border-2 border-black/10 transition-colors ${isOver ? "bg-black/5" : "bg-gray-100/50"
                }`}
        >
            {/* Column Header */}
            <div className={`p-4 border-b-2 border-black flex justify-between items-center ${id === 'DONE' ? 'bg-black text-white' : 'bg-white'
                }`}>
                <h3 className="font-bold uppercase tracking-wider">{title}</h3>
                <Badge variant="outline" className="rounded-none bg-white text-black border-black">
                    {count}
                </Badge>
            </div>

            {/* Task List Area */}
            <div className="flex-1 p-4 overflow-y-auto">
                {children}
                {count === 0 && (
                    <div className="text-center py-10 border-2 border-dashed border-gray-300">
                        <span className="text-xs text-gray-400 uppercase">Drop Here</span>
                    </div>
                )}
            </div>
        </div>
    );
}
