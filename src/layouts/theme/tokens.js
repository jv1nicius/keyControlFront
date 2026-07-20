export const neutral = {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0A0A0A',
};

export const brass = {
    50: '#FBF6EC',
    100: '#F5E8CC',
    200: '#EAD09B',
    300: '#DCB367',
    400: '#C99640',
    500: '#AD7C2C',
    600: '#8F6420',
    700: '#744E19',
    800: '#5C3F17',
    900: '#4A3315',
};

export const semantic = {
    success: { light: '#F0FDF4', main: '#16A34A', dark: '#15803D', border: '#BBF7D0' },
    error: { light: '#FEF2F2', main: '#DC2626', dark: '#B91C1C', border: '#FECACA' },
    warning: { light: '#FFF7ED', main: '#C2410C', dark: '#9A3412', border: '#FED7AA' },
    info: { light: '#EFF6FF', main: '#2563EB', dark: '#1D4ED8', border: '#BFDBFE' },
};

export const radius = {
    sm: 8,
    md: 12,
    lg: 16,
    pill: 999,
};

export const fontFamily = {
    display: '"Inter","Roboto","Helvetica Neue",Arial,sans-serif',
    body: '"Roboto","Inter","Helvetica Neue",Arial,sans-serif',
};

export const typeScale = {
    h1: { fontSize: '2.25rem', lineHeight: 1.2, fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontSize: '1.875rem', lineHeight: 1.25, fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontSize: '1.5rem', lineHeight: 1.3, fontWeight: 600 },
    h4: { fontSize: '1.25rem', lineHeight: 1.35, fontWeight: 600 },
    h5: { fontSize: '1.125rem', lineHeight: 1.4, fontWeight: 600 },
    h6: { fontSize: '1rem', lineHeight: 1.4, fontWeight: 600 },
    subtitle1: { fontSize: '0.9375rem', lineHeight: 1.5, fontWeight: 500 },
    subtitle2: { fontSize: '0.8125rem', lineHeight: 1.5, fontWeight: 500, letterSpacing: '0.02em' },
    body1: { fontSize: '0.9375rem', lineHeight: 1.6, fontWeight: 400 },
    body2: { fontSize: '0.8125rem', lineHeight: 1.55, fontWeight: 400 },
    button: { fontSize: '0.8125rem', lineHeight: 1.4, fontWeight: 600, letterSpacing: '0.01em', textTransform: 'none' },
    caption: { fontSize: '0.75rem', lineHeight: 1.5, fontWeight: 400 },
    overline: { fontSize: '0.6875rem', lineHeight: 1.5, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' },
};

export const statusColorMap = {
    livre: 'success',
    disponivel: 'success',
    ativa: 'success',
    devolvida: 'success',
    ocupada: 'error',
    desativada: 'error',
    atrasada: 'error',
    cancelada: 'error',
    finalizada: 'default',
    retirada: 'info',
    semanal: 'info',
    pendente: 'warning',
};