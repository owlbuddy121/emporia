import api from './api';

export const getLeaves = async (params) => {
    try {
        const response = await api.get('/leaves', { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getMyLeaves = async () => {
    try {
        const response = await api.get('/leaves/my-leaves');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const applyLeave = async (leaveData) => {
    try {
        const response = await api.post('/leaves', leaveData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const approveLeave = async (id, comments) => {
    try {
        const response = await api.put(`/leaves/${id}/approve`, { comments });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const rejectLeave = async (id, comments) => {
    try {
        const response = await api.put(`/leaves/${id}/reject`, { comments });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getLeaveStats = async () => {
    try {
        const response = await api.get('/leaves/stats');
        return response.data;
    } catch (error) {
        throw error;
    }
};
