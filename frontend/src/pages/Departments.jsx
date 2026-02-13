import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    alpha,
    Avatar,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    CircularProgress,
    Alert
} from '@mui/material';
import Loader from '../components/common/Loader';
import LottieAnimation from '../components/common/LottieAnimation';
import { loadingLottie } from '../assets/animations/loading';
import {
    Business as BusinessIcon,
    Add as AddIcon,
    Groups as GroupsIcon,
} from '@mui/icons-material';
import { getDepartments, createDepartment } from '../services/departmentService';
import { getEmployees } from '../services/employeeService';

const DepartmentCard = ({ id, name, manager, description, employeesCount, color }) => {
    const navigate = useNavigate();
    return (
        <Card sx={{
            height: '100%',
            borderRadius: 4,
            border: '1px solid',
            borderColor: 'divider',
            transition: 'all 0.3s ease',
            '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: (theme) => `0 20px 40px ${alpha(theme.palette[color || 'primary'].main, 0.12)}`,
                borderColor: `${color || 'primary'}.main`
            }
        }}>
            <CardContent sx={{ p: 4 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
                    <Box
                        sx={{
                            p: 1.5,
                            bgcolor: (theme) => alpha(theme.palette[color || 'primary'].main, 0.1),
                            color: `${color || 'primary'}.main`,
                            borderRadius: 3
                        }}
                    >
                        <BusinessIcon />
                    </Box>
                    <Chip
                        label="Active"
                        size="small"
                        sx={{
                            bgcolor: alpha('#10b981', 0.1),
                            color: '#059669',
                            fontWeight: 800,
                            fontSize: '0.7rem'
                        }}
                    />
                </Box>

                <Typography variant="h5" fontWeight={800} gutterBottom>
                    {name}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, minHeight: 40, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {description || 'No description provided.'}
                </Typography>

                <Box display="flex" alignItems="center" gap={1.5} mb={3}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: (theme) => alpha(theme.palette[color || 'primary'].main, 0.2), color: `${color || 'primary'}.main`, fontSize: '0.875rem', fontWeight: 700 }}>
                        {manager?.name?.charAt(0) || '?'}
                    </Avatar>
                    <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', lineHeight: 1 }}>
                            HEAD OF DEPT
                        </Typography>
                        <Typography variant="body2" fontWeight={700}>
                            {manager?.name || 'Unassigned'}
                        </Typography>
                    </Box>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        pt: 2,
                        borderTop: '1px solid',
                        borderColor: 'divider'
                    }}
                >
                    <Box display="flex" alignItems="center" gap={1}>
                        <GroupsIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                        <Typography variant="body2" fontWeight={700} color="text.secondary">
                            {employeesCount || 0} Members
                        </Typography>
                    </Box>
                    <Button
                        size="small"
                        sx={{ fontWeight: 800, color: `${color || 'primary'}.main` }}
                        onClick={() => navigate(`/departments/${id}`)}
                    >
                        Details
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

const Departments = () => {
    const [departments, setDepartments] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        manager: '',
        description: ''
    });

    const colors = ['primary', 'secondary', 'success', 'warning', 'info', 'error'];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const deptData = await getDepartments();
            const empData = await getEmployees();
            setDepartments(deptData.departments || []);
            setEmployees(empData.employees || []);
            setError(null);
        } catch (err) {
            setError('Failed to fetch department data. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setFormData({ name: '', manager: '', description: '' });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await createDepartment(formData);
            await fetchData();
            handleClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create department.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <Loader fullScreen message="Loading departments..." animationData={loadingLottie} />;
    }

    return (
        <Box>
            <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                <Box>
                    <Typography variant="h2" fontWeight={800} gutterBottom>
                        Departments
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Manage organizational structure and departmental leadership.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpen}
                    sx={{
                        borderRadius: 3,
                        py: 1.5,
                        px: 3,
                        fontWeight: 800,
                        boxShadow: '0 8px 16px rgba(79, 70, 229, 0.2)',
                        whiteSpace: 'nowrap'
                    }}
                >
                    Add New Dept
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 4, borderRadius: 3 }}>{error}</Alert>}

            <Grid container spacing={4}>
                {departments.map((dept, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={dept._id}>
                        <DepartmentCard
                            id={dept._id}
                            name={dept.name}
                            manager={dept.manager}
                            description={dept.description}
                            employeesCount={employees.filter(emp => emp.department?._id === dept._id).length}
                            color={colors[index % colors.length]}
                        />
                    </Grid>
                ))}
            </Grid>

            {/* Add Department Dialog */}
            {!loading && departments.length === 0 && (
                <Box sx={{ p: 8, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <LottieAnimation
                        animationData={loadingLottie}
                        width={150}
                        height={150}
                        style={{ opacity: 0.5, filter: 'grayscale(100%)' }}
                    />
                    <Typography variant="h6" color="text.secondary" fontWeight={700} mt={2}>
                        No departments found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Get started by creating your first department.
                    </Typography>
                    <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={handleOpen}
                        sx={{ mt: 3, borderRadius: 3, fontWeight: 700 }}
                    >
                        Create Department
                    </Button>
                </Box>
            )}
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    sx: { borderRadius: 5, p: 2, maxWidth: 500, width: '100%' }
                }}
            >
                <form onSubmit={handleSubmit}>
                    <DialogTitle>
                        <Typography variant="h4" fontWeight={800}>Create New Department</Typography>
                        <Typography variant="body2" color="text.secondary">Fill in the details to establish a new organizational unit.</Typography>
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <TextField
                                label="Department Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                fullWidth
                                variant="outlined"
                                placeholder="e.g. Finance, Product, Operations"
                            />
                            <TextField
                                select
                                label="Department Manager"
                                name="manager"
                                value={formData.manager}
                                onChange={handleChange}
                                required
                                fullWidth
                                variant="outlined"
                            >
                                {employees
                                    .filter(emp => emp.role?.name === 'Manager' || emp.role?.name === 'HR Admin')
                                    .map((emp) => (
                                        <MenuItem key={emp._id} value={emp._id}>
                                            <Box display="flex" alignItems="center" gap={1.5}>
                                                <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>{emp.name.charAt(0)}</Avatar>
                                                {emp.name} ({emp.role?.name})
                                            </Box>
                                        </MenuItem>
                                    ))
                                }
                            </TextField>
                            <TextField
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                multiline
                                rows={3}
                                fullWidth
                                variant="outlined"
                                placeholder="Briefly describe the department's core responsibilities..."
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: 3, pt: 0 }}>
                        <Button onClick={handleClose} sx={{ fontWeight: 700, color: 'text.secondary' }}>Cancel</Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={submitting}
                            sx={{
                                borderRadius: 3,
                                px: 4,
                                fontWeight: 800,
                                bgcolor: 'primary.main',
                                '&:hover': { bgcolor: 'primary.dark' }
                            }}
                        >
                            {submitting ? 'Creating...' : 'Create Department'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
};

export default Departments;
