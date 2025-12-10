import { useState } from "react"
import { useForm } from "react-hook-form"
import { formSchema, type FormValues } from "@/types/project"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@apollo/client/react"
import { CREATE_PROJECT } from "@/graphql/mutation"
import { GET_PROJECTS } from "@/graphql/queries"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, Plus } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export const CreateProjectModel = ({ orgSlug }: { orgSlug: string }) => {
    const [open, setOpen] = useState(false);

    const { register, handleSubmit, reset, formState: { errors }, } = useForm<FormValues>({
        resolver: zodResolver(formSchema)
    })

    const [createProject, { loading }] = useMutation(CREATE_PROJECT, {
        refetchQueries: [{ query: GET_PROJECTS, variables: { orgSlug } }],
        onCompleted: () => {
            setOpen(false);
            reset();
        },
        onError: (error) => {
            console.error(error);
            alert("Failed to create project: " + error.message)
        }
    })

    const onSubmit = (data: FormValues) => {
        createProject({
            variables: {
                orgSlug,
                name: data.name,
                description: data.description,
                dueDate: data.dueDate || null
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="h-10 rounded-none border-2 border-black bg-black px-6 font-bold text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none">
                    <Plus className="mr-2 h-4 w-4" /> New Project
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px] rounded-none border-2 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
                <DialogHeader>
                    <DialogTitle className="uppercase font-black text-2xl tracking-tighter">Create Project</DialogTitle>
                    <DialogDescription className="font-mono text-xs text-gray-500">
                        Start a new initiative for {orgSlug}.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">

                    {/* Name Field */}
                    <div className="space-y-2">
                        <Label htmlFor="name" className="uppercase font-bold text-xs tracking-wider">Project Name</Label>
                        <Input
                            id="name"
                            placeholder="e.g. Q4 Marketing Campaign"
                            className="rounded-none border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]"
                            {...register("name")}
                        />
                        {errors.name && (
                            <span className="text-red-600 text-xs font-mono font-bold block mt-1">
                                ! {errors.name.message}
                            </span>
                        )}
                    </div>

                    {/* Description Field */}
                    <div className="space-y-2">
                        <Label htmlFor="description" className="uppercase font-bold text-xs tracking-wider">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Brief overview of goals..."
                            className="rounded-none border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-black min-h-[80px]"
                            {...register("description")}
                        />
                    </div>

                    {/* Due Date Field */}
                    <div className="space-y-2">
                        <Label htmlFor="dueDate" className="uppercase font-bold text-xs tracking-wider">Due Date</Label>
                        <Input
                            type="date"
                            id="dueDate"
                            className="rounded-none border-black w-full font-mono uppercase text-sm"
                            {...register("dueDate")}
                        />
                    </div>

                    <DialogFooter>
                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-none bg-black text-white hover:bg-gray-800 border-2 border-black uppercase font-bold tracking-wider transition-all"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                                </>
                            ) : (
                                "Create Project"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
