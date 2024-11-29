import { handleDownloadAttendanceExcel, handleDownloadAttendanceWord } from './attendanceUtils'; // Import the attendance logic
import { handleDownloadExcel, handleDownloadWord } from './scheduleUtils'; // Import the schedule logic

export const handleDownloadChoice = async (type, context, tableRows) => {
    if (context === 'attendance') {
        if (type === 'excel') {
            handleDownloadAttendanceExcel(tableRows); // For attendance Excel download
        } else if (type === 'word') {
            handleDownloadAttendanceWord(tableRows); // For attendance Word download
        }
    } else if (context === 'schedule') {
        if (type === 'excel') {
            handleDownloadExcel(tableRows); // For schedule Excel download
        } else if (type === 'word') {
            handleDownloadWord(tableRows); // For schedule Word download
        }
    }
};
