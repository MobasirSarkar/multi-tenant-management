import { taskFormSchema, type TaskFormValues } from "@/types/task";
import { useState } from "react";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@apollo/client/react";
import { CREATE_TASK } from "@/graphql/mutation";
import { GET_PROJECTS_DETAILS } from "@/graphql/queries";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2 } from "lucide-react"


interface CreateTaskModalProps {
    projectId: string;
}

export const CreateTaskModal = ({ projectId }: CreateTaskModalProps) => {
    console.log(projectId)
    const [open, setOpen] = useState(false);

    const { register, handleSubmit, reset, formState: { errors }, } = useForm<TaskFormValues>({
        resolver: zodResolver(taskFormSchema)
    })

    const [createTask, { loading }] = useMutation(CREATE_TASK, {
        refetchQueries: [{ query: GET_PROJECTS_DETAILS, variables: { id: projectId } }],
        onCompleted: () => {
            setOpen(false);
            reset();
        },
        onError: (err) => {
            console.error(err.message)
            alert("Error creating task: " + err.message)
        }
    })

    const onSubmit = (data: TaskFormValues) => {
        createTask({
            variables: {
                projectId: projectId,
                title: data.title,
                description: data.description || "",
                assigneeEmail: data.assigneeEmail || ""
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="rounded-none border-2 border-black bg-black text-white font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    <Plus className="mr-2 h-4 w-4" /> Add Task
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px] rounded-none border-2 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
                <DialogHeader>
                    <DialogTitle className="uppercase font-black text-2xl tracking-tighter">New Task</DialogTitle>
                    <DialogDescription className="font-mono text-xs text-gray-500">
                        Add a new item to the board.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">

                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title" className="uppercase font-bold text-xs tracking-wider">Task Title</Label>
                        <Input
                            id="title"
                            placeholder="e.g. Fix Navigation Bug"
                            className="rounded-none border-black focus-visible:ring-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]"
                            {...register("title")}
                        />
                        {errors.title && <span className="text-red-600 text-xs font-bold">{errors.title.message}</span>}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description" className="uppercase font-bold text-xs tracking-wider">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Details about the task..."
                            className="rounded-none border-black focus-visible:ring-0 min-h-[100px]"
                            {...register("description")}
                        />
                    </div>

                    {/* Assignee */}
                    <div className="space-y-2">
                        <Label htmlFor="assignee" className="uppercase font-bold text-xs tracking-wider">Assignee Email</Label>
                        <Input
                            id="assignee"
                            type="email"
                            placeholder="developer@company.com"
                            className="rounded-none border-black focus-visible:ring-0"
                            {...register("assigneeEmail")}
                        />
                        {errors.assigneeEmail && <span className="text-red-600 text-xs font-bold">{errors.assigneeEmail.message}</span>}
                    </div>

                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-none bg-black text-white hover:bg-gray-800 border-2 border-black uppercase font-bold tracking-wider"
                        >
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Task"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
