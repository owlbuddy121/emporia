import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Box, Container, Typography, Paper, Grid, Card, CardContent, Chip, alpha } from '@mui/material';
import {
    People as PeopleIcon,
    Business as BusinessIcon,
    EventNote as EventNoteIcon,
    AdminPanelSettings as AdminIcon,
    ArrowForward as ArrowForwardIcon,
    Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getDashboardStats } from '../services/dashboardService';

const StatCard = ({ title, value, icon, color, trend }) => (
    <Card sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 4,
        boxShadow: '0 10px 40px rgba(0,0,0,0.04)',
        height: '100%',
        border: 'none',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '4px',
            bgcolor: `${color}.main`,
        }
    }}>
        <CardContent sx={{ p: 4 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                <Box
                    sx={{
                        background: (theme) => `linear-gradient(135deg, ${theme.palette[color].light} 0%, ${theme.palette[color].main} 100%)`,
                        color: 'white',
                        p: 1.5,
                        borderRadius: 4,
                        boxShadow: (theme) => `0 8px 16px ${alpha(theme.palette[color].main, 0.25)}`,
                    }}
                >
                    {icon}
                </Box>
                {trend && (
                    <Typography variant="caption" sx={{
                        color: 'success.main',
                        fontWeight: 800,
                        bgcolor: alpha('#10b981', 0.1),
                        px: 1.5,
                        py: 0.75,
                        borderRadius: 2
                    }}>
                        {trend}
                    </Typography>
                )}
            </Box>
            <Typography color="text.secondary" variant="subtitle2" fontWeight={700} sx={{ letterSpacing: 0.5, mb: 1 }}>
                {title.toUpperCase()}
            </Typography>
            <Typography variant="h3" fontWeight={800} color="text.primary">{value}</Typography>
        </CardContent>
    </Card>
);

const ActionCard = ({ title, description, icon, path, color }) => {
    const navigate = useNavigate();
    return (
        <Card
            onClick={() => navigate(path)}
            sx={{
                borderRadius: 4.5,
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    transform: 'translateY(-12px)',
                    boxShadow: (theme) => `0 30px 60px ${alpha(theme.palette[color].main, 0.15)}`,
                    '& .arrow-icon': { transform: 'translateX(8px)' }
                },
                position: 'relative',
                overflow: 'hidden',
                height: '100%',
                border: '1px solid',
                borderColor: 'divider',
            }}
        >
            <Box sx={{
                position: 'absolute',
                top: -20,
                right: -20,
                width: 120,
                height: 120,
                bgcolor: (theme) => alpha(theme.palette[color].main, 0.05),
                borderRadius: '50%',
                zIndex: 0
            }} />
            <CardContent sx={{ p: 5, position: 'relative', zIndex: 1 }}>
                <Box sx={{
                    color: `${color}.main`,
                    mb: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 64,
                    height: 64,
                    bgcolor: (theme) => alpha(theme.palette[color].main, 0.1),
                    borderRadius: 4,
                }}>
                    {React.cloneElement(icon, { sx: { fontSize: 32 } })}
                </Box>
                <Typography variant="h5" fontWeight={800} gutterBottom>{title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7, minHeight: 48 }}>
                    {description}
                </Typography>
                <Box display="flex" alignItems="center" color={`${color}.main`} sx={{ fontWeight: 800, fontSize: '0.9rem' }}>
                    Access Portal <ArrowForwardIcon className="arrow-icon" sx={{ ml: 1, fontSize: 18, transition: '0.3s' }} />
                </Box>
            </CardContent>
        </Card>
    );
};

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getDashboardStats();
                setStats(data.stats);
            } catch (error) {
                console.error('Failed to fetch dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const dashboardStats = [
        {
            title: "Active Team",
            value: stats?.totalEmployees || (loading ? "..." : "0"),
            icon: <PeopleIcon />,
            color: "primary",
            trend: stats?.newJoinersThisMonth ? `+${stats.newJoinersThisMonth} this mo` : null
        },
        {
            title: "Compliance",
            value: stats?.complianceRate ? `${stats.complianceRate}%` : (loading ? "..." : "100%"),
            icon: <BusinessIcon />,
            color: "success"
        },
        {
            title: "Pending",
            value: stats?.pendingLeaves || (loading ? "..." : "0"),
            icon: <EventNoteIcon />,
            color: "warning"
        },
        {
            title: "Openings",
            value: stats?.openings || "2",
            icon: <AdminIcon />,
            color: "secondary"
        }
    ];

    return (
        <Box>
            {/* Hero Section ... */}
            <Box sx={{ mb: 8 }}>
                <Typography variant="h2" color="text.primary" sx={{ mb: 1 }}>
                    Hello, {user?.name.split(' ')[0]}! 👋
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500, maxWidth: 600 }}>
                    Keep track of your team and manage operations from your personalized dashboard.
                </Typography>
            </Box>

            {/* Statistics */}
            <Grid container spacing={4} sx={{ mb: 8 }}>
                {dashboardStats.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <StatCard
                            title={stat.title}
                            value={stat.value}
                            icon={stat.icon}
                            color={stat.color}
                            trend={stat.trend}
                        />
                    </Grid>
                ))}
            </Grid>

            {/* Modules */}
            <Typography variant="h4" fontWeight={800} sx={{ mb: 5 }}>
                Available Services
            </Typography>
            <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                    <ActionCard
                        title="Team Management"
                        description="Access employee profiles, performance data, and comprehensive team analytics."
                        icon={<PeopleIcon />}
                        path="/team-members"
                        color="primary"
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <ActionCard
                        title="Leave Control"
                        description="Streamlined request system for vacations, sick days, and personal time off."
                        icon={<EventNoteIcon />}
                        path="/leave-management"
                        color="secondary"
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <ActionCard
                        title="Business Insights"
                        description="Generate dynamic reports and export data for executive review with one click."
                        icon={<AssignmentIcon />}
                        path="/reports"
                        color="success"
                    />
                </Grid>
            </Grid>

            {/* Modern Banner */}
            <Box
                sx={{
                    mt: 10,
                    p: { xs: 4, md: 6 },
                    borderRadius: 5,
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    color: 'white',
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 20px 40px rgba(79, 70, 229, 0.2)'
                }}
            >
                <Box>
                    <Typography variant="h4" fontWeight={800} gutterBottom>Ready for the next upgrade?</Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
                        Your specialized <b>{user?.role?.name}</b> credentials unlock full departmental control.
                    </Typography>
                </Box>
                <Chip
                    label="PRO ACCOUNT"
                    sx={{
                        mt: { xs: 4, md: 0 },
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        fontWeight: 800,
                        px: 3,
                        py: 3,
                        borderRadius: 3,
                        backdropFilter: 'blur(10px)',
                        fontSize: '1rem'
                    }}
                />
            </Box>
        </Box>
    );
};

export default Dashboard;
