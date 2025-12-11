import { DashboardPage } from "./pages/dashboard-page";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ProjectDetailsPage } from "./pages/project-details-page";
import { LoginPage } from "./pages/login-page";
import { AuthLayout } from "./layout/AuthLayout";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route element={<AuthLayout />}>
                    <Route path="/" element={
                        <DashboardPage />
                    } />
                    <Route path="/projects/:id" element={
                        <ProjectDetailsPage />
                    } />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

