import React from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Button, Tabs, Tab, alpha, Avatar, Chip } from '@mui/material';
import {
    Check as CheckIcon,
    Close as CloseIcon,
    CalendarMonth as CalendarIcon,
    History as HistoryIcon,
    PendingActions as PendingIcon
} from '@mui/icons-material';

import {
    getLeaves,
    approveLeave,
    rejectLeave,
    applyLeave
} from '../services/leaveService';
import { useAuth } from '../context/AuthContext';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    CircularProgress,
    Alert
} from '@mui/material';

const LeaveDialog = ({ open, onClose, onApply }) => {
    const [formData, setFormData] = React.useState({
        leaveType: 'Annual Leave',
        startDate: '',
        endDate: '',
        reason: ''
    });
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onApply(formData);
            onClose();
            setFormData({ leaveType: 'Annual Leave', startDate: '', endDate: '', reason: '' });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
            <form onSubmit={handleSubmit}>
                <DialogTitle sx={{ fontWeight: 800 }}>Apply for Leave</DialogTitle>
                <DialogContent>
                    <Grid container spacing={3} sx={{ mt: 0 }}>
                        <Grid item xs={12}>
                            <TextField
                                select
                                fullWidth
                                label="Leave Type"
                                value={formData.leaveType}
                                onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                                required
                            >
                                {['Annual Leave', 'Sick Leave', 'Casual Leave', 'Unpaid Leave'].map((option) => (
                                    <MenuItem key={option} value={option}>{option}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Start Date"
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                InputLabelProps={{ shrink: true }}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="End Date"
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                InputLabelProps={{ shrink: true }}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Reason"
                                multiline
                                rows={4}
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                required
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={onClose} fontWeight={800}>Cancel</Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{ borderRadius: 3, px: 4, fontWeight: 800 }}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Submit Request'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

const LeaveManagement = () => {
    const { user } = useAuth();
    const [tab, setTab] = React.useState(0);
    const [leaves, setLeaves] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [dialogOpen, setDialogOpen] = React.useState(false);

    const fetchLeaves = async () => {
        try {
            setLoading(true);
            const statusFilter = tab === 0 ? 'pending' : '';
            const data = await getLeaves({ status: statusFilter });
            setLeaves(data.leaves);
        } catch (err) {
            setError('Failed to fetch leave requests.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchLeaves();
    }, [tab]);

    const handleApprove = async (id) => {
        try {
            await approveLeave(id, 'Approved by management.');
            fetchLeaves();
        } catch (err) {
            console.error(err);
        }
    };

    const handleReject = async (id) => {
        try {
            await rejectLeave(id, 'Request declined.');
            fetchLeaves();
        } catch (err) {
            console.error(err);
        }
    };

    const handleApply = async (formData) => {
        await applyLeave(formData);
        fetchLeaves();
    };

    const calculateDays = (start, end) => {
        const s = new Date(start);
        const e = new Date(end);
        const diff = Math.abs(e - s);
        return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
    };

    const filteredLeaves = tab === 1
        ? leaves.filter(l => l.status !== 'pending')
        : leaves.filter(l => l.status === 'pending');

    return (
        <Box>
            <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography variant="h2" fontWeight={800} gutterBottom>
                        Leave Management
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
                        {user?.role?.name === 'Employee'
                            ? 'Manage your time-off requests and track approval status.'
                            : 'Monitor personnel availability and process departmental time-off requests.'}
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<CalendarIcon />}
                    onClick={() => setDialogOpen(true)}
                    sx={{ borderRadius: 3, px: 3, py: 1.5, fontWeight: 800, boxShadow: '0 8px 20px rgba(79, 70, 229, 0.2)' }}
                >
                    Apply Leave
                </Button>
            </Box>

            <Tabs
                value={tab}
                onChange={(e, v) => setTab(v)}
                sx={{
                    mb: 4,
                    '& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0' },
                    '& .MuiTab-root': { fontWeight: 800, fontSize: '0.9rem', py: 2, minWidth: 160 }
                }}
            >
                <Tab icon={<PendingIcon />} iconPosition="start" label="Pending Approval" />
                <Tab icon={<HistoryIcon />} iconPosition="start" label="Resolution History" />
            </Tabs>

            {error && <Alert severity="error" sx={{ mb: 4, borderRadius: 3 }}>{error}</Alert>}

            <Box sx={{ mt: 3 }}>
                {loading ? (
                    <Box display="flex" justifyContent="center" py={10}>
                        <CircularProgress />
                    </Box>
                ) : filteredLeaves.length > 0 ? (
                    <Grid container spacing={4}>
                        {filteredLeaves.map((leave) => (
                            <Grid item xs={12} md={6} key={leave._id}>
                                <Card sx={{
                                    borderRadius: 4,
                                    boxShadow: '0 4px 24px rgba(0,0,0,0.03)',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    overflow: 'hidden'
                                }}>
                                    <CardContent sx={{ p: 4 }}>
                                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                                            <Box display="flex" alignItems="center" gap={2}>
                                                <Avatar sx={{ bgcolor: 'primary.main', fontWeight: 800 }}>
                                                    {leave.employee.name.charAt(0)}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="subtitle1" fontWeight={800}>{leave.employee.name}</Typography>
                                                    <Chip
                                                        label={leave.leaveType.toUpperCase()}
                                                        size="small"
                                                        sx={{
                                                            mt: 0.5,
                                                            height: 20,
                                                            fontSize: '0.65rem',
                                                            fontWeight: 900,
                                                            bgcolor: alpha('#4f46e5', 0.1),
                                                            color: 'primary.main'
                                                        }}
                                                    />
                                                </Box>
                                            </Box>
                                            <Typography variant="h4" color="primary.main" fontWeight={900}>
                                                {calculateDays(leave.startDate, leave.endDate)}d
                                            </Typography>
                                        </Box>

                                        <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 4, mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <CalendarIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                                            <Typography variant="body2" fontWeight={600} color="text.primary">
                                                {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                            </Typography>
                                        </Box>

                                        {leave.status === 'pending' ? (
                                            user?.role?.name !== 'Employee' ? (
                                                <Box display="flex" gap={2}>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        startIcon={<CheckIcon />}
                                                        fullWidth
                                                        onClick={() => handleApprove(leave._id)}
                                                        sx={{ py: 1.5, borderRadius: 3, fontWeight: 800 }}
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        startIcon={<CloseIcon />}
                                                        fullWidth
                                                        onClick={() => handleReject(leave._id)}
                                                        sx={{ py: 1.5, borderRadius: 3, fontWeight: 800 }}
                                                    >
                                                        Decline
                                                    </Button>
                                                </Box>
                                            ) : (
                                                <Chip
                                                    label="WAITING FOR APPROVAL"
                                                    sx={{ width: '100%', py: 2.5, borderRadius: 3, fontWeight: 800, bgcolor: alpha('#f59e0b', 0.1), color: '#b45309' }}
                                                />
                                            )
                                        ) : (
                                            <Box display="flex" alignItems="center" justifyContent="center" sx={{
                                                py: 1.5,
                                                borderRadius: 3,
                                                bgcolor: leave.status === 'approved' ? alpha('#10b981', 0.1) : alpha('#ef4444', 0.1),
                                                color: leave.status === 'approved' ? 'success.main' : 'error.main'
                                            }}>
                                                <Typography variant="body2" fontWeight={800} sx={{ textTransform: 'uppercase' }}>
                                                    {leave.status} {leave.approver && `by ${leave.approver.name}`}
                                                </Typography>
                                            </Box>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Paper sx={{ p: 10, textAlign: 'center', borderRadius: 4, border: '1px dashed', borderColor: 'divider', bgcolor: 'transparent' }}>
                        <Typography variant="h6" color="text.secondary" fontWeight={600}>
                            {tab === 0 ? 'No pending leave requests.' : 'No historical records found.'}
                        </Typography>
                    </Paper>
                )}
            </Box>

            <LeaveDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onApply={handleApply}
            />
        </Box>
    );
};

export default LeaveManagement;
