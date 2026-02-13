import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import TeamMembers from './pages/TeamMembers';
import LeaveManagement from './pages/LeaveManagement';
import Reports from './pages/Reports';
import Departments from './pages/Departments';
import Employees from './pages/Employees';
import DepartmentDetails from './pages/DepartmentDetails';
import Roles from './pages/Roles';
import AuditLogs from './pages/AuditLogs';
import Settings from './pages/Settings';
import Attendance from './pages/Attendance';
import AttendanceAnalytics from './pages/AttendanceAnalytics';

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                <Route
                    path="/*"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <Routes>
                                    <Route path="dashboard" element={<Dashboard />} />
                                    <Route path="team-members" element={<TeamMembers />} />
                                    <Route path="leave-management" element={<LeaveManagement />} />
                                    <Route path="reports" element={<Reports />} />
                                    <Route path="employees" element={<Employees />} />
                                    <Route path="departments" element={<Departments />} />
                                    <Route path="departments/:id" element={<DepartmentDetails />} />
                                    <Route path="roles" element={<Roles />} />
                                    <Route path="audit-logs" element={<AuditLogs />} />
                                    <Route path="attendance" element={<Attendance />} />
                                    <Route path="attendance/analytics" element={<AttendanceAnalytics />} />
                                    <Route path="settings" element={<Settings />} />
                                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                                </Routes>
                            </Layout>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </AuthProvider>
    );
}

export default App;
