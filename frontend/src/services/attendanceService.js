import api from './api';

export const getAttendanceStatus = async () => {
    try {
        const response = await api.get('/attendance/status');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const punchIn = async (scrumNote) => {
    try {
        const response = await api.post('/attendance/punch-in', { scrumNote });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const punchOut = async (workReport) => {
    try {
        const response = await api.post('/attendance/punch-out', { workReport });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAllAttendance = async (filters = {}) => {
    try {
        const response = await api.get('/attendance', { params: filters });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAttendanceStats = async (filters = {}) => {
    try {
        const response = await api.get('/attendance/stats', { params: filters });
        return response.data;
    } catch (error) {
        throw error;
    }
};
