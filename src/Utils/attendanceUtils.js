import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';
import { Document, Packer, Paragraph, Table, TableCell, TableRow } from 'docx';


// ATTENDANCE
// *************************************************************************************************
export const handleDownloadAttendanceExcel = async (tableRows) => {
    // Create a new workbook and add a worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Attendance');

    // Add header row
    worksheet.addRow(["#", "ID", "Name", "Date", "Time In", "Time Out"]);

    // Add data rows
    tableRows.forEach((row, index) => {
        worksheet.addRow([
            index + 1,
            row.user, 
            row.name,
            row.date,             // Assuming 'date' is part of the data
            row.time_in,           // Assuming 'timeIn' is part of the data
            row.time_out           // Assuming 'timeOut' is part of the data
        ]);
    });

    // Write the Excel file to a buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Create a Blob from the buffer and trigger the download
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'attendance.xlsx');
};

export const handleDownloadAttendanceWord = async (tableRows) => {
    try {
        console.log("Creating Word document...");

        // Create a new Word document for attendance
        const doc = new Document({
            sections: [
                {
                    properties: {},
                    children: [
                        new Paragraph("Attendance Records"),
                        new Table({
                            rows: [
                                new TableRow({
                                    children: [
                                        new TableCell({ children: [new Paragraph("#")] }),
                                        new TableCell({ children: [new Paragraph("Employee ID")] }),
                                        new TableCell({ children: [new Paragraph("Name")] }),
                                        new TableCell({ children: [new Paragraph("Date")] }),
                                        new TableCell({ children: [new Paragraph("Time In")] }),
                                        new TableCell({ children: [new Paragraph("Time Out")] }),
                                    ],
                                }),
                                ...tableRows.map((row, index) => (
                                    new TableRow({
                                        children: [
                                            new TableCell({ children: [new Paragraph((index + 1).toString())] }),
                                            new TableCell({ children: [new Paragraph(row.user)] }),
                                            new TableCell({ children: [new Paragraph(row.name)] }),
                                            new TableCell({ children: [new Paragraph(row.date)] }),
                                            new TableCell({ children: [new Paragraph(row.time_in)] }),
                                            new TableCell({ children: [new Paragraph(row.time_out)] }),
                                        ]
                                    })
                                ))
                            ],
                        })
                    ],
                },
            ],
        });

        // Pack the document into a blob
        const blob = await Packer.toBlob(doc);
        console.log("Word document packed into blob.");

        // Trigger the download
        saveAs(blob, 'attendance.docx');
        console.log("Word document downloaded.");

    } catch (error) {
        console.error("Error creating or downloading the Word document:", error);
    }
};