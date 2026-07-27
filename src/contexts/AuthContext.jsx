import { createContext, useCallback, useEffect, useState } from "react";

import { api } from "../services/api";

export const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const isAuthenticated = !!user;
    const isAdmin = user?.funcao === "admin";
    const isResponsavel = user?.funcao === "responsavel";

    const loadUser = useCallback(async () => {
        try {
            const res = await fetch(`${API_URL}/me`, {
                method: "GET",
                credentials: "include",
            });

            if (!res.ok) {
                setUser(null);
                return;
            }

            const data = await res.json();

            setUser({
                user_id: data.id,
                usuario: data.usuario,
                data_nascimento: data.data_nascimento,
                email: data.email,
                funcao: data.funcao,
            });
        } catch (err) {
            console.warn("[AuthContext] loadUser falhou:", err.message);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUser();
    }, [loadUser]);


    async function login(email, senha) {
        const res = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email, senha }),
        });

        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.message ?? "Erro ao fazer login");
        }

        setUser({
            user_id: data.id,
            usuario: data.usuario,
                            data_nascimento: data.data_nascimento,
            email: data.email,
            funcao: data.funcao,
        });
    }

    async function logout() {
        try {
            await fetch(`${API_URL}/logout`, {
                method: "POST",
                credentials: "include",
            });
        } catch (err) {
            console.warn("[AuthContext] logout falhou:", err.message);
        } finally {
            setUser(null);
        }
    }


    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            logout,
            loadUser,
            isAuthenticated,
            isAdmin,
            isResponsavel,
        }}>
            {children}
        </AuthContext.Provider>
    );
}