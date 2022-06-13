import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { LoadingIcon } from '../../../assets';
import axios from 'axios';
import { Table } from '../../../components/table';
import './subscriptionHistory.css';
import { BASE_URL } from '../../../config';
import { ciEncrypt, decryptAndDecode } from '../../../config/utils/red';
import { generateUrl } from '../../../config/generateUrl';

const filterItems = {
    filterItem: ['Fund Method'],
    filterState: {
        'Fund Method': ['Gift', 'Individual']
    }
};

const searchParam = ['credits', 'subscriptionPlan', 'sid', 'credits'];
let timeout;
const SubscriptionHistory = () => {
    const [modalState, setModal] = useState(false);
    const [data, setData] = useState({});
    const [responseData, setResponseData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [IsEmptyTable, setIsEmptyTable] = useState(false);
    const [sortValues, setSortValues] = useState({});
    const [display, setDisplay] = useState([]);
    const [csv, setcsv] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortParams, setSortParams] = useState({});
    const [canLoadMore, setCanLoadMore] = useState(false);
    const [loadingTableData, setLoadingTableData] = useState(false);
    const [loadMoreState, setLoadMoreState] = useState(false);
    const [searchString, setSearchString] = useState('');

    const [payload, setPayload] = useState({
        pageNo: 1,
        subType: '',
        ts: '',
        status: ''
    });

    const queryParam = useMemo(
        () =>
            generateUrl({
                ...payload,
                ...sortParams,
                noOfRequests: 3
            }),
        [sortParams, payload]
    );

    let ciDT = ciEncrypt.getItem('ciDT');

    const handleKey = useCallback(async () => {
        let { data } = await ciEncrypt.getItem('ciDD');
        let userData = await decryptAndDecode(data);
        setData(userData);
    }, [ciEncrypt]);

    useEffect(() => {
        handleKey();
    }, [handleKey]);

    const fetchTransactions = useCallback(
        (userID) => {
            setLoadingTableData(true);
            axios({
                method: 'get',
                url: `${BASE_URL}subscriptionHistory/transactions?userID=${userID}&${queryParam}`,
                headers: {
                    Authorization: `Bearer ${ciDT}`
                }
            })
                .then((response) => {
                    if (response.data.success) {
                        setResponseData(
                            response.data.data.pageNo > 1
                                ? [...responseData, ...response.data.data.response]
                                : response.data.data.response
                        );
                        setDisplay(
                            response.data.data.pageNo > 1
                                ? [...responseData, ...response.data.data.response]
                                : response.data.data.response
                        );
                        setCurrentPage(response.data.data.pageNo);
                        setCanLoadMore(
                            response.data.data.pageNo < response.data.data.availablePages
                        );
                        setLoadingTableData(false);
                        setLoadMoreState(false);
                    }
                    setLoading(false);
                })
                .catch(() => {
                    setIsEmptyTable(true);
                });
        },
        [queryParam]
    );

    useEffect(() => {
        if (data?.userid) {
            fetchTransactions(data.userid);
        }
    }, [ciDT, data?.userid, queryParam]);

    //
    const updatePayload = useCallback(
        (key, value) => {
            setPayload((prevValue) => ({ ...prevValue, pageNo: 1, [key]: value }));
        },
        [payload]
    );

    const loadMore = () => {
        if (canLoadMore) {
            setLoadMoreState(true);
            updatePayload('pageNo', currentPage + 1);
        }
    };

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
            updatePayload('subType', searchFilter);
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
            if (sortValues.headerItem !== '') {
                let headerItemLoweCase = sortValues?.headerItem?.toLowerCase();
                let newParam = {
                    [headerItemLoweCase]: sortValues.sortState ? 'desc' : 'asc'
                };
                setSortParams(newParam);
                updatePayload('pageNo', 1);
            }
        },
        [sortValues]
    );

    useEffect(() => {
        timeout = setTimeout(() => {
            setPayload((prevValue) => ({ ...prevValue, search: searchString, pageNo: 1 }));
            clearTimeout(timeout);
        }, 500);
        return () => {
            clearTimeout(timeout);
        };
    }, [searchString]);

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
                        canLoadMore={canLoadMore}
                        handleLoadMore={() => loadMore()}
                        loadingTableData={loadMoreState}
                        tableContents={
                            <>
                                {display.map((tableRow, index) => (
                                    <React.Fragment key={index}>
                                        <tr>
                                            <td className="mobile_sticky_table_side">
                                                {new Date(tableRow.ts).toLocaleDateString(
                                                    undefined,
                                                    {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    }
                                                )}
                                            </td>

                                            <td>{tableRow.credits}</td>
                                            <td>{tableRow.subscriptionPlan}</td>
                                            <td>{tableRow.sid}</td>
                                        </tr>
                                    </React.Fragment>
                                ))}
                            </>
                        }
                        iconDisplay={false}
                        showModal={(modalState) => setModal(modalState)}
                        modalState={modalState}
                        showBtn={true}
                        buttonText={'Print Data'}
                        onInputChange={(val) => setSearchString(val.toLowerCase())}
                    />
                )}
                {loadingTableData ? (
                    <div className="load_more_indicator">
                        <span>
                            <LoadingIcon className="col-12" fill="#27923E" />
                        </span>
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </>
    );
};

export { SubscriptionHistory };
