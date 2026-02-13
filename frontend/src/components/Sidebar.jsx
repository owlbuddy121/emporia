import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useColorMode } from '../context/ThemeContext';
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemButton,
    Typography,
    Divider,
    alpha
} from '@mui/material';
import React, { useState } from 'react';
import ConfirmDialog from './common/ConfirmDialog';
import {
    Dashboard as DashboardIcon,
    Groups as GroupsIcon,
    DateRange as LeaveIcon,
    BarChart as ReportsIcon,
    Logout as LogoutIcon,
    AdminPanelSettings as AdminIcon,
    Business as DeptIcon,
    History as AuditIcon,
    AccessTime as AttendanceIcon,
    Analytics as AnalyticsIcon,
    Settings as SettingsIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
    const { user, logout } = useAuth();
    const { mode } = useColorMode();
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'Attendance', icon: <AttendanceIcon />, path: '/attendance' },
        { text: 'Attendance Analytics', icon: <AnalyticsIcon />, path: '/attendance/analytics' },
    ];

    // Role-based menu items
    if (user?.role?.name === 'Super Admin' || user?.role?.name === 'HR Admin') {
        menuItems.push(
            { text: 'Employees', icon: <GroupsIcon />, path: '/employees' },
            { text: 'Departments', icon: <DeptIcon />, path: '/departments' }
        );
    }

    if (user?.role?.name === 'Super Admin') {
        menuItems.push({ text: 'Roles', icon: <AdminIcon />, path: '/roles' });
        menuItems.push({ text: 'Audit Logs', icon: <AuditIcon />, path: '/audit-logs' });
    }

    if (user?.role?.name === 'Manager') {
        menuItems.push(
            { text: 'Team Members', icon: <GroupsIcon />, path: '/team-members' },
            { text: 'Leave Management', icon: <LeaveIcon />, path: '/leave-management' },
            { text: 'Reports', icon: <ReportsIcon />, path: '/reports' }
        );
    }

    if (user?.role?.name === 'Employee') {
        menuItems.push({ text: 'Leave Management', icon: <LeaveIcon />, path: '/leave-management' });
    }

    menuItems.push({ text: 'Settings', icon: <SettingsIcon />, path: '/settings' });

    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

    const handleLogoutClick = () => {
        setLogoutDialogOpen(true);
    };

    const handleLogoutConfirm = () => {
        logout();
        setLogoutDialogOpen(false);
    };

    const drawerContent = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
            {/* ... existing content ... */}
            <ConfirmDialog
                open={logoutDialogOpen}
                onClose={() => setLogoutDialogOpen(false)}
                onConfirm={handleLogoutConfirm}
                title="Confirm Logout"
                description="Are you sure you want to end your session? You will need to login again to access the portal."
                confirmText="Logout Now"
                type="logout"
            />
            <Box sx={{ p: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography
                    variant="h5"
                    color="primary"
                    sx={{
                        fontWeight: 900,
                        letterSpacing: 2,
                        background: 'linear-gradient(135deg, #4f46e5 0%, #ec4899 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    EMPORIA
                </Typography>
            </Box>

            <List sx={{ flexGrow: 1, px: 2, mt: 2 }}>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                            onClick={() => {
                                navigate(item.path);
                                setMobileOpen(false);
                            }}
                            selected={location.pathname === item.path}
                            sx={{
                                borderRadius: 4,
                                py: 1.5,
                                '&.Mui-selected': {
                                    bgcolor: 'primary.main',
                                    color: 'common.white',
                                    boxShadow: mode === 'light'
                                        ? '0 8px 16px rgba(79, 70, 229, 0.3)'
                                        : '0 8px 24px rgba(0, 0, 0, 0.4)',
                                    '& .MuiListItemIcon-root': {
                                        color: 'common.white',
                                    },
                                    '&:hover': {
                                        bgcolor: 'primary.dark',
                                    }
                                },
                                '&:hover': {
                                    bgcolor: mode === 'light' ? alpha('#4f46e5', 0.05) : alpha('#818cf8', 0.1),
                                    '& .MuiListItemIcon-root': {
                                        color: mode === 'light' ? 'primary.main' : '#818cf8',
                                    }
                                }
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                primaryTypographyProps={{
                                    variant: 'body2',
                                    fontWeight: location.pathname === item.path ? 700 : 600,
                                    letterSpacing: 0.5
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            <Box sx={{ p: 2, mt: 'auto' }}>
                <Box sx={{
                    p: 2,
                    bgcolor: 'error.main',
                    opacity: mode === 'light' ? 0.05 : 0.1,
                    borderRadius: 4,
                    position: 'absolute',
                    width: 'calc(100% - 32px)',
                    height: '48px',
                    zIndex: 0
                }} />
                <ListItemButton
                    onClick={handleLogoutClick}
                    sx={{
                        borderRadius: 4,
                        color: 'error.main',
                        zIndex: 1,
                        '&:hover': { bgcolor: alpha('#ef4444', 0.1) }
                    }}
                >
                    <ListItemIcon sx={{ color: 'error.main', minWidth: 40 }}>
                        <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary="Logout" primaryTypographyProps={{ variant: 'body2', fontWeight: 700 }} />
                </ListItemButton>
            </Box>
        </Box>
    );

    return (
        <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
            {/* Mobile Drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none' },
                }}
            >
                {drawerContent}
            </Drawer>
            {/* Desktop Drawer */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: drawerWidth,
                        borderRight: '1px solid',
                        borderColor: 'divider',
                        boxShadow: '4px 0 24px rgba(0,0,0,0.02)'
                    },
                }}
                open
            >
                {drawerContent}
            </Drawer>
        </Box>
    );
};

export default Sidebar;
