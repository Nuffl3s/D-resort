import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faDownload, faTrash } from '@fortawesome/free-solid-svg-icons';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const Logs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const logsPerPage = 10;

    const [searchQuery, setSearchQuery] = useState('');
    const [filterBy, setFilterBy] = useState('all');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:8000/logs/');
                const data = response.data;
                setLogs(data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    useEffect(() => {
        const role = localStorage.getItem('role');
        setUserRole(role);
    }, []);

    const handleClearLogs = async () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete('http://localhost:8000/logs/')
                    .then(() => {
                        setLogs([]);
                        Swal.fire('Deleted!', 'Logs have been deleted.', 'success');
                    })
                    .catch((error) => {
                        setError(error.message);
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Could not delete logs.',
                        });
                    });
            }
        });
    };

    const handleExportLogs = () => {
        const data = logs.map((log) => ({
            username: log.username,
            action: log.action,
            timestamp: moment(log.timestamp).format('MMMM D, YYYY h:mm:ss A'),
        }));

        // Create a new workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Logs');

        // Define the columns
        worksheet.columns = [
            { header: 'Username', key: 'username', width: 25 },
            { header: 'Action', key: 'action', width: 35 },
            { header: 'Timestamp', key: 'timestamp', width: 45 },
        ];

        // Add the data
        data.forEach(log => worksheet.addRow(log)); // Add rows properly

        // Apply styles to the header and increase its height
        worksheet.getRow(1).height = 30;  // Set header row height to 25 (adjust as needed)
        worksheet.getRow(1).eachCell(cell => {
            cell.font = { bold: true };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFFF0' },  // Light fill color
            };
        });


        // Apply styles to data rows
        worksheet.eachRow((row, rowNumber) => {
            row.eachCell((cell) => {
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
            });

            // Alternate row color
            if (rowNumber % 2 === 0) {
                row.eachCell((cell) => {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFEEEEEE' }, // Light grey for even rows
                    };
                });
            }
        });

        // Save the workbook to file
        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, 'logs.xlsx');
        });
    };

    const indexOfLastLog = currentPage * logsPerPage;
    const indexOfFirstLog = indexOfLastLog - logsPerPage;
    const filteredLogs = logs.filter((log) => {
        if (filterBy === 'all') {
            return true;
        } else if (filterBy === 'username') {
            return log.username.toLowerCase().includes(searchQuery.toLowerCase());
        } else if (filterBy === 'action') {
            return log.action.toLowerCase().includes(searchQuery.toLowerCase());
        } else {
            return false;
        }
    }).filter((log) => {
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
    const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
    const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

    const handlePreviousPage = () => setCurrentPage(currentPage - 1);
    const handleNextPage = () => setCurrentPage(currentPage + 1);

    return (
        <div className="container mx-auto">
            <div className="flex justify-between mb-2">
                <h2 className="text-3xl font-bold text-gray-800">Audit Logs</h2>
                <div className="flex justify-between">
                    <button
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded flex justify-center items-center"
                        title="Export Logs"
                        onClick={handleExportLogs}
                    >
                        <FontAwesomeIcon icon={faDownload} className="text-sm" />
                    </button>
                    {userRole !== 'admin' && (
                        <button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded flex justify-center items-center ml-4"
                            title="Clear Logs"
                            onClick={handleClearLogs}
                        >
                            <FontAwesomeIcon icon={faTrash} className="text-sm" />
                        </button>
                    )}
                </div>
            </div>
            <div className="flex justify-between mb-4">
                <div className="w-1/3">
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search logs..."
                        className="w-full py-2 pl-10 text-sm text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                    />
                </div>
                <div className="w-1/6 ml-4">
                    <select
                        value={filterBy}
                        onChange={(e) => setFilterBy(e.target.value)}
                        className="w-full py-2 pl-10 text-sm text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                    >
                        <option value="all">All</option>
                        <option value="username">Username</option>
                        <option value="action">Action</option>
                    </select>
                </div>
                <div className="w-1/3 ml-4">
                    <div className="flex justify-between">
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            placeholder="Date From"
                            className="w-1/2 py-2 pl-10 text-sm text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 mr-4"
                        />
                        <input
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            placeholder="Date To"
                            className="w-1/2 py-2 pl-10 text-sm text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                        />
                    </div>
                </div>
            </div>
            {loading ? (
                <p className="text-lg text-gray-600">Loading...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr className="bg-blue-900">
                                <th className="px-6 py-2 text-sm font-semibold text-white uppercase tracking-wider text-center rounded-tl-lg">
                                    Username
                                </th>
                                <th className="px-6 py-2 text-sm font-semibold text-white uppercase tracking-wider text-center">
                                    Action
                                </th>
                                <th className="px-6 py-2 text-sm font-semibold text-white uppercase tracking-wider text-center rounded-tr-lg">
                                    Timestamp
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentLogs.map((log, index) => (
                                <tr key={index} className="hover:bg-gray-100">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                                        {log.username}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                                        {log.action}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                                        {moment(log.timestamp).format('MMMM D, YYYY h:mm:ss A')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="flex justify-between items-center mt-2">
                <button
                    className={`p-2 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                >
                    <FontAwesomeIcon icon={faChevronLeft} className="text-xl" />
                </button>
                <span className="font-semibold text-gray-700">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    className={`p-2 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                >
                    <FontAwesomeIcon icon={faChevronRight} className="text-xl" />
                </button>
            </div>

            {error && <p className="text-red-600 mt-4">{error}</p>}
        </div>
    );
};

export default Logs;