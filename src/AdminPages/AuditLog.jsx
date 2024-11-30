import { useState, useEffect, useMemo } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import moment from 'moment';
import api from '../api';
import { applyTheme } from '../components/themeHandlers';

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
        'System',
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

                // Simulate a 2-3 second loading delay
                setTimeout(() => {
                    setLoading(false);
                }, 1000); // 2000 milliseconds = 2 seconds
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
        if (loading) return (
            <div className="flex justify-center items-center min-h-[650px]">
                <div className="spinner-border animate-spin inline-block w-7 h-7 border-4 rounded-full border-t-[#70b8d3] border-gray-300"></div>
            </div>
        );
        if (error) return <p className="text-red-600 flex justify-center items-center ">Error: {error}</p>;
        if (filteredLogs.length === 0) return <p className="dark:text-[#e7e6e6]">No logs match the filters.</p>;

        return (
            <div className='dark:bg-[#374151] p-6 bg-gray-50 shadow-lg rounded-lg'>
                <table className="min-w-full table-auto border-collapse">
                    <thead>
                        <tr className="border-b">
                            <th className="px-4 py-2 text-left text-gray-700 dark:text-[#e7e6e6]">Username</th>
                            <th className="px-4 py-2 text-left text-gray-700 dark:text-[#e7e6e6]">Action</th>
                            <th className="px-4 py-2 text-left text-gray-700 dark:text-[#e7e6e6]">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLogs.map((log) => (
                            <tr key={log.id} className="border-b">
                                <td className="px-4 py-2 text-gray-800 dark:text-[#e7e6e6]">{log.username}</td>
                                <td className="px-4 py-2 text-gray-800 dark:text-[#e7e6e6]">{log.action}</td>
                                <td className="px-4 py-2 text-gray-600 dark:text-[#e7e6e6]">
                                    {moment(log.timestamp).format('YYYY-MM-DD h:mm A')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
           
        );
    };
    
    useEffect(() => {
        applyTheme();
    }, []);

    return (
        <div className="flex bg-gray-100 dark:bg-[#111827]">
            <AdminSidebar />

            {/* Main Content */}
            <div className="w-full p-6">
                <h1 className="text-4xl font-bold mb-6 text-gray-800 dark:text-[#e7e6e6]">AUDIT LOG</h1>

                {/* Filter Section */}
                <div className="flex justify-between items-center mb-6 space-x-4">
                    {/* Search Input */}
                    <div className="relative w-1/3">
                        {/* Search Icon */}
                        <div className="absolute inset-y-0 left-0 flex items-center ps-3 pointer-events-none">
                            <svg
                                className="w-5 h-5 text-gray-500"
                                aria-hidden="true"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </div>
                        {/* Search Input */}
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 border border-gray-300 rounded-lg p-2 w-full dark:bg-[#111827] dark:text-[#e7e6e6] dark:border-gray-400 placeholder:text-gray-200"
                        />
                    </div>
                    <div className="flex justify-end w-full gap-3">
                        {/* Filter By Dropdown */}
                        <select
                            value={filterBy}
                            onChange={(e) => setFilterBy(e.target.value)}
                            className="px-4 py-2 rounded-md bg-white border dark:bg-[#111827] dark:text-[#e7e6e6] dark:border-gray-400"
                        >
                            <option value="all">All</option>
                            <option value="username">Username</option>
                            <option value="action">Action</option>
                        </select>
                        {/* Date From */}
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            className="px-4 py-2 rounded-md bg-white border dark:bg-[#111827] dark:text-[#e7e6e6] dark:border-gray-400"
                        />
                        <input
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            className="px-4 py-2 rounded-md bg-white border dark:bg-[#111827] dark:text-[#e7e6e6] dark:border-gray-400"
                        />
                    </div>
                </div>

                {/* Category Tabs */}
                <div className="flex space-x-6 mb-4 border-b pb-2">
                    {categories.map((category) => {
                        // Determine if the current category is selected
                        const isSelected = selectedCategory === category;
                        const activeColor = 'text-[#70b8d3] border-[#70b8d3] dark:text-[#70b8d3] dark:border-[#70b8d3]'; // Consistent active color

                        return (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 ${isSelected ? `${activeColor} font-semibold border-b-2` : 'text-gray-700 hover:text-[#70b8d3] dark:text-[#e7e6e6] dark:hover:text-[#70b8d3]'}`}
                            >
                                {category}
                            </button>
                        );
                    })}
                </div>

                {/* Logs List */}
                <div>{renderLogs()}</div>
            </div>
        </div>
    );
};

export default AuditLog;
