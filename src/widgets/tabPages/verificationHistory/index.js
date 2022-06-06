import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../../config';
import { LoadingIcon } from '../../../assets';
import { AppContext } from '../../../appContext';
import { PrintCardModal, Button, Modal, SuccessContent, Table } from '../../../components';
import { ciEncrypt, decryptAndDecode } from '../../../config/utils/red';
import { generateUrl } from '../../../config/generateUrl';

const filterItems = {
    filterItem: ['Level', 'Status'],
    filterState: {
        Level: ['Basic', 'Full', 'NIN Slip', 'Transacted'],
        Status: ['OK', 'Failed']
    }
};

const VerificationHistory = () => {
    const [modalState, setModal] = useState(false);
    const [context, setContext] = useContext(AppContext);
    const [responseData, setResponseData] = useState([]);
    const [pageLoading, setLoading] = useState(false);
    const [previewId, setPreviewId] = useState('');
    const [display, setDisplay] = useState([]);
    const [data, setData] = useState({});
    const [error, setError] = useState(null);
    const [verificationData, setVerificationData] = useState([]);
    const [searchParam] = useState(['level', 'status', 'verifiedID']);
    const [IsEmptyTable, setIsEmptyTable] = useState(false);
    const [csv, setcsv] = useState('');
    const [sortValues, setSortValues] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(null);
    const [sortParams, setSortParams] = useState({});
    const [canLoadMore, setCanLoadMore] = useState(false);
    const [loadingTableData, setLoadingTableData] = useState(false);
    const [loadMoreState, setLoadMoreState] = useState(false);
    const [searchString, setSearchString] = useState('');

    const [payload, setPayload] = useState({
        pageNo: 1,
        ts: '',
        status: '',
        level: '',
        search: ''
    });

    const queryParam = useMemo(() =>
        generateUrl({
            ...payload,
            ...sortParams,
            noOfRequests: 4,
        }), [sortParams, payload]
    );

    const [rowData, setRowData] = useState({
        timeStamp: null,
        transID: null,
        veriType: null,
        veriStatus: null,
        agentId: null
    });

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
        setContext(modalState);
    }, [modalState, setContext]);

    const fetchVerificationHistory = (userID) => {
        setLoading(true);
        axios({
            method: 'get',
            url: `${BASE_URL}verification/vh?userID=${userID}&${queryParam}`,
            headers: {
                Authorization: `Bearer ${ciDT}`
            }
        })
            .then((response) => {
                if (response.data.success) {
                    setResponseData(
                        response.data.data.pageNo > 1 ?
                            [...responseData, ...response.data.data.response]
                            : response.data.data.response);
                    setDisplay(response.data.data.pageNo > 1 ?
                        [...responseData, ...response.data.data.response]
                        : response.data.data.response);
                    setCurrentPage(response.data.data.pageNo);
                    setTotalPages(response.data.data.availablePages);
                    setCanLoadMore(response.data.data.pageNo < response.data.data.availablePages);
                    setLoadingTableData(false);
                    setLoadMoreState(false);
                }
                setLoading(false);
            })
            .catch(() => {
                setIsEmptyTable(true);
            });
    }

    useEffect(() => {
        if (data.userid) {
            fetchVerificationHistory(data.userid);
        }
    }, [ciDT, data.userid, queryParam]);

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
            let dropdownCategory = searchFilter.headerItem.toLowerCase();

            selectedFilter = searchFilter.selectedItem === 'Full' ? 'f'
                : searchFilter === 'Basic' ? 'b'
                    : searchFilter === 'NIN Slip' ? 'n'
                        : searchFilter === 'Transacted' ? 't'
                            : searchFilter;
            updatePayload(dropdownCategory, selectedFilter)

        },
        [responseData, searchParam]
    );

    const generateVerificationSheet = (transactionID) => {
        axios({
            method: 'get',
            url: `http://164.92.179.237:7071/api/v1/verification/verificationSheet?txID=${transactionID}`,
            headers: {
                Authorization: `Bearer ${ciDT}`
            }
        })
            .then((response) => {
                if (response.data.success) {
                    setVerificationData({
                        sn: response.data.data.sn,
                        fn: response.data.data.fn,
                        icao: response.data.data.dob,
                        mn: response.data.data.mn,
                        h: response.data.data.ninhash,
                        userId: response.data.data.userid
                    });
                    setModal(true);
                    setLoading(false);
                }
            })
            .catch((error) => {
                setError(error.response.data.error);
            });
    };

    const handleSort = useCallback(
        (sortValues) => {
            let headerItemLoweCase = sortValues?.headerItem?.toLowerCase();
            let newParam = {
                [headerItemLoweCase]: sortValues.sortState ? 'desc' : 'asc'
            };
            setSortParams(newParam);
            updatePayload('pageNo', 1);
        }, [sortValues]
    );

    useEffect(() => {
        timeout = setTimeout(() => {
            setPayload(prevValue => ({ ...prevValue, search: searchString, pageNo: 1 }));
            clearTimeout(timeout);
        }, 500);
        return () => { clearTimeout(timeout); }
    }, [searchString]);

    useEffect(() => {
        handleSort(sortValues);
    }, [sortValues, handleSort]);

    return (
        <>
            <div className={`${modalState ? 'blur' : ''} ${context ? '' : ''}`}>
                <h3 className="tab_page_title mx-auto">Verification History</h3>
                <p className="mx-auto tab_page_subtitle">
                    The table below shows records of all credentials you have verified using your
                    NIMC MobileID app.
                </p>

                <div className="col-12 mt-5 page_table">
                    {pageLoading ? (
                        <div className="p-0 mx-auto loading_icon w-50 text-center">
                            <LoadingIcon fill={'#27923E'} />
                        </div>
                    ) : (
                        <Table
                            headerItems={[
                                'Timestamp',
                                'USER ID',
                                'Level',
                                'Status',
                                'Transaction ID',
                                'Action'
                            ]}
                            filterItems={filterItems}
                            csvFile={csv}
                            getFilterDropdown={(selectedItem) =>
                                filterData(selectedItem)
                            }
                            sortData={(data) => setSortValues(data)}
                            isEmptyTable={IsEmptyTable}
                            canLoadMore={canLoadMore}
                            handleLoadMore={() => loadMore()}
                            loadingTableData={loadMoreState}
                            tableContents={display.map((tableRow, index) => (
                                <React.Fragment key={index}>
                                    <tr>
                                        <td className={`mobile_sticky_table_side`}>
                                            {new Date(tableRow.ts).toLocaleDateString(undefined, {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </td>
                                        <td>
                                            {tableRow.verifiedID === ''
                                                ? 'NA'
                                                : tableRow.verifiedID}
                                        </td>
                                        <td>
                                            {tableRow.level === 'b'
                                                ? 'Basic'
                                                : tableRow.level === 'f'
                                                    ? 'Full'
                                                    : tableRow.level === 'n'
                                                        ? 'NIN'
                                                        : tableRow.level === 't'
                                                            ? 'Transacted'
                                                            : ''}
                                        </td>
                                        <td>{tableRow.status}</td>

                                        <td>{tableRow.txid}</td>

                                        <td className="send_credit_button">
                                            <div className="send_credit_button">
                                                <Button
                                                    buttonType="primary"
                                                    buttonText={'Preview'}
                                                    loading={
                                                        tableRow.txid === previewId ? true : false
                                                    }
                                                    exportBtn={true}
                                                    onButtonClick={() => {
                                                        generateVerificationSheet(tableRow.txid);
                                                        setPreviewId(tableRow.txid);
                                                        setRowData({
                                                            timeStamp: tableRow.ts,
                                                            transID: tableRow.txid,
                                                            veriType: tableRow.level,
                                                            veriStatus: tableRow.status,
                                                            agentId: tableRow.agent
                                                        });
                                                    }}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                </React.Fragment>
                            ))}
                            iconDisplay={false}
                            showModal={(modalState) => setModal(modalState)}
                            modalState={modalState}
                            showBtn={true}
                            buttonText={'Preview'}
                            onInputChange={(val) => setSearchString(val.toLowerCase())}
                        />
                    )}
                    {
                        loadingTableData ?

                            <div className='load_more_indicator'>
                                <span >
                                    <LoadingIcon className='col-12' fill={'#27923E'} />
                                </span>
                            </div>
                            :
                            <></>
                    }
                </div>
            </div>
            {modalState ? (
                <>
                    <PrintCardModal
                        closeModal={(close) => {
                            setModal(close);
                            setPreviewId('');
                        }}
                        userData={verificationData}
                        tableData={rowData}
                    />
                </>
            ) : (
                <></>
            )}

            {error !== null ? (
                <Modal
                    onclick={() => {
                        setError(null);
                        setPreviewId('');
                    }}
                    content={
                        <SuccessContent
                            responseType={'error'}
                            responseTexts={
                                <>
                                    <p>{error}</p>
                                </>
                            }
                            onclick={(modal) => {
                                setModal(modal);
                                setPreviewId('');
                            }}
                        />
                    }
                    showCloseButton={true}
                />
            ) : (
                <></>
            )}
        </>
    );
};

export { VerificationHistory };
