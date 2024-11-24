import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import moment from 'moment';
import api from '../api';

const AuditLog = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = [
        'All',
        'Employee Registration',
        'Attendance',
        'Payroll',
        'Report',
        'Inventory',
        'Booking',
    ];

    // Fetch logs based on selected category
    useEffect(() => {
        const fetchLogs = async () => {
        try {
            setLoading(true);
            const endpoint =
            selectedCategory === 'All'
                ? 'http://localhost:8000/api/logs/'
                : `http://localhost:8000/api/logs/?category=${encodeURIComponent(
                    selectedCategory
                )}`;
            const response = await api.get(endpoint);
            setLogs(response.data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
        };

        fetchLogs();
    }, [selectedCategory]);

    const renderLogs = () => {
        if (loading) return <p>Loading...</p>;
        if (error) return <p className="text-red-600">Error: {error}</p>;
        if (logs.length === 0) return <p>No logs available for this category.</p>;

        return (
        <ul>
            {logs.map((log) => (
            <li key={log.id} className="mb-4">
                <strong>{log.username}</strong>: {log.action}{' '}
                <span className="text-gray-600">
                ({moment(log.timestamp).format('YYYY-MM-DD h:mm A')})
                </span>
            </li>
            ))}
        </ul>
        );
    };

    return (
        <div className="flex">
        <AdminSidebar />

        {/* Main Content */}
        <div className="w-3/4 p-6">
            <h1 className="text-2xl font-bold mb-4">Audit Log</h1>

            {/* Category Tabs */}
            <div className="mb-6">
                {categories.map((category) => (
                    <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 mr-2 rounded ${
                        selectedCategory === category
                        ? 'bg-gradient-to-r from-[#1089D3] to-[#12B1D1] text-white' // Active button gradient
                        : 'bg-gray-200 text-gray-700' // Inactive button
                    } hover:bg-gradient-to-r hover:from-[#12B1D1] hover:to-[#1089D3] hover:text-white`} // Hover effect gradient
                    >
                    {category}
                    </button>
                ))}
                </div>

            {/* Logs List */}
            <div>{renderLogs()}</div>
        </div>
        </div>
    );
    };

export default AuditLog;
