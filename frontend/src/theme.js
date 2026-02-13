import { alpha } from '@mui/material/styles';

const getThemeConfig = (mode) => ({
    palette: {
        mode,
        primary: {
            main: '#4f46e5', // Indigo 600
            light: '#818cf8',
            dark: '#3730a3',
            contrastText: '#fff',
        },
        secondary: {
            main: '#ec4899', // Pink 500
            light: '#f472b6',
            dark: '#be185d',
        },
        background: {
            default: mode === 'light' ? '#f8fafc' : '#0f172a',
            paper: mode === 'light' ? '#ffffff' : '#1e293b',
        },
        text: {
            primary: mode === 'light' ? '#0f172a' : '#f8fafc',
            secondary: mode === 'light' ? '#64748b' : '#94a3b8',
        },
        divider: mode === 'light' ? '#e2e8f0' : '#334155',
    },
    typography: {
        fontFamily: '"Outfit", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em' },
        h2: { fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.01em' },
        h3: { fontSize: '1.75rem', fontWeight: 700 },
        h4: { fontSize: '1.5rem', fontWeight: 700 },
        h5: { fontSize: '1.25rem', fontWeight: 600 },
        h6: { fontSize: '1.125rem', fontWeight: 600 },
        subtitle1: { fontSize: '1rem', fontWeight: 500 },
        subtitle2: { fontSize: '0.875rem', fontWeight: 500 },
        body1: { fontSize: '1rem', lineHeight: 1.5 },
        body2: { fontSize: '0.875rem', lineHeight: 1.57 },
        button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    padding: '10px 24px',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: mode === 'light'
                            ? '0 4px 12px rgba(79, 70, 229, 0.2)'
                            : '0 4px 20px rgba(79, 70, 229, 0.4)',
                    },
                },
                containedPrimary: {
                    background: mode === 'light'
                        ? 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)'
                        : 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    boxShadow: mode === 'light'
                        ? '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'
                        : '0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    border: '1px solid',
                    borderColor: mode === 'light' ? '#f1f5f9' : '#334155',
                    boxShadow: mode === 'light'
                        ? '0 1px 2px 0 rgb(0 0 0 / 0.05)'
                        : '0 10px 15px -3px rgb(0 0 0 / 0.2)',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 12,
                        backgroundColor: mode === 'light' ? '#f8fafc' : '#0f172a',
                        '& fieldset': {
                            borderColor: mode === 'light' ? '#e2e8f0' : '#334155',
                        },
                        '&:hover fieldset': {
                            borderColor: mode === 'light' ? '#cbd5e1' : '#475569',
                        },
                    },
                },
            },
        },
    },
});

export default getThemeConfig;
