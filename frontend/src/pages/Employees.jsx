import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Avatar,
    Button,
    alpha,
    TextField,
    InputAdornment,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    Grid,
    CircularProgress,
    Alert,
    Menu,
} from '@mui/material';
import {
    Search as SearchIcon,
    Add as AddIcon,
    FilterList as FilterIcon,
    MoreVert as MoreIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Business as BusinessIcon,
    AdminPanelSettings as RoleIcon,
} from '@mui/icons-material';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from '../services/employeeService';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { getDepartments } from '../services/departmentService';
import { getRoles } from '../services/roleService';

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filters
    const [search, setSearch] = useState('');
    const [deptFilter, setDeptFilter] = useState('all');
    const [roleFilter, setRoleFilter] = useState('all');

    // Dialog state
    const [open, setOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: '',
        department: '',
        phone: '',
        status: 'active'
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [empData, deptData, roleData] = await Promise.all([
                getEmployees(),
                getDepartments(),
                getRoles()
            ]);
            setEmployees(empData.employees || []);
            setDepartments(deptData.departments || []);
            setRoles(roleData.roles || []);
            setError(null);
        } catch (err) {
            setError('Failed to fetch data. Please check your connection.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (employee = null) => {
        if (employee) {
            setEditingEmployee(employee);
            setFormData({
                name: employee.name,
                email: employee.email,
                password: '', // Don't show password on edit
                role: employee.role?._id || '',
                department: employee.department?._id || '',
                phone: employee.phone || '',
                status: employee.status || 'active'
            });
        } else {
            setEditingEmployee(null);
            setFormData({
                name: '',
                email: '',
                password: '',
                role: '',
                department: '',
                phone: '',
                status: 'active'
            });
        }
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        setEditingEmployee(null);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingEmployee) {
                // Remove password from update if empty
                const updateData = { ...formData };
                if (!updateData.password) delete updateData.password;
                await updateEmployee(editingEmployee._id, updateData);
            } else {
                await createEmployee(formData);
            }
            fetchInitialData();
            handleCloseDialog();
        } catch (err) {
            setError(err.response?.data?.message || 'Operation failed.');
        } finally {
            setSubmitting(false);
        }
    };

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);

    const handleDeleteClick = (id) => {
        setEmployeeToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!employeeToDelete) return;
        try {
            await deleteEmployee(employeeToDelete);
            await fetchInitialData();
            setDeleteDialogOpen(false);
            setEmployeeToDelete(null);
        } catch (err) {
            setError('Failed to delete employee.');
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setEmployeeToDelete(null);
    };

    const filteredEmployees = employees.filter(emp => {
        const matchesSearch = emp.name.toLowerCase().includes(search.toLowerCase()) ||
            emp.email.toLowerCase().includes(search.toLowerCase());
        const matchesDept = deptFilter === 'all' || emp.department?._id === deptFilter;
        const matchesRole = roleFilter === 'all' || emp.role?._id === roleFilter;
        return matchesSearch && matchesDept && matchesRole;
    });

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 3 }}>
                <Box>
                    <Typography variant="h2" fontWeight={800} gutterBottom>
                        Workforce
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Comprehensive directory for personnel management and organizational oversight.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                    sx={{
                        borderRadius: 3,
                        py: 1.5,
                        px: 4,
                        fontWeight: 800,
                        boxShadow: '0 8px 16px rgba(79, 70, 229, 0.2)'
                    }}
                >
                    Add Employee
                </Button>
            </Box>

            {/* Filters Bar */}
            <Paper sx={{ p: 2, mb: 4, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid', borderColor: 'divider' }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
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
                            select
                            fullWidth
                            label="Department"
                            value={deptFilter}
                            onChange={(e) => setDeptFilter(e.target.value)}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                        >
                            <MenuItem value="all">All Departments</MenuItem>
                            {departments.map((dept) => (
                                <MenuItem key={dept._id} value={dept._id}>{dept.name}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            select
                            fullWidth
                            label="Role"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                        >
                            <MenuItem value="all">All Roles</MenuItem>
                            {roles.map((role) => (
                                <MenuItem key={role._id} value={role._id}>{role.name}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                </Grid>
            </Paper>

            {error && <Alert severity="error" sx={{ mb: 4, borderRadius: 3 }}>{error}</Alert>}

            <TableContainer component={Paper} sx={{ border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.02)', borderRadius: 4, overflow: 'hidden' }}>
                <Table>
                    <TableHead sx={{ bgcolor: 'background.default' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 800, py: 3, pl: 4 }}>EMPLOYEE</TableCell>
                            <TableCell sx={{ fontWeight: 800, py: 3 }}>ORGANIZATION</TableCell>
                            <TableCell sx={{ fontWeight: 800, py: 3 }}>STATUS</TableCell>
                            <TableCell sx={{ fontWeight: 800, py: 3 }}>JOINED</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 800, py: 3, pr: 4 }}>ACTIONS</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredEmployees.map((emp) => (
                            <TableRow key={emp._id} sx={{ '&:hover': { bgcolor: alpha('#4f46e5', 0.02) } }}>
                                <TableCell sx={{ py: 3, pl: 4 }}>
                                    <Box display="flex" alignItems="center" gap={2.5}>
                                        <Avatar
                                            src={emp.profilePicture}
                                            sx={{
                                                bgcolor: 'primary.main',
                                                width: 44,
                                                height: 44,
                                                fontWeight: 800,
                                                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.15)'
                                            }}
                                        >
                                            {emp.name.charAt(0)}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight={800}>{emp.name}</Typography>
                                            <Typography variant="caption" color="text.secondary" fontWeight={600}>{emp.email}</Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ py: 3 }}>
                                    <Box display="flex" flexDirection="column">
                                        <Typography variant="body2" fontWeight={700} display="flex" alignItems="center" gap={1}>
                                            <RoleIcon sx={{ fontSize: 16, color: 'primary.main' }} /> {emp.role?.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" fontWeight={600} display="flex" alignItems="center" gap={1}>
                                            <BusinessIcon sx={{ fontSize: 14 }} /> {emp.department?.name || 'Unassigned'}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ py: 3 }}>
                                    <Chip
                                        label={emp.status?.toUpperCase()}
                                        sx={{
                                            fontWeight: 900,
                                            height: 22,
                                            fontSize: '0.6rem',
                                            borderRadius: 2,
                                            bgcolor: emp.status === 'active' ? alpha('#10b981', 0.1) : alpha('#64748b', 0.1),
                                            color: emp.status === 'active' ? '#059669' : '#475569',
                                        }}
                                    />
                                </TableCell>
                                <TableCell sx={{ py: 3 }}>
                                    <Typography variant="body2" color="text.secondary" fontWeight={600}>
                                        {new Date(emp.dateOfJoining).toLocaleDateString()}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right" sx={{ py: 3, pr: 4 }}>
                                    <Box display="flex" justifyContent="flex-end" gap={1}>
                                        <IconButton size="small" onClick={() => handleOpenDialog(emp)} sx={{ color: 'primary.main', bgcolor: alpha('#4f46e5', 0.05) }}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" onClick={() => handleDeleteClick(emp._id)} sx={{ color: 'error.main', bgcolor: alpha('#ef4444', 0.05) }}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {filteredEmployees.length === 0 && (
                    <Box sx={{ p: 6, textAlign: 'center' }}>
                        <Typography color="text.secondary" fontWeight={600}>No workforce entries found matching your criteria.</Typography>
                    </Box>
                )}
            </TableContainer>

            {/* Add/Edit Employee Dialog */}
            <Dialog
                open={open}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: 5, p: 2 } }}
            >
                <form onSubmit={handleSubmit}>
                    <DialogTitle>
                        <Typography variant="h4" fontWeight={800}>{editingEmployee ? 'Edit Profile' : 'Onboard Employee'}</Typography>
                        <Typography variant="body2" color="text.secondary">Configure personnel details and access credentials.</Typography>
                    </DialogTitle>
                    <DialogContent sx={{ mt: 2 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Full Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Email Address"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    fullWidth
                                    disabled={!!editingEmployee}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label={editingEmployee ? "Reset Password (Optional)" : "Password"}
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required={!editingEmployee}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Phone Number"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    select
                                    label="Role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    required
                                    fullWidth
                                >
                                    {roles.map((role) => (
                                        <MenuItem key={role._id} value={role._id}>{role.name}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    select
                                    label="Department"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    fullWidth
                                >
                                    <MenuItem value="">Unassigned</MenuItem>
                                    {departments.map((dept) => (
                                        <MenuItem key={dept._id} value={dept._id}>{dept.name}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    select
                                    label="Account Status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    fullWidth
                                >
                                    <MenuItem value="active">Active</MenuItem>
                                    <MenuItem value="inactive">Inactive</MenuItem>
                                </TextField>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 3, pt: 0 }}>
                        <Button onClick={handleCloseDialog} sx={{ fontWeight: 700, color: 'text.secondary' }}>Cancel</Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={submitting}
                            sx={{ borderRadius: 3, px: 4, fontWeight: 800 }}
                        >
                            {submitting ? 'Processing...' : (editingEmployee ? 'Update Profile' : 'Confirm Onboarding')}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            <ConfirmDialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title="Delete Employee"
                description="Are you sure you want to delete this employee record? This action is permanent and will remove all associated data."
                confirmText="Delete Record"
                type="danger"
            />
        </Box>
    );
};

export default Employees;
