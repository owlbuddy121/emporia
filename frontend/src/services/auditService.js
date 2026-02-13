import api from './api';

export const getAuditLogs = async (params) => {
    try {
        const response = await api.get('/audit-logs', { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAuditStats = async () => {
    try {
        const response = await api.get('/audit-logs/stats');
        return response.data;
    } catch (error) {
        throw error;
    }
};
