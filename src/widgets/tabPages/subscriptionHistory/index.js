import React, { useCallback, useEffect, useState } from 'react';
import { LoadingIcon } from '../../../assets';
import axios from 'axios';
import { Table } from '../../../components/table';
import './subscriptionHistory.css';
import { BASE_URL } from '../../../config';
import { ciEncrypt, decryptAndDecode } from '../../../config/utils/red';

const filterItems = {
    filterItem: ['Fund Method'],
    filterState: {
        'Fund Method': ['Gift', 'Individual']
    }
};

const SubscriptionHistory = () => {
    const [modalState, setModal] = useState(false);
    const [data, setData] = useState({});
    const [responseData, setResponseData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [IsEmptyTable, setIsEmptyTable] = useState(false);
    const [sortValues, setSortValues] = useState({});
    const [display, setDisplay] = useState([]);

    const [searchParam] = useState(['credits', 'subscriptionPlan', 'sid', 'credits']);
    const [csv, setcsv] = useState('');

    let ciDT = ciEncrypt.getItem('ciDT');

    const handleKey = useCallback(async () => {
        let ciDD = await ciEncrypt.getItem('ciDD');
        let userData = await decryptAndDecode(ciDD);
        setData(userData);
    }, [ciEncrypt]);

    useEffect(() => {
        handleKey();
    }, [handleKey]);

    useEffect(() => {
        axios({
            method: 'get',
            url: `${BASE_URL}subscriptionHistory/transactions?userID=${data?.userID}`,
            headers: {
                Authorization: `Bearer ${ciDT}`
            }
        })
            .then((response) => {
                setResponseData(() => response.data.data);
                setDisplay(response.data.data);
                setLoading(false);
            })
            .catch(() => {
                setIsEmptyTable(true);
            });
    }, [ciDT, data?.userID]);

    const convertToCsv = useCallback((objArray) => {
        // JSON to CSV Converter
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        var str = '';

        for (var i = 0; i < array.length; i++) {
            var line = '';
            for (var index in array[i]) {
                if (line !== '') line += ',';

                line += array[i][index];
            }
            str += line + '\r\n';
        }

        const csvBlob = new Blob([str], { type: 'text/csv;charset=utf-8;' });
        let url;

        if (navigator.msSaveBlob) {
            // IE 10+
            navigator.msSaveBlob(csvBlob, 'data');
        } else {
            url = URL.createObjectURL(csvBlob);
        }
        setcsv(url);
    }, []);

    useEffect(() => {
        convertToCsv(JSON.stringify(responseData));
    }, [convertToCsv, responseData]);

    // Filter Data
    const filterData = useCallback(
        (searchFilter) => {
            if (searchFilter === undefined || searchFilter === '' || searchFilter === null) {
                return;
            }

            if (searchFilter === 'Highest') {
                const highestVal = Math.max.apply(
                    Math,
                    responseData.map(function (o) {
                        return o.credits;
                    })
                );
                const highest = responseData.filter((item) => item.credits === highestVal);
                setDisplay(highest);
                if (highest.length === 0) {
                    setIsEmptyTable(true);
                } else {
                    setIsEmptyTable(false);
                }
            } else if (searchFilter === 'Lowest') {
                const lowestVal = Math.min.apply(
                    Math,
                    responseData.map(function (o) {
                        return o.credits;
                    })
                );
                const lowest = responseData.filter((item) => item.credits === lowestVal);
                setDisplay(lowest);
                if (lowest.length === 0) {
                    setIsEmptyTable(true);
                } else {
                    setIsEmptyTable(false);
                }
            } else {
                const filtered = responseData.filter((item) =>
                    searchParam.some((newItem) => {
                        return (
                            item[newItem]
                                .toString()
                                .toLowerCase()
                                .indexOf(searchFilter.toLowerCase()) > -1
                        );
                    })
                );
                setDisplay(filtered);
                if (filtered.length === 0) {
                    setIsEmptyTable(true);
                } else {
                    setIsEmptyTable(false);
                }
            }
        },
        [responseData, searchParam]
    );

    useEffect(() => {
        if (responseData.length === 0) {
            setIsEmptyTable(true);
        } else {
            setIsEmptyTable(false);
        }
    }, [responseData]);

    const handleSort = useCallback(
        (sortValues) => {
            if (sortValues.headerItem === 'Timestamp') {
                let reversedData = responseData.reverse();
                setDisplay(reversedData);
            } else if (sortValues.headerItem === 'Credits') {
                let creditState = sortValues.sortState ? 'Highest' : 'Lowest';
                filterData(creditState);
            }
        },
        [responseData, filterData]
    );

    useEffect(() => {
        handleSort(sortValues);
    }, [sortValues, handleSort]);

    return (
        <>
            <h3 className="tab_page_title mx-auto">Transaction History</h3>
            <p className="mx-auto tab_page_subtitle mb-5">
                The table below shows records of all previous credits you have bought or have
                recieved.
            </p>
            <div className="col-12 subscription_history">
                {loading ? (
                    <div className="p-0 mx-auto loading_icon w-50 text-center">
                        <LoadingIcon fill={'#27923E'} />
                    </div>
                ) : (
                    <Table
                        headerItems={['Timestamp', 'Credits', 'Fund Method', 'User ID']}
                        filterItems={filterItems}
                        isEmptyTable={IsEmptyTable}
                        csvFile={csv}
                        getFilterDropdown={(selectedItem) => filterData(selectedItem.selectedItem)}
                        sortData={(data) => setSortValues(data)}
                        tableContents={display.map((tableRow, index) => (
                            <React.Fragment key={index}>
                                <tr>
                                    <td className="mobile_sticky_table_side">
                                        {new Date(tableRow.ts).toLocaleDateString(undefined, {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </td>

                                    <td>{tableRow.credits}</td>

                                    <td>{tableRow.subscriptionPlan}</td>
                                    <td>{tableRow.sid}</td>
                                </tr>
                            </React.Fragment>
                        ))}
                        iconDisplay={false}
                        showModal={(modalState) => setModal(modalState)}
                        modalState={modalState}
                        showBtn={true}
                        buttonText={'Print Data'}
                        onInputChange={(val) => filterData(val.toLowerCase())}
                    />
                )}
            </div>
        </>
    );
};

export { SubscriptionHistory };
