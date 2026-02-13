import React from 'react';
import { Box, Typography, alpha } from '@mui/material';
import LottieAnimation from './LottieAnimation';

// Default sleek loader JSON (simple clean scaling circles)
// Since we can't reliably fetch external JSONs without risk of breakage, 
// a high-quality CSS fallback that LOOKS like Lottie is safer for the default, 
// but we allow passing custom Lottie JSON via props.
const DefaultLoader = () => (
    <Box sx={{ display: 'flex', gap: 1 }}>
        {[0, 150, 300].map((delay) => (
            <Box
                key={delay}
                sx={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    animation: 'pulse 1.4s ease-in-out infinite both',
                    animationDelay: `${delay}ms`,
                    '@keyframes pulse': {
                        '0%, 80%, 100%': { transform: 'scale(0)', opacity: 0.5 },
                        '40%': { transform: 'scale(1)', opacity: 1 }
                    }
                }}
            />
        ))}
    </Box>
);

const Loader = ({
    message = "Loading...",
    animationData = null,
    fullScreen = false,
    size = 120
}) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: fullScreen ? '100vh' : 400,
                width: '100%',
                bgcolor: fullScreen ? 'background.default' : 'transparent',
                gap: 3
            }}
        >
            {animationData ? (
                <LottieAnimation animationData={animationData} width={size} height={size} />
            ) : (
                <DefaultLoader />
            )}

            <Typography
                variant="h6"
                color="text.secondary"
                fontWeight={600}
                sx={{
                    animation: 'fadeIn 0.5s ease-in',
                    '@keyframes fadeIn': { from: { opacity: 0 }, to: { opacity: 1 } }
                }}
            >
                {message}
            </Typography>
        </Box>
    );
};

export default Loader;
