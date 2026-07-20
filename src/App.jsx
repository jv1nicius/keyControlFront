import { BrowserRouter, Routes, Route } from "react-router-dom"

import Rooms from "./pages/Rooms"
import Dashboard from "./pages/Dashboard"
import History from "./pages/History"
import Home from "./pages/Home"
import Keys from "./pages/Keys"
import KeyReservations from "./pages/KeyReservations"
import Profile from "./pages/Profile"
import ResponsiblePerson from "./pages/ResponsiblePersons"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import KeyWithdrawals from "./pages/KeyWithdrawals"

import AdminLayout from "./layouts/AdminLayout"
import ResponsibleLayout from "./layouts/ResponsibleLayout"

import { useAuth } from "./contexts/hooks/useAuth"
import { Toaster } from 'sonner';

function App() {
    const { user, loading, isAuthenticated, isAdmin, isResponsavel } = useAuth();

    if (loading) {
        return <h1>Carregando...</h1>;
    }

    return (
        <BrowserRouter>
            <Routes>
                {!isAuthenticated && (
                    < Route path="/" element={<Home />} />
                )}
                {isAuthenticated && isAdmin && (
                    <Route element={<AdminLayout />}>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/reservas" element={<KeyReservations />} />
                        <Route path="/retiradas" element={<KeyWithdrawals />} />
                        <Route path="/salas" element={<Rooms />} />
                        <Route path="/chaves" element={<Keys />} />
                        <Route path="/responsaveis" element={<ResponsiblePerson />} />
                        <Route path="/historico" element={<History />} />
                    </Route>
                )}

                {isAuthenticated && isResponsavel && (
                    <Route element={<ResponsibleLayout />}>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/reservas" element={<KeyReservations />} />
                        <Route path="/retiradas" element={<KeyWithdrawals />} />
                        <Route path="/historico" element={<History />} />
                    </Route>
                )}
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/profile" element={<Profile />} />


            </Routes>
            <Toaster
                position="top-right"
                richColors
                closeButton
            />
        </BrowserRouter>
    );
}

export default App;