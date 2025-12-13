import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FloatingInput } from "@/components/ui/floating-input"
import { CHANGE_PASSWORD, UPDATE_PROFILE } from "@/graphql/mutation"
import { GET_MY_ORGS } from "@/graphql/queries"
import { useMutation, useQuery } from "@apollo/client/react"
import { ArrowLeft, Loader2, Lock, User } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"


export const ProfilePage = () => {
    const navigate = useNavigate()
    const { data, loading } = useQuery(GET_MY_ORGS)

    const [details, setDetails] = useState({ firstName: "", lastName: "", email: "" });
    const [passwords, setPasswords] = useState({ old: "", new: "" })

    // load data into state when query finishes
    useEffect(() => {
        if (data?.me) {
            setDetails({
                firstName: data.me.firstName || "",
                lastName: data.me.lastName || "",
                email: data.me.email || ""
            })
        }
    }, [data])

    // ---Mutations---
    const [updateProfile, { loading: updating }] = useMutation(UPDATE_PROFILE, {
        onCompleted: () => alert("profile updated!"),
        onError: (err) => alert(err.message)
    })

    const [changePassword, { loading: changingPass }] = useMutation(CHANGE_PASSWORD, {
        onCompleted: () => {
            alert("Password changed. Please login again..")
            localStorage.removeItem("token")
            navigate("/login")
        },
        onError: (err) => alert(err.message)
    })

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>
        )
    }

    const backLink = data?.me?.organization?.length > 0 ? `/${data.me.organizations[0].slug}` : "/"

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 font-mono text-foreground">
            {/* Header */}
            <header className="mb-8 max-w-4xl mx-auto">
                <Link to={backLink} className="inline-flex items-center text-xs font-bold uppercase hover:underline mb-6 text-gray-500 hover:text-black transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Workspace
                </Link>
                <h1 className="text-4xl font-black uppercase tracking-tighter">My Profile</h1>
            </header>

            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* --- LEFT: Personal Details --- */}
                <Card className="rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <CardHeader className="border-b-2 border-black bg-white pb-4">
                        <CardTitle className="flex items-center gap-2 text-xl font-black uppercase">
                            <User className="w-5 h-5" /> Personal Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6 bg-white">
                        <div className="grid grid-cols-2 gap-4">
                            <FloatingInput
                                label="First Name"
                                value={details.firstName}
                                onChange={e => setDetails({ ...details, firstName: e.target.value })}
                            />
                            <FloatingInput
                                label="Last Name"
                                value={details.lastName}
                                onChange={e => setDetails({ ...details, lastName: e.target.value })}
                            />
                        </div>
                        <FloatingInput
                            label="Email Address"
                            value={details.email}
                            onChange={e => setDetails({ ...details, email: e.target.value })}
                        />
                        <div className="bg-gray-100 p-3 border-2 border-black/10 text-xs text-gray-500">
                            <strong>NOTE:</strong> Changing your email will require re-verification in the future.
                        </div>
                        <Button
                            onClick={() => updateProfile({ variables: details })}
                            disabled={updating}
                            className="w-full h-12 rounded-none border-2 border-black bg-black text-white hover:bg-gray-800 uppercase font-bold tracking-widest"
                        >
                            {updating ? <Loader2 className="animate-spin" /> : "Save Details"}
                        </Button>
                    </CardContent>
                </Card>

                {/* --- RIGHT: Security --- */}
                <Card className="rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <CardHeader className="border-b-2 border-black bg-gray-50 pb-4">
                        <CardTitle className="flex items-center gap-2 text-xl font-black uppercase">
                            <Lock className="w-5 h-5" /> Security
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6 bg-white">
                        <FloatingInput
                            label="Current Password"
                            type="password"
                            value={passwords.old}
                            onChange={e => setPasswords({ ...passwords, old: e.target.value })}
                        />
                        <FloatingInput
                            label="New Password"
                            type="password"
                            value={passwords.new}
                            onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                        />
                        <Button
                            onClick={() => changePassword({ variables: { oldPassword: passwords.old, newPassword: passwords.new } })}
                            disabled={changingPass}
                            className="w-full h-12 rounded-none border-2 border-black bg-white text-black hover:bg-red-50 hover:text-red-600 hover:border-red-600 uppercase font-bold tracking-widest"
                        >
                            {changingPass ? <Loader2 className="animate-spin" /> : "Change Password"}
                        </Button>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
