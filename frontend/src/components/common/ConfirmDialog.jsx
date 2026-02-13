import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Typography,
    Box,
    alpha
} from '@mui/material';
import {
    Warning as WarningIcon,
    Logout as LogoutIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';

const ConfirmDialog = ({
    open,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'danger', // 'danger', 'info', 'warning'
    icon
}) => {

    const getIcon = () => {
        if (icon) return icon;
        switch (type) {
            case 'danger':
                return <DeleteIcon sx={{ fontSize: 40 }} />;
            case 'warning':
                return <WarningIcon sx={{ fontSize: 40 }} />;
            case 'logout':
                return <LogoutIcon sx={{ fontSize: 40 }} />;
            default:
                return <WarningIcon sx={{ fontSize: 40 }} />;
        }
    };

    const getColor = (theme) => {
        switch (type) {
            case 'danger':
            case 'logout':
                return theme.palette.error.main;
            case 'warning':
                return theme.palette.warning.main;
            case 'info':
                return theme.palette.primary.main;
            default:
                return theme.palette.primary.main;
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: { borderRadius: 5, p: 2, maxWidth: 400, width: '100%' }
            }}
        >
            <DialogContent sx={{ textAlign: 'center', pb: 0 }}>
                <Box
                    sx={{
                        display: 'inline-flex',
                        p: 2,
                        borderRadius: 4,
                        bgcolor: (theme) => alpha(getColor(theme), 0.1),
                        color: (theme) => getColor(theme),
                        mb: 3
                    }}
                >
                    {getIcon()}
                </Box>
                <Typography variant="h4" fontWeight={800} gutterBottom>
                    {title}
                </Typography>
                <DialogContentText sx={{ color: 'text.secondary', fontWeight: 500, px: 2 }}>
                    {description}
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ p: 4, justifyContent: 'center', gap: 2 }}>
                <Button
                    onClick={onClose}
                    sx={{
                        fontWeight: 700,
                        color: 'text.secondary',
                        px: 3
                    }}
                >
                    {cancelText}
                </Button>
                <Button
                    variant="contained"
                    onClick={onConfirm}
                    fullWidth
                    sx={{
                        borderRadius: 3,
                        py: 1.5,
                        fontWeight: 800,
                        bgcolor: (theme) => getColor(theme),
                        '&:hover': {
                            bgcolor: (theme) => alpha(getColor(theme), 0.8),
                        },
                        boxShadow: (theme) => `0 8px 16px ${alpha(getColor(theme), 0.2)}`
                    }}
                >
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;
