import { handleDownloadAttendanceExcel, handleDownloadAttendanceWord } from './attendanceUtils'; // Import the attendance logic
import { handleDownloadExcel, handleDownloadWord } from './scheduleUtils'; // Import the schedule logic

export const handleDownloadChoice = async (type, context, tableRows) => {
    if (context === 'attendance') {
        if (type === 'excel') {
            await handleDownloadAttendanceExcel(tableRows); // Await the download function
        } else if (type === 'word') {
            await handleDownloadAttendanceWord(tableRows); // Await the download function
        }
    } else if (context === 'schedule') {
        if (type === 'excel') {
            await handleDownloadExcel(tableRows);
        } else if (type === 'word') {
            await handleDownloadWord(tableRows);
        }
    }
};

