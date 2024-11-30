// Import dayjs at the top of your file
import dayjs from 'dayjs'; // if you're using dayjs
import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';
import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType } from 'docx';


// WORK SCHEDULE
// *********************************************************************************************************************
export const handleDownloadExcel = async (tableRows) => {
    // Create a new workbook and add a worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Work Schedules');

    // Add header row
    worksheet.addRow(["#", "Name", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]);

    // Add data rows
    tableRows.forEach((row, index) => {
        worksheet.addRow([
            index + 1,
            row.name,
            ...['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => {
                const { startTime, endTime, duty, dayOff } = row.schedule[day];
                if (dayOff) return "Day Off";
                if (startTime && endTime) return `${dayjs(startTime).format('hh:mm A')} - ${dayjs(endTime).format('hh:mm A')}`;
                return duty || "";
            })
        ]);
    });

    // Write the Excel file to a buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Create a Blob from the buffer and trigger the download
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'work_schedules.xlsx');
};

export const handleDownloadWord = async (tableRows) => {
    try {
        console.log("Creating Word document...");
        
        // Create a new Word document
        const doc = new Document({
            sections: [
                {
                    properties: {},
                    children: [
                        new Paragraph("Work Schedules"),
                        new Table({
                            rows: [
                                new TableRow({
                                    children: ["#", "Name", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(text => (
                                        new TableCell({
                                            width: { size: 1000, type: WidthType.DXA },
                                            children: [new Paragraph(text)],
                                        })
                                    ))
                                }),
                                ...tableRows.map((row, index) => (
                                    new TableRow({
                                        children: [
                                            new TableCell({ children: [new Paragraph((index + 1).toString())] }),
                                            new TableCell({ children: [new Paragraph(row.name)] }),
                                            ...['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => {
                                                const { startTime, endTime, duty, dayOff } = row.schedule[day];
                                                let cellContent = "";
                                                if (dayOff) cellContent = "Day Off";
                                                else if (startTime && endTime) cellContent = `${dayjs(startTime).format('hh:mm A')} - ${dayjs(endTime).format('hh:mm A')}`;
                                                else if (duty) cellContent = duty;
                                                return new TableCell({ children: [new Paragraph(cellContent)] });
                                            })
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
        saveAs(blob, 'work_schedules.docx');
        console.log("Word document downloaded.");

    } catch (error) {
        console.error("Error creating or downloading the Word document:", error);
    }
};

