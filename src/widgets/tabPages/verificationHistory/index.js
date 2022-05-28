import React, { useCallback, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../../config';
import { LoadingIcon } from '../../../assets';
import { AppContext } from '../../../appContext';
import { PrintCardModal, Button, Modal, SuccessContent, Table } from '../../../components';
import { ciEncrypt, decryptAndDecode } from '../../../config/utils/red';
// import { ciEncrypt, decrypt } from '../../../config/utils/red';

// const searchParam = ["txid",  "level", "verifiedID"];
const filterItems = {
    filterItem: ['Level', 'Status'],
    filterState: {
        Level: ['Basic', 'Full', 'NIN Slip'],
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

    useEffect(() => {
        if (data.userid) {
            setLoading(true);
            axios({
                method: 'get',
                url: `${BASE_URL}verification/vh?userID=${data.userid}`,
                headers: {
                    Authorization: `Bearer ${ciDT}`
                }
            })
                .then((response) => {
                    setResponseData(() => response.data.data);
                    setLoading(false);
                    setDisplay(() => response.data.data);
                })
                .catch(() => {
                    setIsEmptyTable(true);
                });
        }
    }, [ciDT, data.userid]);

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

            searchFilter =
                searchFilter === 'Full'
                    ? 'f'
                    : searchFilter === 'Basic'
                    ? 'b'
                    : searchFilter === 'NIN Slip'
                    ? 'n'
                    : searchFilter;
            const filtered = responseData.filter((item) =>
                searchParam.some(() => {
                    return (
                        item.level.toString().toLowerCase() ===
                            searchFilter.toString().toLowerCase() ||
                        item.status.toString().toLowerCase() ===
                            searchFilter.toString().toLowerCase()
                    );
                })
            );
            setDisplay(filtered);
            if (filtered.length === 0) {
                setIsEmptyTable(true);
            } else {
                setIsEmptyTable(false);
            }
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
                                filterData(selectedItem.selectedItem)
                            }
                            sortData={(data) => setSortValues(data)}
                            isEmptyTable={IsEmptyTable}
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
                            onInputChange={(val) => filterData(val.toLowerCase())}
                        />
                    )}
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
