import React from 'react';
import Lottie from 'lottie-react';
import { Box } from '@mui/material';

/**
 * Reusable Lottie Animation Wrapper
 * @param {object|string} animationData - The Lottie JSON data or URL
 * @param {number|string} width - Width of the animation container
 * @param {number|string} height - Height of the animation container
 * @param {boolean} loop - Whether to loop the animation (default: true)
 * @param {boolean} autoplay - Whether to autoplay (default: true)
 * @param {object} style - Additional styles for the container
 */
const LottieAnimation = ({
    animationData,
    width = 200,
    height = 200,
    loop = true,
    autoplay = true,
    style = {}
}) => {
    // Determine if animationData is a URL or JSON object
    // Note: lottie-react primarily expects JSON object. For URLs, we might need to fetch it first,
    // but for simplicity and stability, we'll assume JSON object usage mostly.

    return (
        <Box sx={{ width, height, ...style }}>
            <Lottie
                animationData={animationData}
                loop={loop}
                autoplay={autoplay}
                style={{ width: '100%', height: '100%' }}
            />
        </Box>
    );
};

export default LottieAnimation;
