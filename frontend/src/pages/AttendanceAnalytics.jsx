import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Grid,
    Paper,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Card,
    CardContent,
    Avatar,
    Chip,
    LinearProgress
} from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { getAttendanceStats } from '../services/attendanceService';
import { getDepartments } from '../services/departmentService';
import { getRoles } from '../services/roleService';
import { useColorMode } from '../context/ThemeContext';

const AttendanceAnalytics = () => {
    const { mode } = useColorMode();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [departments, setDepartments] = useState([]);
    const [roles, setRoles] = useState([]);

    // Filters
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [selectedDept, setSelectedDept] = useState('');
    const [selectedRole, setSelectedRole] = useState('');

    useEffect(() => {
        fetchDropdowns();
    }, []);

    useEffect(() => {
        fetchStats();
    }, [month, year, selectedDept, selectedRole]);

    const fetchDropdowns = async () => {
        try {
            const [deptRes, roleRes] = await Promise.all([
                getDepartments(),
                getRoles()
            ]);
            setDepartments(deptRes.departments || []);
            setRoles(roleRes.roles || []);
        } catch (error) {
            console.error('Error fetching dropdowns:', error);
        }
    };

    const fetchStats = async () => {
        setLoading(true);
        try {
            const filters = {
                month,
                year,
                department: selectedDept,
                role: selectedRole
            };
            const data = await getAttendanceStats(filters);
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    if (loading && !stats) {
        return <LinearProgress />;
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="h4" fontWeight="bold">
                    Attendance Analytics
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Month</InputLabel>
                        <Select
                            value={month}
                            label="Month"
                            onChange={(e) => setMonth(e.target.value)}
                        >
                            {months.map((m, index) => (
                                <MenuItem key={index + 1} value={index + 1}>{m}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 100 }}>
                        <InputLabel>Year</InputLabel>
                        <Select
                            value={year}
                            label="Year"
                            onChange={(e) => setYear(e.target.value)}
                        >
                            <MenuItem value={2025}>2025</MenuItem>
                            <MenuItem value={2026}>2026</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Department</InputLabel>
                        <Select
                            value={selectedDept}
                            label="Department"
                            onChange={(e) => setSelectedDept(e.target.value)}
                        >
                            <MenuItem value="">All Departments</MenuItem>
                            {departments.map(d => (
                                <MenuItem key={d._id} value={d._id}>{d.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Role</InputLabel>
                        <Select
                            value={selectedRole}
                            label="Role"
                            onChange={(e) => setSelectedRole(e.target.value)}
                        >
                            <MenuItem value="">All Roles</MenuItem>
                            {roles.map(r => (
                                <MenuItem key={r._id} value={r._id}>{r.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </Box>

            {/* Overview Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={8}>
                    <Paper
                        sx={{
                            p: 3,
                            height: 350,
                            borderRadius: 4,
                            background: mode === 'dark' ? 'rgba(30, 41, 59, 0.7)' : '#ffffff',
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                            Daily Attendance Trend
                        </Typography>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={stats?.dailyTrend}
                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorAbsent" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={mode === 'dark' ? '#334155' : '#e2e8f0'} />
                                <XAxis dataKey="_id" stroke={mode === 'dark' ? '#94a3b8' : '#64748b'} />
                                <YAxis stroke={mode === 'dark' ? '#94a3b8' : '#64748b'} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: mode === 'dark' ? '#1e293b' : '#fff',
                                        borderColor: mode === 'dark' ? '#334155' : '#e2e8f0',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Legend />
                                <Area type="monotone" dataKey="present" stroke="#4f46e5" fillOpacity={1} fill="url(#colorPresent)" name="Present" />
                                <Area type="monotone" dataKey="absent" stroke="#ef4444" fillOpacity={1} fill="url(#colorAbsent)" name="Absent" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper
                        sx={{
                            p: 3,
                            height: 350,
                            borderRadius: 4,
                            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                            color: 'white',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <Box sx={{
                            position: 'absolute',
                            top: -50,
                            right: -50,
                            width: 200,
                            height: 200,
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '50%'
                        }} />
                        <Typography variant="h6" sx={{ opacity: 0.8 }}>Total Employees Tracked</Typography>
                        <Typography variant="h2" fontWeight="800" sx={{ my: 2 }}>
                            {stats?.employeeStats?.length || 0}
                        </Typography>
                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Typography variant="subtitle1">
                                Most Regular:
                            </Typography>
                            <Typography variant="h6" fontWeight="bold">
                                {stats?.employeeStats?.[0]?.name || 'N/A'}
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Employee Breakdown Table */}
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                Employee Performance
            </Typography>
            <TableContainer
                component={Paper}
                sx={{
                    borderRadius: 4,
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    background: mode === 'dark' ? 'rgba(30, 41, 59, 0.7)' : '#ffffff',
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Employee</TableCell>
                            <TableCell align="center">Days Present</TableCell>
                            <TableCell align="center">Attendance %</TableCell>
                            <TableCell align="center">Avg. Work Hours</TableCell>
                            <TableCell align="center">Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {stats?.employeeStats?.map((emp) => (
                            <TableRow key={emp._id} hover>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                                            {emp.name.charAt(0)}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight="bold">{emp.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">{emp.email}</Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell align="center">
                                    <Typography fontWeight="bold">{emp.daysPresent}</Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                                        <LinearProgress
                                            variant="determinate"
                                            value={emp.attendancePercentage}
                                            sx={{
                                                width: 60,
                                                height: 6,
                                                borderRadius: 3,
                                                bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                                            }}
                                        />
                                        <Typography variant="body2">{Math.round(emp.attendancePercentage)}%</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell align="center">
                                    <Typography>{~~(emp.avgDuration / 60)}h {emp.avgDuration % 60}m</Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Chip
                                        label={emp.attendancePercentage >= 90 ? 'Excellent' : emp.attendancePercentage >= 75 ? 'Good' : 'Review Needed'}
                                        color={emp.attendancePercentage >= 90 ? 'success' : emp.attendancePercentage >= 75 ? 'info' : 'warning'}
                                        size="small"
                                        variant="filled"
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                        {(!stats?.employeeStats || stats.employeeStats.length === 0) && (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                    <Typography color="text.secondary">No attendance data found for this period</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default AttendanceAnalytics;
