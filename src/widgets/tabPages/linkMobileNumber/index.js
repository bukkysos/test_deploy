import React, { useCallback, useContext, useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import { AppContext } from '../../../appContext';
import { Button, Input, Modal, RemitaModal, SuccessContent, Table } from '../../../components';
import axios from 'axios';
import { BASE_URL } from '../../../config';
import OtpInput from 'react-otp-input';
import { LoadingIcon } from '../../../assets';

const filterItems = {
    filterItem: ['Status'],
    filterState: {
        Status: ['Active', 'Inactive']
    }
};

const LinkMobileNumber = () => {
    const [modal, setModal] = useState(false);
    const [context, setContext] = useContext(AppContext);
    const [primary, handlePrimaryButton] = useState('');
    const [responseData, setResponseData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [btnloading, setBtnLoading] = useState(false);
    const [normalInputVal, setNormalInputVal] = useState('');
    const [otpInputVal, setOTPInputVal] = useState('');
    const [error, setError] = useState(false);
    const [errorText, setErrorText] = useState('');
    const [numberLinked, setNumberLinked] = useState(false);
    const [IsEmptyTable, setIsEmptyTable] = useState(false);
    const [csv, setcsv] = useState('');
    const [sortValues, setSortValues] = useState({});
    const [display, setDisplay] = useState([]);

    const accessToken = localStorage.getItem('accessToken');
    const jwt_code = localStorage.getItem('data');
    if (jwt_code && accessToken) {
        var jwt_data = jwt_decode(jwt_code);
    }

    useEffect(() => {
        setContext(modal);
    }, [modal, setContext]);

    useEffect(() => {
        axios({
            method: 'get',
            url: `${BASE_URL}device/getMobileNumbers?userID=${jwt_data?.userid}`,
            headers: {
                Authorization: `Bearer ${accessToken}`
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
    }, [jwt_data?.userid, accessToken]);

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

    const validPhonePattern = /^0\d{10}$/;

    const validatePhoneNumberOnChange = (numberVal) => {
        if (isNaN(numberVal)) {
            return;
        } else if (normalInputVal.length === 12) {
            return;
        }
        setNormalInputVal(numberVal);
    };

    const validateOnBlur = () => {
        if (!validPhonePattern.test(normalInputVal)) {
            setError(true);
        }
    };

    // Hit this endpoint with phone number to get OTP
    const sendOTP = () => {
        if (
            normalInputVal === '' ||
            normalInputVal.length < 11 ||
            normalInputVal.length > 11 ||
            isNaN(parseInt(normalInputVal))
        ) {
            setError(true);
            setErrorText('Invalid Number');
            return;
        }

        setBtnLoading(true);
        setError(false);

        axios({
            method: 'post',
            url: `${BASE_URL}utility/sendOTP`,
            data: {
                userID: jwt_data?.userid,
                mobile: normalInputVal
            },
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then((response) => {
                if (response.data.success) {
                    setBtnLoading(false);
                    handlePrimaryButton('change');
                } else {
                    setNumberLinked(false);
                    setBtnLoading(false);
                }
            })
            .catch(() => {
                setBtnLoading(false);
            });
    };

    // Hit this endpoint with OTP to add number
    const addNumber = () => {
        setBtnLoading(true);

        if (otpInputVal === '' || otpInputVal.length !== 6 || error) {
            setError(true);
            setErrorText('Ensure OTP is entered correctly');
            return setBtnLoading(false);
        }

        axios({
            method: 'post',
            url: `${BASE_URL}utility/addMobileNumber`,
            data: {
                userID: jwt_data?.userid,
                mobile: normalInputVal,
                otp: otpInputVal,
                index: '4'
            },
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then((response) => {
                if (response.data.success) {
                    setBtnLoading(false);
                    setError(false);
                    setNumberLinked(true);
                    handlePrimaryButton('finished');
                } else {
                    setNumberLinked(false);
                    setBtnLoading(false);
                }
            })
            .catch(() => {
                setNumberLinked(false);
                setBtnLoading(false);
            });
        return true;
    };

    useEffect(() => {
        if (responseData.length === 0) {
            setIsEmptyTable(true);
        } else {
            setIsEmptyTable(false);
        }
    }, [responseData]);

    const filterData = useCallback(
        (searchFilter) => {
            if (searchFilter === undefined || searchFilter === '' || searchFilter === null) {
                return;
            }

            const filtered = responseData.filter((item) =>
                ['MSISDN', 'deviceID', 'deviceStatus', 'idNumber'].some((newItem) => {
                    return (
                        item[newItem].toString().toLowerCase().indexOf(searchFilter.toLowerCase()) >
                        -1
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
        [responseData]
    );

    const handleSort = useCallback(
        (sortValues) => {
            if (sortValues.headerItem === 'ID Number' || sortValues.headerItem === 'Status') {
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
            <div className={`${modal ? 'blur' : ''} ${context ? '' : ''}`}>
                <h3 className="tab_page_title mx-auto">Link Mobile Number</h3>

                <p className="mx-auto tab_page_subtitle">
                    The table below shows records of all the mobile numbers linked to your NIN
                    profile.
                </p>
                {loading ? (
                    <div className="p-0 mx-auto loading_icon w-50 text-center">
                        <LoadingIcon fill={'#27923E'} />
                    </div>
                ) : (
                    <div className="col-12 mt-5 page_table">
                        <Table
                            filterButtonText={'Add Number'}
                            headerItems={['ID Number', 'Mobile', 'Status', 'Device ID']}
                            filterButtonState={modal}
                            filterItems={filterItems}
                            csvFile={csv}
                            isEmptyTable={IsEmptyTable}
                            sortData={(data) => setSortValues(data)}
                            getFilterDropdown={(selectedItem) =>
                                filterData(selectedItem.selectedItem)
                            }
                            tableContents={display.map((tableRow, index) => (
                                <React.Fragment key={index}>
                                    <tr>
                                        <td className={`mobile_sticky_table_side`}>
                                            {tableRow.idNumber === '' ? 'NA' : tableRow.idNumber}
                                        </td>
                                        <td>{tableRow.MSISDN === '' ? 'NA' : tableRow.MSISDN}</td>
                                        <td>
                                            {tableRow.deviceStatus === ''
                                                ? 'NA'
                                                : tableRow.deviceStatus}
                                        </td>
                                        <td>
                                            {tableRow.deviceID === '' ? 'NA' : tableRow.deviceID}
                                        </td>
                                    </tr>
                                </React.Fragment>
                            ))}
                            showModal={(modal) => setModal(modal)}
                            onInputChange={(val) => filterData(val.toLowerCase())}
                        />
                    </div>
                )}
            </div>
            {modal && primary === '' ? (
                <Modal
                    onclick={(modal) => setModal(modal)}
                    content={
                        <RemitaModal
                            responseType={'error'}
                            title={'Add Mobile Number'}
                            description={
                                'Please endeavour to input a valid phone number in the field below.'
                            }
                            children={
                                <>
                                    <div className={`remita_select_input`}>
                                        <Input
                                            placeholder={'08000000000'}
                                            label={'Phone Number'}
                                            value={normalInputVal}
                                            onblur={() => validateOnBlur()}
                                            onchange={(val) => validatePhoneNumberOnChange(val)}
                                            name="remita_select"
                                            mxlength={11}
                                            error={error}
                                            errorText={errorText}
                                        />
                                    </div>
                                    <div className="remita_buttons d-flex justify-content-between">
                                        <div className="col-4 p-0">
                                            <Button
                                                onButtonClick={() => {
                                                    setModal(false);
                                                    handlePrimaryButton('');
                                                    setNormalInputVal('');
                                                    setBtnLoading(false);
                                                }}
                                                buttonType={'default'}
                                                buttonText={`Cancel`}
                                            />
                                        </div>
                                        <div className="col-7 p-0">
                                            <Button
                                                onButtonClick={() => sendOTP()}
                                                buttonType={'primary'}
                                                buttonText={'Next'}
                                                loading={btnloading}
                                            />
                                        </div>
                                    </div>
                                </>
                            }
                        />
                    }
                    showCloseButton={false}
                />
            ) : modal && primary === 'change' ? (
                <Modal
                    onclick={(modal) => setModal(modal)}
                    content={
                        <RemitaModal
                            responseType={'error'}
                            title={'Verify Number'}
                            description={
                                'We just sent a six(6) digits one time password to the phone number.'
                            }
                            children={
                                <>
                                    <div className={`remita_select_otp my-5`}>
                                        <OtpInput
                                            value={otpInputVal}
                                            onChange={(val) => {
                                                setOTPInputVal(val);
                                                setError(false);
                                            }}
                                            numInputs={6}
                                            isInputNum={true}
                                            containerStyle={
                                                'd-flex justify-content-between col-12 p-0 m-0'
                                            }
                                            inputStyle={`filter_box ${error ? 'error' : ''}`}
                                            focusStyle={`filter_box_focus ${error ? 'error' : ''}`}
                                            hasErrored={true}
                                            separator={' '}
                                        />
                                    </div>
                                    <div className="remita_buttons d-flex justify-content-between">
                                        <div className="col-4 p-0">
                                            <Button
                                                onButtonClick={() => {
                                                    setModal(false);
                                                    handlePrimaryButton('');
                                                    setOTPInputVal('');
                                                    setNormalInputVal('');
                                                    setBtnLoading(false);
                                                }}
                                                buttonType={'default'}
                                                buttonText={'Cancel'}
                                            />
                                        </div>
                                        <div className="col-7 p-0">
                                            <Button
                                                onButtonClick={() => {
                                                    addNumber();
                                                }}
                                                buttonType={'primary'}
                                                buttonText={'Confirm'}
                                                loading={btnloading}
                                            />
                                        </div>
                                    </div>
                                </>
                            }
                        />
                    }
                    showCloseButton={false}
                />
            ) : modal && primary === 'finished' ? (
                <>
                    <Modal
                        onclick={(modal) => {
                            setModal(modal);
                            handlePrimaryButton('');
                            setNormalInputVal('');
                            setOTPInputVal('');
                            setBtnLoading(false);
                        }}
                        content={
                            <SuccessContent
                                responseType={numberLinked ? 'success' : 'error'}
                                responseTexts={
                                    <>
                                        {numberLinked ? (
                                            // <p>{responseMessage}</p>
                                            <p>Number linked successfully</p>
                                        ) : (
                                            <p>Number not linked. Try again!</p>
                                        )}
                                    </>
                                }
                                // onclick={(modal) => { }}
                                onclick={() => {}}
                            />
                        }
                        showCloseButton={true}
                    />
                </>
            ) : (
                <></>
            )}
        </>
    );
};

export { LinkMobileNumber };
