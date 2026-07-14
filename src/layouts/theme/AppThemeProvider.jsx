import * as React from 'react';
import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { createAppTheme } from './theme'

const STORAGE_KEY = 'keycontrol-theme-mode';

const ColorModeContext = createContext({
    mode: 'light',
    toggleColorMode: () => { },
});

/**
 * Hook para ler o modo atual e alternar entre light/dark
 * a partir de qualquer componente da árvore.
 *
 * Exemplo:
 *   const { mode, toggleColorMode } = useColorMode();
 */
export function useColorMode() {
    return useContext(ColorModeContext);
}

/**
 * Envolve a aplicação, provendo o ThemeProvider do MUI já configurado
 * com o modo escolhido pelo usuário (persistido no localStorage,
 * caindo para a preferência do sistema operacional na primeira visita).
 */
export default function AppThemeProvider({ children }) {
    const [mode, setMode] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === 'light' || saved === 'dark') return saved;

        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return prefersDark ? 'dark' : 'light';
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, mode);
    }, [mode]);

    const colorMode = useMemo(
        () => ({
            mode,
            toggleColorMode: () => {
                setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
            },
        }),
        [mode],
    );

    const theme = useMemo(() => createAppTheme(mode), [mode]);

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}