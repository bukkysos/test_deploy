import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AppContext } from '../../../appContext';
import { Button, Modal, RemitaModal, NumberInput, SuccessContent } from '../../../components';
import axios from 'axios';
import { BASE_URL } from '../../../config';
import OtpInput from 'react-otp-input';
import { LoadingIcon } from '../../../assets';
import { ciEncrypt, decryptAndDecode } from '../../../config/utils/red';
import { generateUrl } from '../../../config/generateUrl';
import { LinkNumbersTable } from '../../../components/table/NewTable/LinkNumbersTable';

let otpDurationTimer;
const otpDuration = 60;

const LinkMobileNumber = () => {
    const [modal, setModal] = useState(false);
    const [context, setContext] = useContext(AppContext);
    const [data, setData] = useState({});
    const [primary, handlePrimaryButton] = useState('');
    const [responseData, setResponseData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [btnloading, setBtnLoading] = useState(false);
    const [normalInputVal, setNormalInputVal] = useState('234');
    const [otpInputVal, setOTPInputVal] = useState('');
    const [error, setError] = useState(false);
    const [errorText, setErrorText] = useState('');
    const [numberLinked, setNumberLinked] = useState(false);
    const [IsEmptyTable, setIsEmptyTable] = useState(false);
    const [sortValues, setSortValues] = useState({});
    const [display, setDisplay] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(null);
    const [sortParams, setSortParams] = useState({});
    const [canLoadMore, setCanLoadMore] = useState(false);
    const [loadMoreState, setLoadMoreState] = useState(false);

    const [payload, setPayload] = useState({
        pageNo: 1,
        network: '',
        mobile: ''
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

    const [otpTimeCounter, setOtpTimeCounter] = useState(otpDuration);
    const [resendOtpState, setResendOtpState] = useState(false);

    let ciDT = ciEncrypt.getItem('ciDT');
    const handleKey = useCallback(async () => {
        let { data } = await ciEncrypt.getItem('ciDD');
        let userData = await decryptAndDecode(data);
        setData(userData);
    }, [ciEncrypt]);

    useEffect(() => {
        handleKey();
    }, [handleKey]);

    useEffect(() => {
        setContext(modal);
    }, [modal, setContext]);

    const fetchNumbers = useCallback(
        (userID) => {
            axios({
                method: 'get',
                url: `${BASE_URL}device/getMobileNumbers?userID=${userID}&${queryParam}`,
                headers: {
                    Authorization: `Bearer ${ciDT}`
                }
            })
                .then((response) => {
                    if (response.data.success) {
                        setCurrentPage(response.data.data.pageNo);
                        setTotalPages(response.data.data.availablePages);
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
                        setCanLoadMore(
                            response.data.data.pageNo < response.data.data.availablePages
                        );
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

    const loadMore = () => {
        if (canLoadMore) {
            setLoadMoreState(true);
            updatePayload('pageNo', currentPage + 1);
        }
    };

    useEffect(() => {
        if (data.userid) {
            fetchNumbers(data.userid);
        }
    }, [data.userid, ciDT, queryParam]);

    //
    const updatePayload = useCallback(
        (key, value) => {
            setPayload((prevValue) => ({ ...prevValue, pageNo: 1, [key]: value }));
        },
        [payload]
    );

    //
    const filterData = useCallback(
        (searchFilter) => {
            if (searchFilter === undefined || searchFilter === null) {
                return;
            }
            updatePayload('network', searchFilter);
        },
        [responseData]
    );

    //
    const handleSort = useCallback(
        (sortValues) => {
            if (sortValues.headerItem === 'Mobile') {
                let newParam = {
                    mobile: sortValues.sortState ? 'desc' : 'asc'
                };
                setSortParams(newParam);
                updatePayload('pageNo', 1);
            }
        },
        [sortValues]
    );

    const validPhonePattern = /^0\d{10}$/;
    const formats = ['2347', '2348', '2349'];
    const format2 = ['23470', '23471', '23480', '23481', '23490', '23491'];

    const validatePhoneNumberOnChange = (numberVal) => {
        if (isNaN(numberVal)) {
            return;
        } else if (normalInputVal.length === 13) {
            setNormalInputVal(normalInputVal);
        } else if (normalInputVal.length === 3 && !formats.includes(numberVal)) {
            setNormalInputVal(normalInputVal);
            return;
        } else if (
            normalInputVal.length === 4 &&
            numberVal.length === 5 &&
            !format2.includes(numberVal)
        ) {
            setNormalInputVal(normalInputVal);
            return;
        } else if (normalInputVal.length === 4 && numberVal.length === 3) {
            setNormalInputVal(numberVal);
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
            normalInputVal.length < 13 ||
            normalInputVal.length > 13 ||
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
                userID: data?.userid,
                mobile: normalInputVal
            },
            headers: {
                Authorization: `Bearer ${ciDT}`
            }
        })
            .then((response) => {
                if (response.data.success) {
                    setResendOtpState(true);
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

    const countDown = () => {
        otpDurationTimer = setTimeout(() => {
            setOtpTimeCounter(otpTimeCounter - 1);
        }, 1000);
        if (otpTimeCounter === 0) {
            setResendOtpState(false);
            setOtpTimeCounter(otpDuration);
        }
        // return true;
    };

    useEffect(() => {
        if (resendOtpState) {
            countDown();
        } else {
            clearTimeout(otpDurationTimer);
            setOtpTimeCounter(otpDuration);
        }
    }, [countDown, resendOtpState]);

    const resendOTP = () => {
        try {
            axios({
                method: 'post',
                url: `${BASE_URL}utility/sendOTP`,
                data: {
                    userID: data?.userid,
                    mobile: normalInputVal
                },
                headers: {
                    Authorization: `Bearer ${ciDT}`
                }
            })
                .then((response) => {
                    if (response.data.success) {
                        setBtnLoading(false);
                        setResendOtpState(true);
                        // handlePrimaryButton('change');
                    } else {
                        setNumberLinked(false);
                        setBtnLoading(false);
                        setErrorMessage(response.data.message);
                    }
                })
                .catch((error) => {
                    setBtnLoading(false);
                    setErrorMessage(error.response.message);
                });
        } catch (error) {
            setErrorMessage(error.response.message);
        }
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
                userID: data?.userid,
                mobile: normalInputVal,
                otp: otpInputVal
            },
            headers: {
                Authorization: `Bearer ${ciDT}`
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
                    setErrorMessage(response.data.message);
                }
            })
            .catch((error) => {
                setNumberLinked(false);
                setBtnLoading(false);
                setErrorMessage(error.response.data.message);
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
                        <LinkNumbersTable
                            filterButtonState={modal}
                            isEmptyTable={IsEmptyTable}
                            sortData={(data) => setSortValues(data)}
                            canLoadMore={canLoadMore}
                            getFilterDropdown={(selectedItem) =>
                                filterData(selectedItem.selectedItem)
                            }
                            handleLoadMore={() => loadMore()}
                            loadingTableData={loadMoreState}
                            tableContent={display}
                            totalPageNo={totalPages}
                            currentPageNo={currentPage}
                            showModal={(modal) => setModal(modal)}
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
                                        <NumberInput
                                            placeholder={'08000000000'}
                                            label={'Phone Number'}
                                            value={normalInputVal}
                                            onblur={() => validateOnBlur()}
                                            onchange={(val) => validatePhoneNumberOnChange(val)}
                                            name="remita_select"
                                            mxlength={13}
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
                                        {errorMessage ? (
                                            <p
                                                className={`text-danger w-100 mt-2 d-flex justify-content-center error_text p-0 m-0 resend_otp`}
                                                onClick={() => resendOTP()}
                                            >
                                                <em>
                                                    <small>{errorMessage}</small>
                                                </em>
                                            </p>
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                    <p
                                        className={`w-100 mb-2 d-flex justify-content-center error_text p-0 m-0 resend_otp`}
                                    >
                                        {resendOtpState ? (
                                            <small>
                                                Resend OTP in <strong>{otpTimeCounter}s</strong>
                                            </small>
                                        ) : (
                                            <small onClick={() => resendOTP()}>
                                                <u>Resend OTP</u>
                                            </small>
                                        )}
                                    </p>
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
                            history.go(0);
                        }}
                        content={
                            <SuccessContent
                                responseType={numberLinked ? 'success' : 'error'}
                                responseTexts={
                                    <>
                                        {numberLinked ? (
                                            <p>Number linked successfully</p>
                                        ) : (
                                            <p>Number not linked. Try again!</p>
                                        )}
                                    </>
                                }
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
