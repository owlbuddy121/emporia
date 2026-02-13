require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employees');
const departmentRoutes = require('./routes/departments');
const roleRoutes = require('./routes/roles');
const leaveRoutes = require('./routes/leaves');
const auditRoutes = require('./routes/audit');
const dashboardRoutes = require('./routes/dashboard');
const reportRoutes = require('./routes/reports');
const seedDatabase = require('./seeds/index');

// Initialize express app
const app = express();

// Connect to database and seed
const setupDB = async () => {
    await connectDB();

    // Auto-seed in-memory or empty development database
    if (process.env.MONGODB_URI === 'in-memory' || process.env.NODE_ENV === 'development') {
        try {
            const User = require('./models/User');
            const userCount = await User.countDocuments();
            if (userCount === 0) {
                console.log('🔄 Database empty, auto-seeding...');
                await seedDatabase(false);
            }
        } catch (error) {
            console.error('Auto-seeding failed:', error);
        }
    }
};

setupDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/audit-logs', auditRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Emporia API is running',
        timestamp: new Date().toISOString(),
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);

    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Emporia server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);
});

module.exports = app;
