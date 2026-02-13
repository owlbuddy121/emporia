import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    Alert,
    InputAdornment,
    IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, Login as LoginIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useColorMode } from '../context/ThemeContext';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { mode } = useColorMode();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-20%',
                    right: '-10%',
                    width: '60%',
                    height: '80%',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '50%',
                    filter: 'blur(80px)',
                    transform: 'rotate(-20deg)',
                },
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-20%',
                    left: '-10%',
                    width: '60%',
                    height: '80%',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '50%',
                    filter: 'blur(80px)',
                    transform: 'rotate(20deg)',
                }
            }}
        >
            <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
                <Box sx={{
                    display: 'flex',
                    width: '100%',
                    maxWidth: 1000,
                    bgcolor: mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(30, 41, 59, 0.8)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 6,
                    overflow: 'hidden',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }}>
                    {/* Left Side - Visual */}
                    <Box sx={{
                        flex: 1,
                        display: { xs: 'none', md: 'flex' },
                        flexDirection: 'column',
                        justifyContent: 'center',
                        p: 6,
                        background: 'linear-gradient(225deg, #4f46e5 0%, #3730a3 100%)',
                        color: 'white'
                    }}>
                        <Typography variant="h2" fontWeight={800} gutterBottom>
                            EMPORIA
                        </Typography>
                        <Typography variant="h5" sx={{ opacity: 0.9, mb: 4, fontWeight: 400 }}>
                            Empowering your workforce journey with smart management tools.
                        </Typography>
                        <Box sx={{ mt: 'auto' }}>
                            <Box sx={{ p: 2, bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 4, border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                                <Typography variant="subtitle2" gutterBottom fontWeight={700}>
                                    Demo Access
                                </Typography>
                                <Typography variant="caption" display="block">Admin: admin@emporia.com / admin123</Typography>
                                <Typography variant="caption" display="block">HR: hr@emporia.com / hradmin123</Typography>
                                <Typography variant="caption" display="block">Manager: john.smith@emporia.com / manager123</Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* Right Side - Form */}
                    <Box sx={{ flex: 1, p: { xs: 4, md: 8 }, display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h4" fontWeight={800} gutterBottom>
                            Sign In
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mb={4}>
                            Enter your credentials to access the portal
                        </Typography>

                        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>{error}</Alert>}

                        <form onSubmit={handleSubmit}>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="caption" fontWeight={700} sx={{ mb: 1, display: 'block', ml: 1 }}>EMAIL ADDRESS</Typography>
                                <TextField
                                    fullWidth
                                    placeholder="name@company.com"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    autoFocus
                                />
                            </Box>

                            <Box sx={{ mb: 4 }}>
                                <Typography variant="caption" fontWeight={700} sx={{ mb: 1, display: 'block', ml: 1 }}>PASSWORD</Typography>
                                <TextField
                                    fullWidth
                                    placeholder="••••••••"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={loading}
                                sx={{
                                    py: 2,
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    borderRadius: 4,
                                    mb: 2
                                }}
                            >
                                {loading ? 'Verifying Account...' : 'Continue to Dashboard'}
                            </Button>
                        </form>

                        <Typography variant="caption" color="text.secondary" textAlign="center" mt="auto">
                            &copy; 2026 Emporia EMS. All rights reserved.
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Login;
