import React, { useState, useEffect, useMemo } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import moment from 'moment';
import api from '../api';

const AuditLog = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('All');

    const [filterBy, setFilterBy] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    
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

    const filteredLogs = useMemo(() => {
        return logs
        .filter((log) => {
            // Apply the "All" filter or filter by "username" or "action"
            if (filterBy === 'all') {
                return true;
            } else if (filterBy === 'username') {
                return log.username.toLowerCase().includes(searchQuery.toLowerCase());
            } else if (filterBy === 'action') {
                return log.action.toLowerCase().includes(searchQuery.toLowerCase());
            } else {
                return false;
            }
        })
        .filter((log) => {
            // Apply the date filter
            if (dateFrom && dateTo) {
                const logDate = moment(log.timestamp).format('YYYY-MM-DD');
                return moment(logDate).isBetween(dateFrom, dateTo, undefined, '[]');
            } else if (dateFrom) {
                const logDate = moment(log.timestamp).format('YYYY-MM-DD');
                return moment(logDate).isSameOrAfter(dateFrom);
            } else if (dateTo) {
                const logDate = moment(log.timestamp).format('YYYY-MM-DD');
                return moment(logDate).isSameOrBefore(dateTo);
            } else {
                return true;
            }
        });
    }, [logs, searchQuery, filterBy, dateFrom, dateTo]);

    const renderLogs = () => {
        if (loading) return <p>Loading...</p>;
        if (error) return <p className="text-red-600">Error: {error}</p>;
        if (filteredLogs.length === 0) return <p>No logs match the filters.</p>;
    
        return (
            <ul>
            {filteredLogs.map((log) => (
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
            
             {/* Filter */}
            <div className="flex justify-between items-center mb-6 space-x-4">
                {/* Filter By Dropdown */}
                <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                    className="px-4 py-2 rounded bg-gray-200 flex-shrink-0"
                    >
                    <option value="all">All</option>
                    <option value="username">Username</option>
                    <option value="action">Action</option>
                </select>

                {/* Search Input */}
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="px-4 py-2 rounded bg-gray-200 w-full"
                />

                {/* Date From */}
                <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="px-4 py-2 rounded bg-gray-200 flex-shrink-0"
                />
                <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="px-4 py-2 rounded bg-gray-200 flex-shrink-0"
                />
                </div>


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
        </div>~
        </div>
    );
    };

export default AuditLog;
