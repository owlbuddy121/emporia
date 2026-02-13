import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Box, Container, Typography, Paper, Grid, Card, CardContent } from '@mui/material';
import {
    People as PeopleIcon,
    Business as BusinessIcon,
    EventNote as EventNoteIcon,
    AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';

const StatCard = ({ title, value, icon, color }) => (
    <Card>
        <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                    <Typography color="text.secondary" gutterBottom variant="body2">
                        {title}
                    </Typography>
                    <Typography variant="h4">{value}</Typography>
                </Box>
                <Box
                    sx={{
                        bgcolor: `${color}.light`,
                        color: `${color}.main`,
                        p: 2,
                        borderRadius: 2,
                    }}
                >
                    {icon}
                </Box>
            </Box>
        </CardContent>
    </Card>
);

const Dashboard = () => {
    const { user, logout } = useAuth();

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'grey.100' }}>
            {/* Header */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Container maxWidth="lg">
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography variant="h5">Emporia</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Employee Management System
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={2}>
                            <Box textAlign="right">
                                <Typography variant="body2">{user?.name}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {user?.role?.name}
                                </Typography>
                            </Box>
                            <button
                                onClick={logout}
                                style={{
                                    padding: '8px 16px',
                                    cursor: 'pointer',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    background: 'white',
                                }}
                            >
                                Logout
                            </button>
                        </Box>
                    </Box>
                </Container>
            </Paper>

            {/* Main Content */}
            <Container maxWidth="lg">
                <Typography variant="h4" gutterBottom>
                    Welcome, {user?.name}!
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                    Role: {user?.role?.name} | Department: {user?.department?.name || 'N/A'}
                </Typography>

                <Grid container spacing={3} sx={{ mt: 2 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Total Employees"
                            value="24"
                            icon={<PeopleIcon />}
                            color="primary"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Departments"
                            value="5"
                            icon={<BusinessIcon />}
                            color="success"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Pending Leaves"
                            value="8"
                            icon={<EventNoteIcon />}
                            color="warning"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Active Users"
                            value="22"
                            icon={<AdminIcon />}
                            color="info"
                        />
                    </Grid>
                </Grid>

                <Paper sx={{ p: 3, mt: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Quick Actions
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Dashboard features are being implemented. You can access:
                    </Typography>
                    <Box component="ul" sx={{ mt: 2 }}>
                        <li>Employee Management</li>
                        <li>Department Management</li>
                        <li>Leave Management</li>
                        <li>Role & Permissions</li>
                        <li>Audit Logs (Super Admin only)</li>
                    </Box>
                </Paper>

                <Paper sx={{ p: 3, mt: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Your Permissions
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1} mt={2}>
                        {user?.role?.permissions?.map((permission) => (
                            <Box
                                key={permission}
                                sx={{
                                    px: 2,
                                    py: 0.5,
                                    bgcolor: 'primary.light',
                                    color: 'primary.contrastText',
                                    borderRadius: 1,
                                    fontSize: '0.875rem',
                                }}
                            >
                                {permission}
                            </Box>
                        ))}
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default Dashboard;
