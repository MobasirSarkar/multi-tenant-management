import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Activity, Calendar, Loader2 } from "lucide-react";
import { useMutation } from "@apollo/client/react";
import { UPDATE_PROJECT } from "@/graphql/mutation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EditProjectModalProps {
    project: {
        id: string;
        name: string;
        description: string;
        dueDate: string;
        status: string;
    };
    open: boolean;
    setOpen: (open: boolean) => void;
}
const STATUS_OPTIONS = [
    { value: "ACTIVE", label: "Active" },
    { value: "COMPLETED", label: "Completed" },
    { value: "ON_HOLD", label: "On Hold" }
];

export const EditProjectModal = ({ project, open, setOpen }: EditProjectModalProps) => {
    const [name, setName] = useState(project.name);
    const [desc, setDesc] = useState(project.description);
    const [dueDate, setDueDate] = useState(project.dueDate ? project.dueDate.split('T')[0] : "");
    const [status, setStatus] = useState(project.status)

    // Sync state if the project prop changes
    useEffect(() => {
        setName(project.name);
        setDesc(project.description);
        setDueDate(project.dueDate);
        setStatus(project.status)
    }, [project]);

    const [updateProject, { loading }] = useMutation(UPDATE_PROJECT, {
        refetchQueries: ["GetProjectDetails"],
        onCompleted: () => setOpen(false),
    });

    const handleSave = () => {
        updateProject({
            variables: {
                projectId: project.id,
                name,
                description: desc,
                dueDate: dueDate || null,
                status
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="w-[95vw] max-w-[500px] rounded-none border-2 border-black p-0 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden">
                <DialogHeader className="p-6 border-b-2 border-black bg-gray-50">
                    <DialogTitle className="text-2xl font-black uppercase tracking-tighter">
                        Edit Project
                    </DialogTitle>
                </DialogHeader>

                <div className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider">Project Name</label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="rounded-none border-2 border-black focus-visible:ring-0 font-bold"
                        />
                    </div>
                    {/* Status Dropdown (Shadcn UI) */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider">Status</label>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger className="w-full h-10 rounded-none border-2 border-black focus:ring-0 ring-offset-0">
                                <div className="flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-gray-500" />
                                    <SelectValue placeholder="Select Status" />
                                </div>
                            </SelectTrigger>
                            <SelectContent className="rounded-none border-2 border-black">
                                {STATUS_OPTIONS.map((opt) => (
                                    <SelectItem
                                        key={opt.value}
                                        value={opt.value}
                                        className="uppercase font-mono text-xs focus:bg-gray-100 focus:text-black cursor-pointer"
                                    >
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider">Description</label>
                        <Textarea
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            className="rounded-none border-2 border-black focus-visible:ring-0 min-h-[120px] resize-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider">Due Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-500 pointer-events-none" />
                            <Input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="rounded-none border-2 border-black focus-visible:ring-0 pl-10 font-mono text-sm"
                            />
                        </div>
                    </div>
                    <Button
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full h-12 rounded-none border-2 border-black bg-black text-white hover:bg-gray-800 uppercase font-bold tracking-widest"
                    >
                        {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Save Changes"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
