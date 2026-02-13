import {
    Download as DownloadIcon,
    TableChart as TableIcon,
    Refresh as RefreshIcon,
    Assessment as AssessmentIcon,
    PieChart as PieChartIcon,
    TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import {
    getEmployeeReport,
    getDepartmentReport,
    getLeaveReport,
    exportToCSV
} from '../services/reportService';

const ReportCard = ({ title, description, icon, color, onExport, loading }) => (
    <Card sx={{
        height: '100%',
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
            transform: 'translateY(-10px)',
            boxShadow: (theme) => `0 20px 40px ${alpha(theme.palette[color].main, 0.15)}`,
            borderColor: `${color}.main`,
        }
    }}>
        <CardContent sx={{ p: 4, flexGrow: 1 }}>
            <Box
                sx={{
                    color: `${color}.main`,
                    mb: 3,
                    p: 2,
                    bgcolor: (theme) => alpha(theme.palette[color].main, 0.1),
                    borderRadius: 4,
                    width: 'fit-content'
                }}
            >
                {React.cloneElement(icon, { sx: { fontSize: 32 } })}
            </Box>
            <Typography variant="h5" fontWeight={800} gutterBottom>{title}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, mb: 4 }}>
                {description}
            </Typography>
            <Button
                variant="contained"
                fullWidth
                color={color}
                startIcon={<DownloadIcon />}
                onClick={onExport}
                disabled={loading}
                sx={{ mt: 'auto', borderRadius: 3, fontWeight: 800, py: 1.5 }}
            >
                {loading ? 'Processing...' : 'Export CSV'}
            </Button>
        </CardContent>
    </Card>
);

const Reports = () => {
    const [exporting, setExporting] = React.useState({
        employees: false,
        departments: false,
        leaves: false
    });

    const handleExport = async (type) => {
        setExporting(prev => ({ ...prev, [type]: true }));
        try {
            let data;
            let filename;
            if (type === 'employees') {
                const res = await getEmployeeReport();
                data = res.data;
                filename = 'Employee_Census_Report';
            } else if (type === 'departments') {
                const res = await getDepartmentReport();
                data = res.data;
                filename = 'Department_Distribution_Report';
            } else if (type === 'leaves') {
                const res = await getLeaveReport();
                data = res.data;
                filename = 'Leave_Lifecycle_Report';
            }
            exportToCSV(data, filename);
        } catch (err) {
            console.error('Export failed:', err);
        } finally {
            setExporting(prev => ({ ...prev, [type]: false }));
        }
    };

    return (
        <Box>
            <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h2" fontWeight={800} gutterBottom>
                        Business Insights
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Generate dynamic reports and export business-critical data for executive review with one click.
                    </Typography>
                </Box>
                <Button
                    startIcon={<RefreshIcon />}
                    sx={{ fontWeight: 800, color: 'text.secondary' }}
                >
                    Refresh Cache
                </Button>
            </Box>

            <Grid container spacing={4}>
                <Grid item xs={12} sm={6} md={4}>
                    <ReportCard
                        title="Employee Census"
                        description="Comprehensive list of all active personnel including roles, departments, and onboarding dates."
                        icon={<AssessmentIcon />}
                        color="primary"
                        onExport={() => handleExport('employees')}
                        loading={exporting.employees}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <ReportCard
                        title="Departmental Flow"
                        description="Analyze human capital distribution and headcount density across organizational units."
                        icon={<PieChartIcon />}
                        color="secondary"
                        onExport={() => handleExport('departments')}
                        loading={exporting.departments}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <ReportCard
                        title="Leave Analytics"
                        description="Visualize time-off trends and lifecycle resolutions for forecasting team availability."
                        icon={<TrendingUpIcon />}
                        color="success"
                        onExport={() => handleExport('leaves')}
                        loading={exporting.leaves}
                    />
                </Grid>
            </Grid>

            {/* Premium Placeholder for Future Features */}
            <Paper sx={{
                mt: 8,
                p: 6,
                textAlign: 'center',
                borderRadius: 5,
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.03),
                border: '1px solid',
                borderColor: 'divider'
            }}>
                <Box sx={{ mb: 3 }}>
                    <TableIcon sx={{ fontSize: 64, color: alpha('#4f46e5', 0.2) }} />
                </Box>
                <Typography variant="h5" fontWeight={800} gutterBottom>
                    Scheduled Reports
                </Typography>
                <Typography color="text.secondary" sx={{ maxWidth: 500, mx: 'auto', mb: 4 }}>
                    Automatic delivery of PDF insights to executive stakeholders via email is currently being prioritized for the next release.
                </Typography>
                <Chip label="COMING Q3 2026" sx={{ fontWeight: 900, px: 2 }} color="primary" variant="outlined" />
            </Paper>
        </Box>
    );
};

export default Reports;
