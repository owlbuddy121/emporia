import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Avatar,
    TextField,
    InputAdornment,
    IconButton,
    CircularProgress,
    Alert,
    alpha,
    Divider,
    MenuItem,
    Card,
    CardContent,
} from '@mui/material';
import {
    History as HistoryIcon,
    Search as SearchIcon,
    FilterList as FilterIcon,
    Person as PersonIcon,
    FlashOn as ActionIcon,
    Event as EventIcon,
    TrendingUp as TrendingIcon,
} from '@mui/icons-material';
import { getAuditLogs, getAuditStats } from '../services/auditService';

// Helper to get action color
const getActionColor = (action) => {
    if (action.includes('create') || action.includes('add') || action.includes('apply') || action.includes('approve')) return 'success';
    if (action.includes('delete') || action.includes('remove') || action.includes('reject')) return 'error';
    if (action.includes('edit') || action.includes('update')) return 'info';
    if (action.includes('login') || action.includes('logout')) return 'secondary';
    return 'primary';
};

const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{
        borderRadius: 4,
        boxShadow: '0 4px 24px rgba(0,0,0,0.02)',
        border: '1px solid',
        borderColor: 'divider',
        height: '100%'
    }}>
        <CardContent sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" gap={2}>
                <Box sx={{
                    p: 1.5,
                    borderRadius: 3,
                    bgcolor: (theme) => alpha(theme.palette[color].main, 0.1),
                    color: `${color}.main`
                }}>
                    {icon}
                </Box>
                <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        {title}
                    </Typography>
                    <Typography variant="h4" fontWeight={900}>
                        {value}
                    </Typography>
                </Box>
            </Box>
        </CardContent>
    </Card>
);

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filters
    const [filters, setFilters] = useState({
        action: '',
        performedBy: '',
        startDate: '',
        endDate: '',
        page: 1,
        limit: 20
    });

    useEffect(() => {
        fetchData();
    }, [filters]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [logsData, statsData] = await Promise.all([
                getAuditLogs(filters),
                getAuditStats()
            ]);
            setLogs(logsData.auditLogs || []);
            setStats(statsData.stats);
            setError(null);
        } catch (err) {
            setError('Failed to fetch audit data. Please ensure you have sufficient permissions.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 });
    };

    return (
        <Box>
            <Box sx={{ mb: 6 }}>
                <Typography variant="h2" fontWeight={800} gutterBottom>
                    System Audit
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Traceable security logs tracking all high-impact operations across the Emporia network.
                </Typography>
            </Box>

            {/* Stats Overview */}
            {stats && (
                <Grid container spacing={3} sx={{ mb: 5 }}>
                    <Grid item xs={12} sm={4}>
                        <StatCard
                            title="Total Operations"
                            value={stats.totalLogs}
                            icon={<HistoryIcon />}
                            color="primary"
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <StatCard
                            title="Active Action"
                            value={stats.actionStats[0]?._id?.split(':')[1]?.toUpperCase() || 'N/A'}
                            icon={<TrendingIcon />}
                            color="success"
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <StatCard
                            title="Unique Actions"
                            value={stats.actionStats.length}
                            icon={<ActionIcon />}
                            color="warning"
                        />
                    </Grid>
                </Grid>
            )}

            {/* Filters Bar */}
            <Paper sx={{ p: 2, mb: 4, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid', borderColor: 'divider' }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            name="action"
                            placeholder="Filter by action..."
                            value={filters.action}
                            onChange={handleFilterChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: 'text.secondary' }} />
                                    </InputAdornment>
                                )
                            }}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            name="startDate"
                            type="date"
                            label="From Date"
                            value={filters.startDate}
                            onChange={handleFilterChange}
                            InputLabelProps={{ shrink: true }}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            name="endDate"
                            type="date"
                            label="To Date"
                            value={filters.endDate}
                            onChange={handleFilterChange}
                            InputLabelProps={{ shrink: true }}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Box display="flex" justifyContent="flex-end">
                            <Chip
                                label={`${logs.length} results found`}
                                sx={{ fontWeight: 700, bgcolor: 'background.default' }}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {error && <Alert severity="error" sx={{ mb: 4, borderRadius: 3 }}>{error}</Alert>}

            {/* Table */}
            <TableContainer component={Paper} sx={{ border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.02)', borderRadius: 4, overflow: 'hidden' }}>
                <Table>
                    <TableHead sx={{ bgcolor: 'background.default' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 800, py: 3, pl: 4 }}>TIMESTAMP</TableCell>
                            <TableCell sx={{ fontWeight: 800, py: 3 }}>OPERATOR</TableCell>
                            <TableCell sx={{ fontWeight: 800, py: 3 }}>ACTION</TableCell>
                            <TableCell sx={{ fontWeight: 800, py: 3 }}>DESCRIPTION</TableCell>
                            <TableCell sx={{ fontWeight: 800, py: 3, pr: 4 }}>SECURITY ID</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                                    <CircularProgress size={30} sx={{ mb: 2 }} />
                                    <Typography color="text.secondary" fontWeight={600}>Decrypting security logs...</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            logs.map((log) => (
                                <TableRow key={log._id} sx={{ '&:hover': { bgcolor: alpha('#4f46e5', 0.02) } }}>
                                    <TableCell sx={{ py: 2.5, pl: 4 }}>
                                        <Typography variant="body2" fontWeight={700} color="text.secondary">
                                            {new Date(log.createdAt).toLocaleDateString()}
                                        </Typography>
                                        <Typography variant="caption" display="block" color="text.secondary" fontWeight={500}>
                                            {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ py: 2.5 }}>
                                        <Box display="flex" alignItems="center" gap={1.5}>
                                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main', fontSize: '0.8rem', fontWeight: 800 }}>
                                                {log.performedBy?.name?.charAt(0) || 'S'}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="body2" fontWeight={800}>{log.performedBy?.name || 'System'}</Typography>
                                                <Typography variant="caption" color="text.secondary" fontWeight={600}>{log.performedBy?.role?.name || 'Admin'}</Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ py: 2.5 }}>
                                        <Chip
                                            label={log.action.toUpperCase()}
                                            size="small"
                                            color={getActionColor(log.action)}
                                            sx={{
                                                fontWeight: 900,
                                                fontSize: '0.6rem',
                                                borderRadius: 2,
                                                height: 22,
                                                letterSpacing: 0.5
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ py: 2.5 }}>
                                        <Typography variant="body2" fontWeight={600} color="text.primary">
                                            {log.description}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ py: 2.5, pr: 4 }}>
                                        <Typography variant="caption" sx={{ fontFamily: 'monospace', bgcolor: 'action.hover', px: 1, py: 0.5, borderRadius: 1 }}>
                                            {log._id.slice(-8).toUpperCase()}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                        {!loading && logs.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                                    <Typography color="text.secondary" fontWeight={600}>No security logs found matching your criteria.</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default AuditLogs;
