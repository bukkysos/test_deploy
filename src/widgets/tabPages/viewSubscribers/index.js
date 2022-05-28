import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router';
import { Button } from '../../../components';
import { BASE_URL } from '../../../config';
import { Table } from '../../../components/table';
import { LoadingIcon } from '../../../assets';
import { ciEncrypt, decryptAndDecode } from '../../../config/utils/red';

const searchParam = ['adminId', 'staffId', 'sn', 'credits'];

const filterItems = {
    filterItem: ['Credits'],
    filterState: {
        Credits: ['Highest', 'Lowest']
    }
};

const ViewSubscribers = () => {
    const [responseData, setResponseData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    const [IsEmptyTable, setIsEmptyTable] = useState(false);
    const [csv, setcsv] = useState('');
    const [sortValues, setSortValues] = useState({});
    const [display, setDisplay] = useState([]);

    const history = useHistory();

    let ciDT = ciEncrypt.getItem('ciDT');

    const handleKey = useCallback(async () => {
        let ciDD = await ciEncrypt.getItem('ciDD');
        let userData = await decryptAndDecode(ciDD);
        if (userData.userid) {
            setData(userData);
        }
    }, [ciEncrypt]);

    useEffect(() => {
        handleKey();
    }, [handleKey]);

    useEffect(() => {
        if (data.userid) {
            axios({
                method: 'get',
                url: `${BASE_URL}subscriptionHistory/mySubscribers?userID=${data?.userid}`,
                headers: {
                    Authorization: `Bearer ${ciDT}`
                }
            })
                .then((response) => {
                    filterRecurrentData(response.data.data);
                    setLoading(false);
                })
                .catch(() => {
                    setIsEmptyTable(true);
                });
        }
    }, [ciDT, data?.userid]);

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

    useEffect(() => {
        if (responseData.length === 0) {
            setIsEmptyTable(true);
        } else {
            setIsEmptyTable(false);
        }
    }, [responseData]);

    const filterRecurrentData = (data) => {
        setDisplay(data);
        setResponseData(data);
    };

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

    const handleSort = useCallback(
        (sortValues) => {
            if (sortValues.headerItem === 'Surname') {
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
            {/* <div className={`${modalState ? "blur" : ""}`}> */}
            <h3 className="tab_page_title mx-auto">View Subscribers</h3>
            <p className="mx-auto tab_page_subtitle mb-5">
                The table below shows the records of all the users you have shared your credits
                with.
            </p>

            <div className="col-12" style={{ padding: '0px 2%' }}>
                {loading ? (
                    <div className="p-0 mx-auto loading_icon w-50 text-center">
                        <LoadingIcon fill={'#27923E'} />
                    </div>
                ) : (
                    <Table
                        headerItems={['Surname', 'User ID', 'Credits', 'Action']}
                        csvFile={csv}
                        getFilterDropdown={(selectedItem) => filterData(selectedItem.selectedItem)}
                        sortData={(data) => setSortValues(data)}
                        isEmptyTable={IsEmptyTable}
                        filterItems={filterItems}
                        tableContents={display.map((tableRow, index) => (
                            <React.Fragment key={index}>
                                <tr>
                                    <td className="mobile_sticky_table_side">{tableRow.sn}</td>
                                    <td>{tableRow.staffId}</td>
                                    <td>{tableRow.credits}</td>

                                    <td className="send_credit_button">
                                        <div className="send_credit_button">
                                            <Button
                                                buttonType="primary"
                                                buttonText={'Gift Credit'}
                                                exportBtn={true}
                                                onButtonClick={() =>
                                                    history.push('/gift-credits', {
                                                        recipientID: tableRow.staffId
                                                    })
                                                }
                                            />
                                        </div>
                                    </td>
                                </tr>
                            </React.Fragment>
                        ))}
                        showBtn={true}
                        // iconDisplay={true}
                        onInputChange={(val) => filterData(val.toLowerCase())}
                    />
                )}
            </div>
            {/* </div> */}
        </>
    );
};

export { ViewSubscribers };
