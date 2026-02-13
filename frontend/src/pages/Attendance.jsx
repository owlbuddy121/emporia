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
    TextField,
    Grid,
    InputAdornment,
    Button,
    alpha,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import {
    Search as SearchIcon,
    CalendarMonth as CalendarIcon,
    Description as NoteIcon,
    Assignment as ReportIcon,
    AccessTime as TimeIcon
} from '@mui/icons-material';
import Loader from '../components/common/Loader';
import { loadingLottie } from '../assets/animations/loading';
import { getAllAttendance } from '../services/attendanceService';

const Attendance = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [selectedRecord, setSelectedRecord] = useState(null);

    useEffect(() => {
        fetchRecords();
    }, [dateFilter]);

    const fetchRecords = async () => {
        try {
            setLoading(true);
            const filters = {};
            if (dateFilter) filters.date = dateFilter;

            const data = await getAllAttendance(filters);
            setRecords(data.records);
        } catch (error) {
            console.error('Failed to fetch attendance records:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (record) => {
        setSelectedRecord(record);
    };

    const filteredRecords = records.filter(record =>
        record.user.name.toLowerCase().includes(search.toLowerCase()) ||
        record.user.email.toLowerCase().includes(search.toLowerCase())
    );

    const formatTime = (date) => {
        if (!date) return '-';
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getDuration = (minutes) => {
        if (!minutes) return '-';
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}h ${m}m`;
    };

    if (loading && !records.length) {
        return <Loader fullScreen message="Loading attendance records..." animationData={loadingLottie} />;
    }

    return (
        <Box>
            <Box sx={{ mb: 6 }}>
                <Typography variant="h2" fontWeight={800} gutterBottom>
                    Attendance Log
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Monitor team presence, daily scrums, and work reports.
                </Typography>
            </Box>

            <Paper sx={{ p: 2, mb: 4, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid', borderColor: 'divider' }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            placeholder="Search employee..."
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
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            type="date"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CalendarIcon sx={{ color: 'text.secondary' }} />
                                    </InputAdornment>
                                )
                            }}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                        />
                    </Grid>
                </Grid>
            </Paper>

            <TableContainer component={Paper} sx={{ border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.02)', borderRadius: 4, overflow: 'hidden' }}>
                <Table>
                    <TableHead sx={{ bgcolor: 'background.default' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 800, py: 3, pl: 4 }}>EMPLOYEE</TableCell>
                            <TableCell sx={{ fontWeight: 800, py: 3 }}>DATE</TableCell>
                            <TableCell sx={{ fontWeight: 800, py: 3 }}>SHIFT TIME</TableCell>
                            <TableCell sx={{ fontWeight: 800, py: 3 }}>DURATION</TableCell>
                            <TableCell sx={{ fontWeight: 800, py: 3 }}>STATUS</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 800, py: 3, pr: 4 }}>DETAILS</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredRecords.map((record) => (
                            <TableRow key={record._id} sx={{ '&:hover': { bgcolor: alpha('#4f46e5', 0.02) } }}>
                                <TableCell sx={{ py: 3, pl: 4 }}>
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <Avatar sx={{ bgcolor: 'primary.main', fontWeight: 700, width: 32, height: 32, fontSize: '0.8rem' }}>
                                            {record.user.name.charAt(0)}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight={800}>{record.user.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">{record.user.role?.name}</Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ py: 3 }}>
                                    <Typography variant="body2" fontWeight={600}>
                                        {new Date(record.date).toLocaleDateString()}
                                    </Typography>
                                </TableCell>
                                <TableCell sx={{ py: 3 }}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Typography variant="body2" fontWeight={600} color="text.secondary">
                                            {formatTime(record.punchIn)}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">→</Typography>
                                        <Typography variant="body2" fontWeight={600} color="text.primary">
                                            {formatTime(record.punchOut)}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ py: 3 }}>
                                    <Typography variant="body2" fontWeight={700} color="primary.main">
                                        {getDuration(record.duration)}
                                    </Typography>
                                </TableCell>
                                <TableCell sx={{ py: 3 }}>
                                    <Chip
                                        label={record.punchOut ? 'COMPLETED' : 'WORKING'}
                                        size="small"
                                        sx={{
                                            fontWeight: 800,
                                            fontSize: '0.65rem',
                                            bgcolor: record.punchOut ? alpha('#10b981', 0.1) : alpha('#3b82f6', 0.1),
                                            color: record.punchOut ? '#059669' : '#2563eb',
                                            borderRadius: 2
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="right" sx={{ py: 3, pr: 4 }}>
                                    <Button
                                        size="small"
                                        onClick={() => handleViewDetails(record)}
                                        sx={{ fontWeight: 700, borderRadius: 2 }}
                                    >
                                        View Notes
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredRecords.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} sx={{ py: 8, textAlign: 'center' }}>
                                    <Typography color="text.secondary" fontWeight={600}>No attendance records found.</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Details Dialog */}
            <Dialog
                open={!!selectedRecord}
                onClose={() => setSelectedRecord(null)}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
            >
                {selectedRecord && (
                    <>
                        <DialogTitle>
                            <Box display="flex" alignItems="center" gap={2} mb={1}>
                                <Avatar sx={{ bgcolor: 'primary.main', fontWeight: 800 }}>
                                    {selectedRecord.user.name.charAt(0)}
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" fontWeight={800}>{selectedRecord.user.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {new Date(selectedRecord.date).toLocaleDateString()} • {getDuration(selectedRecord.duration)}
                                    </Typography>
                                </Box>
                            </Box>
                        </DialogTitle>
                        <DialogContent>
                            <Grid container spacing={3} sx={{ mt: 0 }}>
                                <Grid item xs={12}>
                                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: alpha('#4f46e5', 0.05), borderColor: alpha('#4f46e5', 0.2) }}>
                                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                                            <NoteIcon fontSize="small" color="primary" />
                                            <Typography variant="subtitle2" fontWeight={800} color="primary">Morning Scrum</Typography>
                                        </Box>
                                        <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{selectedRecord.scrumNote}</Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12}>
                                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: alpha('#10b981', 0.05), borderColor: alpha('#10b981', 0.2) }}>
                                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                                            <ReportIcon fontSize="small" run color="success" />
                                            <Typography variant="subtitle2" fontWeight={800} color="success">Daily Report</Typography>
                                        </Box>
                                        <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                                            {selectedRecord.workReport || <Typography component="span" color="text.secondary" fontStyle="italic">Not submitted yet</Typography>}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions sx={{ p: 2 }}>
                            <Button onClick={() => setSelectedRecord(null)} sx={{ fontWeight: 800 }}>Close</Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
};

export default Attendance;
