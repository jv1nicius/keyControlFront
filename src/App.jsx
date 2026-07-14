import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminLayout from "./layouts/AdminLayout";
import ResponsibleLayout from "./layouts/ResponsibleLayout";

import Home from "./pages/Home"
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";

import Withdrawals from "./pages/Withdrawals"
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import KeyCheckout from "./pages/KeyCheckout";
import Profile from "./pages/Profile"
import History from "./pages/History"
import ClassRoom from "./pages/Classroom"
import Key from "./pages/Keys"
import Responsible from "./pages/Responsible"
import { useAuth } from "./contexts/hooks/useAuth";

import { Toaster } from 'sonner';

function App() {
    const { user, loading, isAuthenticated, isAdmin, isResponsavel } = useAuth();

    if (loading) {
        return <h1>Carregando...</h1>;
    }
    console.log({ user, isAdmin, isResponsavel });

    return (
        <BrowserRouter>
            <Routes>
                {!isAuthenticated && (
                    < Route path="/" element={<Home />} />
                )}
                {isAuthenticated && isAdmin && (
                    <Route element={<AdminLayout />}>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/reservas" element={<KeyCheckout />} />
                        <Route path="/retiradas" element={<Withdrawals />} />
                        <Route path="/salas" element={<ClassRoom />} />
                        <Route path="/chaves" element={<Key />} />
                        <Route path="/responsaveis" element={<Responsible />} />
                        <Route path="/historico" element={<History />} />
                    </Route>
                )}

                {isAuthenticated && isResponsavel && (
                    <Route element={<ResponsibleLayout />}>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/reservas" element={<KeyCheckout />} />
                        <Route path="/retiradas" element={<Withdrawals />} />
                        <Route path="/historico" element={<History />} />
                    </Route>
                )}
                <Route path="/signin" element={<Signin />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/settings" element={<Settings />} />
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