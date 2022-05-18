export const handleFilter = (data, header, param) => {
    if ((!data, !header, !param)) return false;

    const filteredData = data.filter((singleData) => singleData[header] === param);
    return filteredData;
};

export const handleReverseData = (data) => {
    const reversedData = data.reverse();
    return reversedData;
};

export const handleOrderSort = () => {
    // This handles sorting in descending or ascending order
};
