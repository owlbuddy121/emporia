import React, { useState } from 'react';
import { Box, CssBaseline, AppBar, Toolbar, IconButton, Typography, Avatar, alpha } from '@mui/material';
import { Menu as MenuIcon, LightMode, DarkMode } from '@mui/icons-material';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { useColorMode } from '../context/ThemeContext';

const drawerWidth = 240;

const Layout = ({ children }) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user } = useAuth();
    const { mode, toggleColorMode } = useColorMode();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    bgcolor: mode === 'light' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(15, 23, 42, 0.7)',
                    backdropFilter: 'blur(10px)',
                    color: 'text.primary',
                    boxShadow: 'none',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 'auto' }}>
                        <IconButton onClick={toggleColorMode} color="inherit" sx={{
                            p: 1.2,
                            borderRadius: 3,
                            bgcolor: mode === 'light' ? alpha('#4f46e5', 0.05) : alpha('#818cf8', 0.1),
                            color: mode === 'light' ? 'primary.main' : '#818cf8',
                            '&:hover': {
                                bgcolor: mode === 'light' ? alpha('#4f46e5', 0.1) : alpha('#818cf8', 0.2),
                            }
                        }}>
                            {mode === 'light' ? <DarkMode /> : <LightMode />}
                        </IconButton>

                        <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                            <Typography variant="body2" fontWeight={700} color="text.primary">
                                {user?.name}
                            </Typography>
                            <Typography variant="caption" color="primary.main" fontWeight={600}>
                                {user?.role?.name}
                            </Typography>
                        </Box>
                        <Avatar
                            sx={{
                                bgcolor: 'primary.main',
                                width: 40,
                                height: 40,
                                fontWeight: 700,
                                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
                            }}
                        >
                            {user?.name?.charAt(0)}
                        </Avatar>
                    </Box>
                </Toolbar>
            </AppBar>
            <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: { xs: 2, sm: 4 },
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    pt: { xs: 12, sm: 12 },
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default Layout;
