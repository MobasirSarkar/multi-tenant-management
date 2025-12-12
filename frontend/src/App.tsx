import { DashboardPage } from "./pages/dashboard-page";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ProjectDetailsPage } from "./pages/project-details-page";
import { LoginPage } from "./pages/login-page";
import { AuthLayout } from "./layout/AuthLayout";
import { RootRedirect } from "./features/auth/RootRedirect";
import { AdminRoute } from "./features/auth/AuthRoute";
import { TeamSettingsPage } from "./pages/team-settings-page";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route element={<AuthLayout />}>
                    <Route path="/" element={<RootRedirect />} />
                    <Route path="/:orgSlug" element={
                        <DashboardPage />
                    } />
                    <Route path="/:orgSlug/projects/:id" element={
                        <ProjectDetailsPage />
                    } />

                    <Route element={<AdminRoute />}>
                        <Route path="/:orgSlug/settings" element={<TeamSettingsPage />} />
                    </Route>

                </Route>
            </Routes>
        </BrowserRouter>
    )
}

