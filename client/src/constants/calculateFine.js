const calculateFine = (expected, actual) => {
    if (!actual) return "-";

    const expectedDate = new Date(expected);
    const actualDate = new Date(actual);

    expectedDate.setHours(0, 0, 0, 0);
    actualDate.setHours(0, 0, 0, 0);

    if (actualDate <= expectedDate) return "-";

    const timeDiff = actualDate.getTime() - expectedDate.getTime();

    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    const totalFine = diffDays * 5000;

    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(totalFine);
};

export default calculateFine;