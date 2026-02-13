import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    TextField,
    Button,
    Avatar,
    Divider,
    alpha,
    Alert,
    CircularProgress,
    Switch,
    FormControlLabel,
    IconButton,
} from '@mui/material';
import {
    Person as PersonIcon,
    Security as SecurityIcon,
    Notifications as NotificationIcon,
    Save as SaveIcon,
    CloudUpload as UploadIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });

    const [securityData, setSecurityData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            // Mock API call - in a real app, you'd call a service
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSuccess('Profile updated successfully!');
        } catch (err) {
            setError('Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    const handleSecuritySubmit = async (e) => {
        e.preventDefault();
        if (securityData.newPassword !== securityData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSuccess('Password changed successfully!');
            setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setError('Failed to change password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            <Box sx={{ mb: 6 }}>
                <Typography variant="h2" fontWeight={800} gutterBottom>
                    Settings
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Manage your personal profile, account security, and portal preferences.
                </Typography>
            </Box>

            {success && <Alert severity="success" sx={{ mb: 4, borderRadius: 3 }}>{success}</Alert>}
            {error && <Alert severity="error" sx={{ mb: 4, borderRadius: 3 }}>{error}</Alert>}

            <Grid container spacing={4}>
                {/* Profile Section */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                        <Box display="flex" alignItems="center" gap={2} mb={4}>
                            <Box sx={{ p: 1, bgcolor: alpha('#4f46e5', 0.1), color: 'primary.main', borderRadius: 2 }}>
                                <PersonIcon />
                            </Box>
                            <Typography variant="h5" fontWeight={800}>Profile Information</Typography>
                        </Box>

                        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} alignItems="center" gap={4} mb={4}>
                            <Box position="relative">
                                <Avatar
                                    src={user?.profilePicture}
                                    sx={{ width: 100, height: 100, bgcolor: 'primary.main', fontSize: '2rem', fontWeight: 800 }}
                                >
                                    {user?.name?.charAt(0)}
                                </Avatar>
                                <IconButton
                                    size="small"
                                    sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        right: 0,
                                        bgcolor: 'white',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                        '&:hover': { bgcolor: '#f8fafc' }
                                    }}
                                >
                                    <UploadIcon fontSize="small" color="primary" />
                                </IconButton>
                            </Box>
                            <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                                <Typography variant="h6" fontWeight={800}>{user?.name}</Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>{user?.role?.name}</Typography>
                                <Button variant="outlined" size="small" sx={{ mt: 1, borderRadius: 2, fontWeight: 700 }}>
                                    Remove Photo
                                </Button>
                            </Box>
                        </Box>

                        <form onSubmit={handleProfileSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Full Name"
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                        required
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Email Address"
                                        type="email"
                                        value={profileData.email}
                                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                        required
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                        disabled={loading}
                                        sx={{ px: 4, py: 1.2, borderRadius: 3, fontWeight: 800 }}
                                    >
                                        Save Profile Changes
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Paper>
                </Grid>

                {/* Security Section */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                        <Box display="flex" alignItems="center" gap={2} mb={4}>
                            <Box sx={{ p: 1, bgcolor: alpha('#f59e0b', 0.1), color: 'warning.main', borderRadius: 2 }}>
                                <SecurityIcon />
                            </Box>
                            <Typography variant="h5" fontWeight={800}>Security & Password</Typography>
                        </Box>

                        <form onSubmit={handleSecuritySubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Current Password"
                                        type="password"
                                        value={securityData.currentPassword}
                                        onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                                        required
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="New Password"
                                        type="password"
                                        value={securityData.newPassword}
                                        onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                                        required
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Confirm New Password"
                                        type="password"
                                        value={securityData.confirmPassword}
                                        onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                                        required
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="warning"
                                        disabled={loading}
                                        sx={{ px: 4, py: 1.2, borderRadius: 3, fontWeight: 800 }}
                                    >
                                        Update Password
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Paper>
                </Grid>

                {/* Preferences Section */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                        <Box display="flex" alignItems="center" gap={2} mb={4}>
                            <Box sx={{ p: 1, bgcolor: alpha('#10b981', 0.1), color: 'success.main', borderRadius: 2 }}>
                                <NotificationIcon />
                            </Box>
                            <Typography variant="h5" fontWeight={800}>Preferences</Typography>
                        </Box>

                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={<Switch defaultChecked color="primary" />}
                                    label={<Typography fontWeight={600}>Email Notifications</Typography>}
                                />
                                <Typography variant="caption" display="block" color="text.secondary" sx={{ ml: 4 }}>
                                    Receive alerts for leave approvals and system announcements.
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <FormControlLabel
                                    control={<Switch defaultChecked color="primary" />}
                                    label={<Typography fontWeight={600}>Desktop Alerts</Typography>}
                                />
                                <Typography variant="caption" display="block" color="text.secondary" sx={{ ml: 4 }}>
                                    Show real-time browser notifications for important tasks.
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Settings;
