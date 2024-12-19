export const formatDateRange = (dates) => {
    if (!Array.isArray(dates) || dates.length === 0) return "";
    const formattedDates = dates.map(date => new Date(date));
    let lastYear = null;
    let lastMonth = null;
    return formattedDates.map(date => {
        const year = date.getFullYear();
        const month = date.toLocaleString("default", { month: "long" });
        const day = date.getDate();
        let result = "";

        if (year !== lastYear) {
            result += `${year}, `;
            lastYear = year;
        }

        if (month !== lastMonth) {
            result += `${month} `;
            lastMonth = month;
        }

        result += day;
        return result;
    }).join(", ");
};
