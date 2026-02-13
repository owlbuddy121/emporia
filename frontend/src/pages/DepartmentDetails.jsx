import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Avatar,
    Chip,
    Button,
    alpha,
    CircularProgress,
    Alert,
    Paper,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Business as BusinessIcon,
    Groups as GroupsIcon,
    Person as PersonIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Visibility as VisibilityIcon
} from '@mui/icons-material';
import { getDepartment } from '../services/departmentService';
import { getEmployees } from '../services/employeeService';

const DepartmentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [department, setDepartment] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                const [deptData, empData] = await Promise.all([
                    getDepartment(id),
                    getEmployees({ department: id })
                ]);
                setDepartment(deptData.department);
                setEmployees(empData.employees || []);
                setError(null);
            } catch (err) {
                setError('Failed to load department details.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error || !department) {
        return (
            <Box p={4}>
                <Alert severity="error" sx={{ borderRadius: 3 }}>
                    {error || 'Department not found.'}
                </Alert>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/departments')}
                    sx={{ mt: 2, fontWeight: 700 }}
                >
                    Back to Departments
                </Button>
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton onClick={() => navigate('/departments')} sx={{ bgcolor: 'background.paper', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <ArrowBackIcon />
                </IconButton>
                <Box>
                    <Typography variant="h2" fontWeight={800} gutterBottom sx={{ mb: 0 }}>
                        {department.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" fontWeight={500}>
                        Departmental Overview & Personnel
                    </Typography>
                </Box>
            </Box>

            <Grid container spacing={4}>
                {/* Department Info Sidebar */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ borderRadius: 5, boxShadow: '0 8px 32px rgba(0,0,0,0.04)', border: '1px solid', borderColor: 'divider' }}>
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                                <Box sx={{ p: 1.5, bgcolor: alpha('#4f46e5', 0.1), color: 'primary.main', borderRadius: 3 }}>
                                    <BusinessIcon />
                                </Box>
                                <Typography variant="h5" fontWeight={800}>About Department</Typography>
                            </Box>

                            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7 }}>
                                {department.description || 'No description provided for this department yet.'}
                            </Typography>

                            <Divider sx={{ my: 3 }} />

                            <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: 'block', mb: 2, textTransform: 'uppercase' }}>
                                Head of Department
                            </Typography>

                            <Box display="flex" alignItems="center" gap={2}>
                                <Avatar
                                    src={department.manager?.profilePicture}
                                    sx={{ width: 56, height: 56, bgcolor: 'primary.main', fontWeight: 800 }}
                                >
                                    {department.manager?.name?.charAt(0) || '?'}
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight={800}>{department.manager?.name || 'Unassigned'}</Typography>
                                    <Typography variant="body2" color="text.secondary" fontWeight={600}>{department.manager?.email || 'N/A'}</Typography>
                                </Box>
                            </Box>

                            <Box sx={{ mt: 4, p: 3, bgcolor: alpha('#10b981', 0.05), borderRadius: 4, border: '1px solid', borderColor: alpha('#10b981', 0.1) }}>
                                <Box display="flex" alignItems="center" gap={2}>
                                    <GroupsIcon sx={{ color: '#059669' }} />
                                    <Box>
                                        <Typography variant="h4" fontWeight={900} color="#059669">{employees.length}</Typography>
                                        <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase' }}>Active Members</Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Employees List */}
                <Grid item xs={12} md={8}>
                    <Typography variant="h4" fontWeight={800} sx={{ mb: 3 }}>Department Personnel</Typography>
                    <TableContainer component={Paper} sx={{ border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.02)', borderRadius: 4, overflow: 'hidden' }}>
                        <Table>
                            <TableHead sx={{ bgcolor: 'background.default' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 800, py: 3, pl: 4 }}>EMPLOYEE</TableCell>
                                    <TableCell sx={{ fontWeight: 800, py: 3 }}>ROLE</TableCell>
                                    <TableCell sx={{ fontWeight: 800, py: 3 }}>STATUS</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 800, py: 3, pr: 4 }}>ACTIONS</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {employees.map((emp) => (
                                    <TableRow key={emp._id} sx={{ '&:hover': { bgcolor: alpha('#4f46e5', 0.02) } }}>
                                        <TableCell sx={{ py: 2.5, pl: 4 }}>
                                            <Box display="flex" alignItems="center" gap={2}>
                                                <Avatar
                                                    src={emp.profilePicture}
                                                    sx={{ width: 40, height: 40, bgcolor: 'secondary.main', fontWeight: 700 }}
                                                >
                                                    {emp.name.charAt(0)}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="body2" fontWeight={800}>{emp.name}</Typography>
                                                    <Typography variant="caption" color="text.secondary" fontWeight={600}>{emp.email}</Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ py: 2.5 }}>
                                            <Typography variant="body2" fontWeight={700}>{emp.role?.name}</Typography>
                                        </TableCell>
                                        <TableCell sx={{ py: 2.5 }}>
                                            <Chip
                                                label={emp.status?.toUpperCase()}
                                                size="small"
                                                sx={{
                                                    fontWeight: 900,
                                                    fontSize: '0.6rem',
                                                    bgcolor: emp.status === 'active' ? alpha('#10b981', 0.1) : alpha('#64748b', 0.1),
                                                    color: emp.status === 'active' ? '#059669' : '#475569',
                                                    borderRadius: 2
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="right" sx={{ py: 2.5, pr: 4 }}>
                                            <Button
                                                variant="text"
                                                size="small"
                                                startIcon={<VisibilityIcon />}
                                                sx={{ fontWeight: 800 }}
                                                onClick={() => navigate('/employees')}
                                            >
                                                Profile
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {employees.length === 0 && (
                            <Box sx={{ p: 6, textAlign: 'center' }}>
                                <Typography color="text.secondary" fontWeight={600}>No personnel assigned to this department yet.</Typography>
                            </Box>
                        )}
                    </TableContainer>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DepartmentDetails;
