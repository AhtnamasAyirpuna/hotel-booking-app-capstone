export const isDateRangeValid = (
    checkInDate,
    checkOutDate
) => {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    return checkOut > checkIn;
}