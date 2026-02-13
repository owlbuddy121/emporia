import api from './api';

export const getEmployeeReport = async () => {
    try {
        const response = await api.get('/reports/employees');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getDepartmentReport = async () => {
    try {
        const response = await api.get('/reports/departments');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getLeaveReport = async () => {
    try {
        const response = await api.get('/reports/leaves');
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Utility to export to CSV
export const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvRows = [
        headers.join(','),
        ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}_${new Date().getTime()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};
