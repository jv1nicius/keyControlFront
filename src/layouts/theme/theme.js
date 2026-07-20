import { alpha, createTheme, responsiveFontSizes, } from '@mui/material/styles';
import { brass, fontFamily, neutral, radius, semantic, typeScale } from './tokens';

function withMode(token, isLight) {
    return {
        main: token.main,
        light: isLight ? token.light : alpha(token.main, 0.2),
        dark: isLight ? token.dark : token.main,
        contrastText: '#FFFFFF',
    };
}

function createSoftShadows(isLight) {
    const rgb = isLight ? '23,23,23' : '0,0,0';
    const opacity = isLight ? 0.06 : 0.3;
    const shadows = ['none'];
    for (let i = 1; i <= 24; i += 1) {
        const y = Math.round(1 + i * 0.6);
        const blur = Math.round(3 + i * 1.4);
        shadows.push(`0px ${y}px ${blur}px rgba(${rgb}, ${opacity})`);
    }
    return shadows;
}

function getDesignTokens(mode) {
    const isLight = mode === 'light';

    return {
        palette: {
            mode,
            primary: {
                main: isLight ? brass[600] : brass[400],
                light: isLight ? brass[400] : brass[300],
                dark: isLight ? brass[800] : brass[600],
                soft: isLight ? brass[100] : alpha(brass[400], 0.18),
                contrastText: isLight ? '#FFFFFF' : neutral[950],
            },
            secondary: {
                main: isLight ? neutral[700] : neutral[300],
                contrastText: isLight ? '#FFFFFF' : neutral[900],
            },
            success: withMode(semantic.success, isLight),
            error: withMode(semantic.error, isLight),
            warning: withMode(semantic.warning, isLight),
            info: withMode(semantic.info, isLight),
            background: {
                default: isLight ? neutral[50] : neutral[950],
                paper: isLight ? '#FFFFFF' : neutral[900],
            },
            text: {
                primary: isLight ? neutral[900] : neutral[50],
                secondary: isLight ? neutral[500] : neutral[400],
                disabled: isLight ? neutral[300] : neutral[700],
            },
            divider: isLight ? neutral[200] : neutral[800],
        },
        shape: {
            borderRadius: radius.md,
        },
        typography: {
            fontFamily: fontFamily.body,
            h1: { fontFamily: fontFamily.display, ...typeScale.h1 },
            h2: { fontFamily: fontFamily.display, ...typeScale.h2 },
            h3: { fontFamily: fontFamily.display, ...typeScale.h3 },
            h4: { fontFamily: fontFamily.display, ...typeScale.h4 },
            h5: { fontFamily: fontFamily.display, ...typeScale.h5 },
            h6: { fontFamily: fontFamily.display, ...typeScale.h6 },
            subtitle1: { fontFamily: fontFamily.display, ...typeScale.subtitle1 },
            subtitle2: { fontFamily: fontFamily.display, ...typeScale.subtitle2 },
            body1: typeScale.body1,
            body2: typeScale.body2,
            button: { fontFamily: fontFamily.display, ...typeScale.button },
            caption: typeScale.caption,
            overline: typeScale.overline,
        },
    };
}

export function createAppTheme(mode = 'light') {
    const tokens = getDesignTokens(mode);
    const isLight = mode === 'light';

    const theme = createTheme({
        ...tokens,
        shadows: createSoftShadows(isLight),
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    body: { backgroundColor: tokens.palette.background.default },
                },
            },
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        backgroundColor: tokens.palette.background.paper,
                        color: tokens.palette.text.primary,
                        boxShadow: 'none',
                        borderBottom: `1px solid ${tokens.palette.divider}`,
                    },
                },
            },

            MuiDrawer: {
                styleOverrides: {
                    paper: {
                        backgroundColor: tokens.palette.background.paper,
                        borderRight: `1px solid ${tokens.palette.divider}`,
                    },
                },
            },

            MuiListItemButton: {
                styleOverrides: {
                    root: {
                        borderRadius: radius.sm,
                        marginLeft: 8,
                        marginRight: 8,
                        width: 'auto',
                        '&.Mui-selected': {
                            backgroundColor: alpha(tokens.palette.primary.main, isLight ? 0.1 : 0.16),
                            color: tokens.palette.primary.main,
                            '& .MuiListItemIcon-root': { color: tokens.palette.primary.main },
                            '&:hover': {
                                backgroundColor: alpha(tokens.palette.primary.main, isLight ? 0.14 : 0.2),
                            },
                        },
                    },
                },
            },

            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: radius.md,
                        border: `1px solid ${tokens.palette.divider}`,
                        boxShadow: 'none',
                        backgroundImage: 'none',
                    },
                },
            },

            MuiPaper: {
                styleOverrides: {
                    root: { backgroundImage: 'none' },
                },
            },

            MuiDialog: {
                styleOverrides: {
                    paper: {
                        borderRadius: radius.lg,
                        border: `1px solid ${tokens.palette.divider}`,
                    },
                },
            },

            MuiButton: {
                defaultProps: { disableElevation: true },
                styleOverrides: {
                    root: {
                        borderRadius: radius.sm,
                        paddingInline: 16,
                        paddingBlock: 8,
                    },
                    containedPrimary: {
                        '&:hover': { backgroundColor: tokens.palette.primary.dark },
                    },
                },
            },

            MuiChip: {
                styleOverrides: {
                    root: { borderRadius: radius.pill, fontWeight: 600, fontSize: '0.75rem' },
                    filledSuccess: { backgroundColor: tokens.palette.success.light, color: tokens.palette.success.dark },
                    filledError: { backgroundColor: tokens.palette.error.light, color: tokens.palette.error.dark },
                    filledWarning: { backgroundColor: tokens.palette.warning.light, color: tokens.palette.warning.dark },
                    filledInfo: { backgroundColor: tokens.palette.info.light, color: tokens.palette.info.dark },
                },
            },

            MuiOutlinedInput: {
                styleOverrides: {
                    root: { borderRadius: radius.sm },
                },
            },

            MuiTableCell: {
                styleOverrides: {
                    root: { borderColor: tokens.palette.divider },
                    head: {
                        fontFamily: fontFamily.display,
                        fontWeight: 600,
                        color: tokens.palette.text.secondary,
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                    },
                },
            },
        },
    });

    return responsiveFontSizes(theme);
}

export { getDesignTokens };