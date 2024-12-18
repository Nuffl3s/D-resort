// reservationUtils.js

export const isDateFullyReserved = (unit, selectedDate, reservedDates) => {
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const formattedDate = formatDate(selectedDate);

    // Extract all reserved times for the given unit and date
    const reservedTimes = reservedDates
        .filter((res) => res.unit_name === unit.name && res.date_of_reservation === formattedDate)
        .flatMap((res) => res.time_of_use || []);

    // Extract all available times for the unit
    const allTimes = Object.keys(unit.custom_prices || {});

    // Return true if all times are reserved
    return allTimes.every((time) => reservedTimes.includes(time));
};
