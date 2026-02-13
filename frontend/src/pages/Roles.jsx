import React, { useState, useEffect } from 'react';
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
    Checkbox,
    FormControlLabel,
    FormGroup,
    IconButton,
    CircularProgress,
    Alert,
    Divider,
    Paper,
    Tooltip
} from '@mui/material';
import {
    AdminPanelSettings as AdminIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Security as SecurityIcon,
    CheckCircle as CheckCircleIcon,
    RadioButtonUnchecked as UncheckedIcon,
} from '@mui/icons-material';
import { getRoles, createRole, updateRole, deleteRole } from '../services/roleService';
import ConfirmDialog from '../components/common/ConfirmDialog';

const RoleCard = ({ role, onEdit, onDelete, color }) => {
    return (
        <Card sx={{
            height: '100%',
            borderRadius: 4,
            border: '1px solid',
            borderColor: 'divider',
            transition: 'all 0.3s ease',
            position: 'relative',
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
                        <AdminIcon />
                    </Box>
                    <Box>
                        <IconButton size="small" onClick={() => onEdit(role)} sx={{ mr: 1 }}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => onDelete(role._id)} color="error">
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>

                <Typography variant="h5" fontWeight={800} gutterBottom>
                    {role.name}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, minHeight: 40 }}>
                    {role.description || 'No description provided.'}
                </Typography>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: 'block', mb: 1, letterSpacing: 1 }}>
                        PERMISSIONS ({role.permissions?.length || 0})
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                        {role.permissions?.slice(0, 5).map((perm) => (
                            <Chip
                                key={perm}
                                label={perm}
                                size="small"
                                sx={{
                                    fontSize: '0.65rem',
                                    fontWeight: 700,
                                    bgcolor: (theme) => alpha(theme.palette[color || 'primary'].main, 0.05),
                                    color: `${color || 'primary'}.main`,
                                    border: '1px solid',
                                    borderColor: (theme) => alpha(theme.palette[color || 'primary'].main, 0.1)
                                }}
                            />
                        ))}
                        {role.permissions?.length > 5 && (
                            <Chip
                                label={`+${role.permissions.length - 5} more`}
                                size="small"
                                sx={{ fontSize: '0.65rem', fontWeight: 700 }}
                            />
                        )}
                    </Box>
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" color="text.secondary">
                        Created {new Date(role.createdAt).toLocaleDateString()}
                    </Typography>
                    {role.name === 'Super Admin' && (
                        <Chip label="System Role" size="small" color="primary" variant="outlined" sx={{ fontWeight: 800, fontSize: '0.6rem' }} />
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

const Roles = () => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editingRole, setEditingRole] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        permissions: []
    });

    const permissionGroups = {
        'Employees': ['employee:view', 'employee:create', 'employee:edit', 'employee:delete'],
        'Departments': ['department:view', 'department:create', 'department:edit', 'department:delete'],
        'Roles': ['role:view', 'role:create', 'role:edit', 'role:delete'],
        'Leaves': ['leave:view', 'leave:apply', 'leave:approve'],
        'System': ['audit:view', 'report:view', 'dashboard:view']
    };

    const colors = ['primary', 'secondary', 'success', 'warning', 'info', 'error'];

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            setLoading(true);
            const data = await getRoles();
            setRoles(data.roles || []);
            setError(null);
        } catch (err) {
            setError('Failed to fetch roles. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpen = (role = null) => {
        if (role) {
            setEditingRole(role);
            setFormData({
                name: role.name,
                description: role.description || '',
                permissions: role.permissions || []
            });
        } else {
            setEditingRole(null);
            setFormData({ name: '', description: '', permissions: [] });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingRole(null);
        setFormData({ name: '', description: '', permissions: [] });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePermissionToggle = (perm) => {
        const newPermissions = formData.permissions.includes(perm)
            ? formData.permissions.filter(p => p !== perm)
            : [...formData.permissions, perm];
        setFormData({ ...formData, permissions: newPermissions });
    };

    const handleGroupToggle = (groupPerms) => {
        const allSelected = groupPerms.every(p => formData.permissions.includes(p));
        let newPermissions;
        if (allSelected) {
            newPermissions = formData.permissions.filter(p => !groupPerms.includes(p));
        } else {
            newPermissions = [...new Set([...formData.permissions, ...groupPerms])];
        }
        setFormData({ ...formData, permissions: newPermissions });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingRole) {
                await updateRole(editingRole._id, formData);
            } else {
                await createRole(formData);
            }
            await fetchRoles();
            handleClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Operation failed.');
        } finally {
            setSubmitting(false);
        }
    };

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState(null);

    const handleDeleteClick = (id) => {
        setRoleToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!roleToDelete) return;
        try {
            await deleteRole(roleToDelete);
            await fetchRoles();
            setDeleteDialogOpen(false);
            setRoleToDelete(null);
        } catch (err) {
            setError('Failed to delete role.');
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setRoleToDelete(null);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                <Box>
                    <Typography variant="h2" fontWeight={800} gutterBottom>
                        Role Management
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Define system accessibility and granular permissions for each user role.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpen()}
                    sx={{
                        borderRadius: 3,
                        py: 1.5,
                        px: 3,
                        fontWeight: 800,
                        boxShadow: '0 8px 16px rgba(79, 70, 229, 0.2)',
                        whiteSpace: 'nowrap'
                    }}
                >
                    Create New Role
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 4, borderRadius: 3 }}>{error}</Alert>}

            <Grid container spacing={4}>
                {roles.map((role, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={role._id}>
                        <RoleCard
                            role={role}
                            onEdit={handleOpen}
                            onDelete={handleDeleteClick}
                            color={colors[index % colors.length]}
                        />
                    </Grid>
                ))}
            </Grid>

            {/* Role Dialog */}
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 5, p: 2, overflow: 'hidden' }
                }}
            >
                <form onSubmit={handleSubmit}>
                    <DialogTitle>
                        <Typography variant="h4" fontWeight={800}>
                            {editingRole ? 'Update Role' : 'Create New Role'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Configure role identity and security permissions.
                        </Typography>
                    </DialogTitle>
                    <DialogContent sx={{
                        p: 3,
                        maxHeight: '70vh',
                        // Consolidate to a single premium scrollbar on the main content area
                        '&::-webkit-scrollbar': {
                            width: '8px',
                        },
                        '&::-webkit-scrollbar-track': {
                            background: (theme) => alpha(theme.palette.divider, 0.05),
                            borderRadius: '10px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: (theme) => alpha(theme.palette.primary.main, 0.2),
                            borderRadius: '10px',
                            '&:hover': {
                                background: (theme) => alpha(theme.palette.primary.main, 0.4),
                            }
                        },
                    }}>
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={5}>
                                <Box display="flex" flexDirection="column" gap={3}>
                                    <TextField
                                        label="Role Name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        fullWidth
                                        variant="outlined"
                                        placeholder="e.g. Sales Lead, Auditor"
                                    />
                                    <TextField
                                        label="Description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        multiline
                                        rows={4}
                                        fullWidth
                                        variant="outlined"
                                        placeholder="Describe the scope and responsibilities of this role..."
                                    />
                                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: 'background.default' }}>
                                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                                            <SecurityIcon color="primary" fontSize="small" />
                                            <Typography variant="subtitle2" fontWeight={800}>Security Note</Typography>
                                        </Box>
                                        <Typography variant="caption" color="text.secondary">
                                            Permissions grant direct access to specific database operations. Be cautious when assigning 'delete' permissions.
                                        </Typography>
                                    </Paper>
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={7}>
                                <Typography variant="subtitle1" fontWeight={800} mb={2}>
                                    Granular Permissions
                                </Typography>
                                <Box sx={{ pr: 1 }}>
                                    {Object.entries(permissionGroups).map(([group, perms]) => (
                                        <Box key={group} sx={{ mb: 3 }}>
                                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                                <Typography variant="body2" fontWeight={900} color="primary" sx={{ letterSpacing: 1, textTransform: 'uppercase' }}>
                                                    {group}
                                                </Typography>
                                                <Button
                                                    size="small"
                                                    onClick={() => handleGroupToggle(perms)}
                                                    sx={{ fontSize: '0.7rem', fontWeight: 800 }}
                                                >
                                                    {perms.every(p => formData.permissions.includes(p)) ? 'Deselect All' : 'Select All'}
                                                </Button>
                                            </Box>
                                            <Divider sx={{ mb: 1.5 }} />
                                            <Grid container spacing={1}>
                                                {perms.map((perm) => (
                                                    <Grid item xs={12} sm={6} key={perm}>
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    checked={formData.permissions.includes(perm)}
                                                                    onChange={() => handlePermissionToggle(perm)}
                                                                    icon={<UncheckedIcon sx={{ fontSize: 20 }} />}
                                                                    checkedIcon={<CheckCircleIcon sx={{ fontSize: 20 }} />}
                                                                />
                                                            }
                                                            label={
                                                                <Typography variant="body2" fontWeight={600}>
                                                                    {perm.split(':')[1].charAt(0).toUpperCase() + perm.split(':')[1].slice(1)}
                                                                </Typography>
                                                            }
                                                        />
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </Box>
                                    ))}
                                </Box>
                            </Grid>
                        </Grid>
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
                            {submitting ? 'Saving...' : editingRole ? 'Update Role' : 'Create Role'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            <ConfirmDialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title="Delete Role"
                description="Are you sure you want to delete this role? This action cannot be undone and may affect users currently assigned to this role."
                confirmText="Delete Role"
                type="danger"
            />
        </Box>
    );
};

export default Roles;
