import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./layouts/Layout";

import Home from "./pages/Home"

import Signin from "./pages/Signin";
import Signup from "./pages/Signup";

import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import KeyCheckout from "./pages/KeyCheckout";
import Profile from "./pages/Profile"

import { useAuth } from "./contexts/hooks/useAuth";

function App() {

    const { token } = useAuth();

    return (
        <BrowserRouter>
            <Routes>
                {!token && <Route path="/" element={<Home />} />}
                {token && (
                    <Route element={<Layout />}>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/keycheckout" element={<KeyCheckout />} />
                    </Route>)
                }
                <Route path="/signin" element={<Signin />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;