import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DELETE_TASK, CREATE_COMMENT } from "@/graphql/mutation"; // Fixed import path if needed
import { GET_MY_ORGS, GET_PROJECTS_DETAILS } from "@/graphql/queries";
import { useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";
import { MessageSquare, Send, User, Trash2, Loader2, X } from "lucide-react"; // Added X if you want custom close
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// ... (Interfaces remain the same) ...
interface Comment {
    id: string;
    content: string;
    authorEmail: string;
    createdAt: string;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    status: string;
    assigneeEmail: string;
    createdAt: string;
    comments: Comment[];
    projectId?: string;
}

interface TaskDetailsModalProps {
    task: Task | null;
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
}

export const TaskDetailModal = ({ task, isOpen, onClose, projectId }: TaskDetailsModalProps) => {
    const [newComment, setNewComment] = useState("");

    // --- Mutations ---
    const [deleteTask, { loading: deleting }] = useMutation(DELETE_TASK, {
        refetchQueries: [{ query: GET_PROJECTS_DETAILS, variables: { id: projectId } }],
        onCompleted: () => onClose(),
        onError: (err) => alert("Failed to delete: " + err.message),
    });

    const [createComment, { loading }] = useMutation(CREATE_COMMENT, {
        refetchQueries: [{ query: GET_PROJECTS_DETAILS, variables: { id: projectId } }],
        onCompleted: () => setNewComment(""),
    });

    // --- Handlers ---
    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this task?")) {
            deleteTask({ variables: { taskId: task?.id } });
        }
    };

    const { data } = useQuery(GET_MY_ORGS, {
        fetchPolicy: "cache-first"
    })

    const CURRENT_USER = data?.me?.email


    const handleSendComment = () => {
        if (!newComment.trim() || !task) return;
        createComment({
            variables: {
                taskId: task.id,
                content: newComment,
                authorEmail: CURRENT_USER
            }
        });
    };

    if (!task) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[600px] w-full p-0 gap-0 border-2 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none overflow-hidden max-h-[85vh] flex flex-col">

                <DialogHeader className="p-6 pb-4 border-b-2 border-black bg-gray-50 shrink-0">
                    <div className="flex justify-between items-center mb-4 pr-6">
                        <Badge variant="outline" className="rounded-none bg-white border-black text-black uppercase tracking-widest text-[10px] py-1 px-2">
                            {task.status.replace("_", " ")}
                        </Badge>

                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-mono text-gray-500 uppercase hidden sm:inline-block">
                                {new Date(task.createdAt).toLocaleDateString()}
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleDelete}
                                disabled={deleting}
                                className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-none transition-colors -mr-2"
                                title="Delete Task"
                            >
                                {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>

                    <DialogTitle className="text-2xl font-black uppercase tracking-tighter leading-tight mb-3 pr-4">
                        {task.title}
                    </DialogTitle>

                    <div className="flex items-center gap-2 text-xs font-mono text-gray-600 bg-white border border-black/10 p-2 w-fit">
                        <User className="w-3 h-3" />
                        <span className="uppercase tracking-wider">{task.assigneeEmail || "Unassigned"}</span>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6 min-h-0">
                    <div className="mb-8">
                        <h4 className="font-bold uppercase text-xs tracking-wider mb-2 text-gray-400">Description</h4>
                        <div className="text-sm leading-relaxed whitespace-pre-wrap text-gray-800">
                            {task.description || <span className="italic text-gray-400">No description provided.</span>}
                        </div>
                    </div>

                    <Separator className="bg-black/10 my-6" />

                    <div>
                        <h4 className="flex items-center gap-2 font-bold uppercase text-xs tracking-wider mb-4 text-black">
                            <MessageSquare className="w-4 h-4" />
                            Discussion <span className="text-gray-400">({task.comments?.length || 0})</span>
                        </h4>

                        <div className="space-y-4">
                            {task.comments && task.comments.length > 0 ? (
                                task.comments.map((comment) => (
                                    <div key={comment.id} className="group relative pl-4 border-l-2 border-black/10 hover:border-black transition-colors">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <span className="font-bold text-xs uppercase tracking-wide">{comment.authorEmail}</span>
                                            <span className="text-[10px] font-mono text-gray-400 group-hover:text-gray-600">
                                                {new Date(comment.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-700">{comment.content}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 border-2 border-dashed border-gray-200">
                                    <p className="text-xs text-gray-400 uppercase tracking-widest">No comments yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t-2 border-black bg-gray-50 shrink-0">
                    <div className="flex gap-0 shadow-sm">
                        <Textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            className="min-h-[50px] rounded-none border-2 border-black border-r-0 resize-none focus-visible:ring-0 bg-white"
                        />
                        <Button
                            onClick={handleSendComment}
                            disabled={loading || !newComment.trim()}
                            className="h-auto px-6 rounded-none border-2 border-black bg-black text-white hover:bg-gray-800 uppercase font-bold tracking-wider"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        </Button>
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    );
};
