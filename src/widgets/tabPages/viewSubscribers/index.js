import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router';
import { Button } from '../../../components';
import { BASE_URL } from '../../../config';
import { Table } from '../../../components/table';
import { LoadingIcon } from '../../../assets';
import { ciEncrypt, decryptAndDecode } from '../../../config/utils/red';
import { generateUrl } from '../../../config/generateUrl';

const searchParam = ['adminId', 'staffId', 'sn', 'credits'];
let timeout;
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
    const [currentPage, setCurrentPage] = useState(1);
    const [sortParams, setSortParams] = useState({});
    const [canLoadMore, setCanLoadMore] = useState(false);
    const [loadingTableData, setLoadingTableData] = useState(false);
    const [loadMoreState, setLoadMoreState] = useState(false);
    const [searchString, setSearchString] = useState('');

    const [payload, setPayload] = useState({
        pageNo: 1,
        search: '',
        surname: '',
        credits: '',
        level: ''
    });

    const queryParam = useMemo(
        () =>
            generateUrl({
                ...payload,
                ...sortParams,
                noOfRequests: 4
            }),
        [sortParams, payload]
    );
    const history = useHistory();

    let ciDT = ciEncrypt.getItem('ciDT');

    const handleKey = useCallback(async () => {
        let { data } = await ciEncrypt.getItem('ciDD');
        let userData = await decryptAndDecode(data);
        if (userData.userid) {
            setData(userData);
        }
    }, [ciEncrypt]);

    useEffect(() => {
        handleKey();
    }, [handleKey]);

    const fetchSubscribers = (userID) => {
        setLoadingTableData(true);
        axios({
            method: 'get',
            url: `${BASE_URL}subscriptionHistory/mySubscribers?userID=${userID}&${queryParam}`,
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
                    setCanLoadMore(response.data.data.pageNo < response.data.data.availablePages);
                    setLoadingTableData(false);
                    setLoadMoreState(false);
                }
                setLoading(false);
            })
            .catch(() => {
                setIsEmptyTable(true);
            });
    };

    useEffect(() => {
        if (data.userid) {
            fetchSubscribers(data.userid);
        }
    }, [ciDT, data?.userid, queryParam]);

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

    // Filter Data
    const filterData = useCallback(
        (searchFilter) => {
            if (searchFilter === undefined || searchFilter === '' || searchFilter === null) {
                return;
            }

            searchFilter === 'Highest'
                ? updatePayload('credits', 'desc')
                : updatePayload('credits', 'asc');
        },
        [responseData, searchParam]
    );

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

    const handleSort = useCallback(
        (sortValues) => {
            let headerItemLoweCase = sortValues?.headerItem?.toLowerCase();
            let newParam = {
                [headerItemLoweCase]: sortValues.sortState ? 'desc' : 'asc'
            };
            setSortParams(newParam);
            updatePayload('pageNo', 1);
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
                        canLoadMore={canLoadMore}
                        handleLoadMore={() => loadMore()}
                        loadingTableData={loadMoreState}
                        isSubscribers={false}
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
                        iconDisplay={true}
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
            {/* </div> */}
        </>
    );
};

export { ViewSubscribers };
