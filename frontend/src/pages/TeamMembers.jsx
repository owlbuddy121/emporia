import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Avatar, Button, alpha, CircularProgress } from '@mui/material';
import { getEmployees } from '../services/employeeService';
import { useAuth } from '../context/AuthContext';

const TeamMembers = () => {
    const { user } = useAuth();
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                setLoading(true);
                // Filter employees by the same department as the manager
                const data = await getEmployees({ department: user?.department?._id });
                setTeam(data.employees || []);
            } catch (error) {
                console.error('Failed to fetch team members:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user?.department?._id) {
            fetchTeam();
        } else {
            setLoading(false);
        }
    }, [user]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <Box>
                    <Typography variant="h2" fontWeight={800} gutterBottom>
                        My Team
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Manage direct reports in the {user?.department?.name || 'Department'} department.
                    </Typography>
                </Box>
            </Box>

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
                        {team.map((member) => (
                            <TableRow key={member._id} sx={{ '&:hover': { bgcolor: alpha('#4f46e5', 0.02) } }}>
                                <TableCell sx={{ py: 3, pl: 4 }}>
                                    <Box display="flex" alignItems="center" gap={3}>
                                        <Avatar
                                            src={member.profilePicture}
                                            sx={{
                                                bgcolor: member.status === 'active' ? 'primary.main' : 'grey.400',
                                                width: 48,
                                                height: 48,
                                                fontWeight: 800,
                                                fontSize: '1rem',
                                                boxShadow: member.status === 'active' ? '0 4px 12px rgba(79, 70, 229, 0.2)' : 'none'
                                            }}
                                        >
                                            {member.name.charAt(0)}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight={800}>{member.name}</Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{member.email.toUpperCase()}</Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ py: 3 }}>
                                    <Typography variant="body2" fontWeight={600}>{member.role?.name}</Typography>
                                </TableCell>
                                <TableCell sx={{ py: 3 }}>
                                    <Chip
                                        label={member.status?.toUpperCase()}
                                        sx={{
                                            fontWeight: 800,
                                            borderRadius: 2,
                                            height: 24,
                                            fontSize: '0.65rem',
                                            bgcolor: member.status === 'active' ? alpha('#10b981', 0.1) : alpha('#64748b', 0.1),
                                            color: member.status === 'active' ? '#059669' : '#475569',
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="right" sx={{ py: 3, pr: 4 }}>
                                    <Button variant="text" color="primary" sx={{ fontWeight: 800 }}>View Profile</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {team.length === 0 && (
                    <Box sx={{ p: 6, textAlign: 'center' }}>
                        <Typography color="text.secondary" fontWeight={600}>No team members found for your department.</Typography>
                    </Box>
                )}
            </TableContainer>
        </Box>
    );
};

export default TeamMembers;
