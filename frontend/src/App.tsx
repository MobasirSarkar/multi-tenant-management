import { DashboardPage } from "./pages/dashboard-page";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ProjectDetailsPage } from "./pages/project-details-page";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/projects/:id" element={<ProjectDetailsPage />} />
            </Routes>
        </BrowserRouter>
    )
}

