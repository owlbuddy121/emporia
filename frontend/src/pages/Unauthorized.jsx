import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Block as BlockIcon } from '@mui/icons-material';

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                }}
            >
                <BlockIcon sx={{ fontSize: 100, color: 'error.main', mb: 2 }} />
                <Typography variant="h4" gutterBottom>
                    Access Denied
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                    You don't have permission to access this page.
                </Typography>
                <Button variant="contained" onClick={() => navigate('/dashboard')}>
                    Go to Dashboard
                </Button>
            </Box>
        </Container>
    );
};

export default Unauthorized;
