import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    CircularProgress,
    alpha,
    Card,
    CardContent,
    Grid,
    Chip
} from '@mui/material';
import {
    AccessTime as TimeIcon,
    Login as PunchInIcon,
    Logout as PunchOutIcon,
    Description as NoteIcon,
    Assignment as ReportIcon,
    CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { getAttendanceStatus, punchIn, punchOut } from '../../services/attendanceService';
import Loader from '../common/Loader';
import { loadingLottie } from '../../assets/animations/loading';
import LottieAnimation from '../common/LottieAnimation';

const AttendanceWidget = () => {
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('loading'); // loading, not_punched_in, punched_in, punched_out
    const [attendanceData, setAttendanceData] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    // Form state
    const [note, setNote] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        fetchStatus();
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const fetchStatus = async () => {
        try {
            setLoading(true);
            const data = await getAttendanceStatus();
            setStatus(data.status);
            if (data.data) {
                setAttendanceData(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch attendance status:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePunchClick = () => {
        setNote('');
        setDialogOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (status === 'not_punched_in') {
                await punchIn(note);
            } else if (status === 'punched_in') {
                await punchOut(note);
            }
            await fetchStatus();
            setDialogOpen(false);
        } catch (error) {
            console.error('Punch action failed:', error);
            // Optionally add error handling UI here
        } finally {
            setSubmitting(false);
        }
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getDuration = () => {
        if (!attendanceData?.punchIn) return '0h 0m';
        const start = new Date(attendanceData.punchIn);
        const end = attendanceData.punchOut ? new Date(attendanceData.punchOut) : new Date();
        const diffMs = end - start;
        const hours = Math.floor(diffMs / 3600000);
        const minutes = Math.floor((diffMs % 3600000) / 60000);
        return `${hours}h ${minutes}m`;
    };

    if (loading) {
        return (
            <Card sx={{ height: '100%', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
                <CircularProgress />
            </Card>
        );
    }

    return (
        <Card sx={{
            height: '100%',
            borderRadius: 4,
            backgroundImage: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(79, 70, 229, 0.3)'
        }}>
            {/* Background elements */}
            <Box sx={{
                position: 'absolute',
                top: -20,
                right: -20,
                width: 150,
                height: 150,
                borderRadius: '50%',
                bgcolor: 'rgba(255,255,255,0.1)',
                zIndex: 0
            }} />

            <CardContent sx={{ position: 'relative', zIndex: 1, p: 4, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                        <Typography variant="caption" sx={{ opacity: 0.8, fontWeight: 700, letterSpacing: 1 }}>
                            {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase()}
                        </Typography>
                        <Typography variant="h3" fontWeight={800} sx={{ mt: 1 }}>
                            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                    </Box>
                    <Box sx={{
                        bgcolor: 'rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(10px)',
                        p: 1.5,
                        borderRadius: 3
                    }}>
                        <TimeIcon />
                    </Box>
                </Box>

                <Box sx={{ mt: 4 }}>
                    {status === 'not_punched_in' && (
                        <Box>
                            <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                                Good morning! Ready to start your day?
                            </Typography>
                            <Button
                                variant="contained"
                                color="inherit"
                                onClick={handlePunchClick}
                                startIcon={<PunchInIcon />}
                                sx={{
                                    bgcolor: 'white',
                                    color: 'primary.main',
                                    fontWeight: 800,
                                    px: 3,
                                    py: 1.5,
                                    borderRadius: 3,
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                                }}
                            >
                                Punch In
                            </Button>
                        </Box>
                    )}

                    {status === 'punched_in' && (
                        <Box>
                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                <Grid item xs={6}>
                                    <Box sx={{ bgcolor: 'rgba(0,0,0,0.2)', p: 1.5, borderRadius: 2 }}>
                                        <Typography variant="caption" sx={{ opacity: 0.7 }}>Punch In</Typography>
                                        <Typography variant="body2" fontWeight={700}>
                                            {formatTime(attendanceData?.punchIn)}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Box sx={{ bgcolor: 'rgba(0,0,0,0.2)', p: 1.5, borderRadius: 2 }}>
                                        <Typography variant="caption" sx={{ opacity: 0.7 }}>Working</Typography>
                                        <Typography variant="body2" fontWeight={700}>
                                            {getDuration()}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                            <Button
                                variant="contained"
                                onClick={handlePunchClick}
                                startIcon={<PunchOutIcon />}
                                sx={{
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    color: 'white',
                                    fontWeight: 800,
                                    px: 3,
                                    py: 1.5,
                                    borderRadius: 3,
                                    border: '1px solid rgba(255,255,255,0.3)',
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                                }}
                            >
                                Punch Out
                            </Button>
                        </Box>
                    )}

                    {status === 'punched_out' && (
                        <Box>
                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid item xs={6}>
                                    <Box sx={{ bgcolor: 'rgba(0,0,0,0.2)', p: 1.5, borderRadius: 2 }}>
                                        <Typography variant="caption" sx={{ opacity: 0.7 }}>Shift Start</Typography>
                                        <Typography variant="body2" fontWeight={700}>
                                            {formatTime(attendanceData?.punchIn)}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Box sx={{ bgcolor: 'rgba(0,0,0,0.2)', p: 1.5, borderRadius: 2 }}>
                                        <Typography variant="caption" sx={{ opacity: 0.7 }}>Shift End</Typography>
                                        <Typography variant="body2" fontWeight={700}>
                                            {formatTime(attendanceData?.punchOut)}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                            <Chip
                                icon={<CheckCircleIcon sx={{ color: 'white !important' }} />}
                                label="Day Completed"
                                sx={{
                                    bgcolor: '#10b981',
                                    color: 'white',
                                    fontWeight: 700,
                                    borderRadius: 2
                                }}
                            />
                        </Box>
                    )}
                </Box>
            </CardContent>

            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                PaperProps={{ sx: { borderRadius: 4, minWidth: 400 } }}
            >
                <form onSubmit={handleSubmit}>
                    <DialogTitle sx={{ fontWeight: 800 }}>
                        {status === 'not_punched_in' ? 'Morning Scrum' : 'Daily Report'}
                    </DialogTitle>
                    <DialogContent>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {status === 'not_punched_in'
                                ? 'What is your plan for today?'
                                : 'What did you accomplish today?'}
                        </Typography>
                        <TextField
                            autoFocus
                            multiline
                            rows={4}
                            fullWidth
                            variant="outlined"
                            placeholder={status === 'not_punched_in' ? "- Task A\n- Task B" : "- Completed Task A\n- Fixed Bug B"}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            required
                        />
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Button onClick={() => setDialogOpen(false)} sx={{ fontWeight: 700, color: 'text.secondary' }}>Cancel</Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={submitting}
                            sx={{ borderRadius: 3, fontWeight: 700, px: 3 }}
                        >
                            {submitting ? <CircularProgress size={24} color="inherit" /> : 'Confirm'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Card>
    );
};

export default AttendanceWidget;
