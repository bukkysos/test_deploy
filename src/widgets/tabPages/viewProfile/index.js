import React, { useCallback, useContext, useEffect, useState } from 'react';
import { LinkMobile, Profile, Purchase } from '../../../assets';
import {
    Button,
    Input,
    Modal,
    PrintCardPreview,
    ProfileDetails,
    ProfileSidebar,
    RemitaModal,
    SelectInput,
    SuccessContent
} from '../../../components';
import { BASE_URL } from '../../../config';
import axios from 'axios';
import { AppContext } from '../../../appContext';
import { generateRemitaRRR } from '../../../application/paymentHandler';
import OtpInput from 'react-otp-input';
import { ciEncrypt, decryptAndDecode } from '../../../config/utils/red';

let otpDurationTimer;
const otpDuration = 60;

const ViewProfile = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const [deviceInfo, setDeviceInfo] = useState([]);
    const [context, setContext] = useContext(AppContext);
    const [modal, setModal] = useState(false);
    const [normalInputVal, setNormalInputVal] = useState('234');
    const [error, setError] = useState(false);
    const [printModal, showPrintModal] = useState(false);
    const [profileModal, setProfileModal] = useState(false);
    const [errorText, setErrorText] = useState('');
    const [verificationError, setVerificationError] = useState(null);
    const [cardType, setCardType] = useState('');
    const [ninSlipError, setNinSlipError] = useState(false);
    const [noticeModal, setNoticeModal] = useState(false);
    const [data, setData] = useState({});
    const [selectedState, setSelectedSate] = useState('');
    const [btnloading, setBtnLoading] = useState(false);
    const [primary, handlePrimaryButton] = useState('');
    const [otpInputVal, setOTPInputVal] = useState('');
    const [numberLinked, setNumberLinked] = useState(false);
    const [profileBtnloading, setProfileBtnLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [otpTimeCounter, setOtpTimeCounter] = useState(otpDuration);
    const [resendOtpState, setResendOtpState] = useState(false);

    let ciDT = ciEncrypt.getItem('ciDT');

    const handleKey = useCallback(async () => {
        let ciDD = await ciEncrypt.getItem('ciDD');
        let userData = await decryptAndDecode(ciDD);
        setData(userData);
    }, [ciEncrypt]);

    useEffect(() => {
        handleKey();
    }, [handleKey]);

    const states = [
        'Abia',
        'Adamawa',
        'Akwa Ibom',
        'Anambra',
        'Bauchi',
        'Bayelsa',
        'Benue',
        'Borno',
        'Cross River',
        'Delta',
        'Ebonyi',
        'Edo',
        'Ekiti',
        'Enugu',
        'FCT',
        'Gombe',
        'Imo',
        'Jigawa',
        'Kaduna',
        'Kano',
        'Katsina',
        'Kebbi',
        'Kogi',
        'Kwara',
        'Lagos',
        'Nasarawa',
        'Niger',
        'Ogun',
        'Ondo',
        'Osun',
        'Oyo',
        'Plateau',
        'Rivers',
        'Sokoto',
        'Taraba',
        'Yobe',
        'Zamfara'
    ];
    const viewProfileData = [
        {
            leftData: [
                'USER ID',
                'FIRST NAME',
                'MIDDLE NAME',
                'LAST NAME',
                'NIN',
                'GENDER',
                'DATE OF BIRTH',
                'NATIONALITY'
            ],
            rightData: [
                data?.userid,
                data?.fn,
                data?.mn,
                data?.sn,
                data?.nin,
                data?.gender || 'N/A',
                data?.icao,
                'NGA'
            ],
            primaryButtonText: 'Request Profile Update',
            contentType: null,
            routeTo: '/view-profile'
        },

        {
            leftData: ['AVAILABLE CREDITS', 'USED CREDITS'],
            rightData: [data?.availablecredit, data?.usedcredit],
            primaryButtonText: 'Purchase Subscription',
            contentType: null,
            routeTo: '/purchase-plan'
        },
        deviceInfo.map((info) => {
            return {
                idNumber: info.operator,
                mobile: info.msisdn,
                status: info.deviceStatus,
                primaryButtonText: 'Link Mobile Number',
                contentType: 'table',
                routeTo: '/link-number'
            };
        })
    ];
    const sidebarItems = [
        { linkName: 'Account Information', linkIcon: <Profile /> },
        { linkName: 'Credit Information', linkIcon: <Purchase /> },
        { linkName: 'Device Information', linkIcon: <LinkMobile /> }
    ];

    useEffect(() => {
        setContext(modal);
    }, [modal, setContext]);

    useEffect(() => {
        setContext(ninSlipError);
    }, [ninSlipError, setContext]);

    useEffect(() => {
        setContext(profileModal);
    }, [profileModal, setContext]);

    useEffect(() => {
        setContext(printModal);
    }, [printModal, setContext]);

    useEffect(() => {
        if (tabIndex === 2) {
            if (deviceInfo && Object.keys(deviceInfo).length !== 0) {
                // Do something here
            } else {
                if (data.userid) {
                    axios({
                        method: 'get',
                        url: `${BASE_URL}device/getMobileNumbers?userID=${data?.userid}`,
                        headers: {
                            Authorization: `Bearer ${ciDT}`
                        }
                    })
                        .then((response) => {
                            setDeviceInfo(response.data.data);
                        })
                        .catch(() => {
                            // return;
                        });
                }
            }
        }
    }, [tabIndex, ciDT, deviceInfo, data?.userid]);

    // Payment

    const [paymentError, setPaymentError] = useState('');

    const remitaPayload = {
        user: data?.userid,
        reference: '0000',
        payersName: `${data?.fn} ${data?.sn}`,
        plan: '',
        paid: false,
        purchasedCredits: data?.availablecredit,
        key: process.env.REACT_APP_REMITA_PUBLIC_KEY
    };

    const { user, key, payersName, reference } = remitaPayload;

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://remitademo.net/payment/v1/remita-pay-inline.bundle.js';
        // script.src = 'https://login.remita.net/payment/v1/remita-pay-inline.bundle.js';
        script.async = true;
        script.onload = () => document.body.appendChild(script);
    }, []);

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
                    setBtnLoading(false);
                    handlePrimaryButton('change');
                    setResendOtpState(true);
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

        if (otpInputVal === '' || otpInputVal.length !== 6) {
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
                otp: otpInputVal,
                index: '4'
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
                }
            })
            .catch(() => {
                setNumberLinked(false);
                setBtnLoading(false);
            });
        return true;
    };

    const initRemita = useCallback(
        async (cardType) => {
            const amt = cardType === 'Standard' ? '416.88' : '1039.38';
            const description = `${cardType} NIN Slip`;

            const rrr = await generateRemitaRRR(amt, reference, user, description, payersName);
            const onError = (response) => {
                if (response) {
                    setPaymentError(true);
                }
            };

            const onPaySuccess = (response) => {
                // card charged successfully, get reference here
                if (response) {
                    const paymentReference = generatePaymentReference(response.transactionId);
                    createPaymentLog(paymentReference);
                }
            };

            const createPaymentLog = (paymentReference) => {
                axios({
                    method: 'post',
                    url: `${BASE_URL}nimcSlip/paymentLog`,
                    data: {
                        userID: data?.userid,
                        txRef: paymentReference,
                        rrr: rrr,
                        service: cardType === 'Standard' ? 1 : 2
                    },
                    headers: {
                        Authorization: `Bearer ${ciDT}`
                    }
                })
                    .then((response) => {
                        if (response.data.success === true) {
                            showPrintModal(true);
                            setProfileBtnLoading(false);
                        } else {
                            setProfileBtnLoading(false);
                            setNinSlipError(true);
                        }
                    })
                    .catch((error) => {
                        setVerificationError(error);
                        setProfileBtnLoading(false);
                    });
            };

            const remitaPaymentEngine = window.RmPaymentEngine.init({
                key: key,
                firstName: `${data.fn}`,
                lastName: `${data.sn}`,
                narration: `${cardType} NIN slip`,
                amount: amt,
                transactionId: '',
                processRrr: true,
                extendedData: {
                    customFields: [
                        {
                            name: 'rrr',
                            value: rrr
                        }
                    ]
                },

                onSuccess: function (response) {
                    return onPaySuccess(response);
                },
                onError: function (response) {
                    setProfileBtnLoading(false);
                    setNinSlipError(true);
                    return onError(response);
                },
                onClose: function () {
                    setProfileBtnLoading(false);
                }
            });

            remitaPaymentEngine.showPaymentWidget();
        },
        [ciDT, key, data.sn, data.fn, payersName, reference, data.userid, user]
    );

    const premiumNinSlip = useCallback(
        (cardType) => {
            axios({
                method: 'get',
                url: `${BASE_URL}nimcSlip/premium?userID=${data.userid}`,
                headers: {
                    Authorization: `Bearer ${ciDT}`
                }
            })
                .then((response) => {
                    if (response.data.success === true) {
                        setNoticeModal(true);
                        setTimeout(() => {
                            initRemita(cardType);
                            setNoticeModal(false);
                        }, 4000);
                    } else {
                        setNinSlipError(true);
                        setProfileBtnLoading(false);
                    }
                })
                .catch(() => {
                    setNinSlipError(true);
                    setProfileBtnLoading(false);
                });
        },
        [data.userid, initRemita, ciDT]
    );

    useEffect(() => {
        if (cardType !== '') {
            premiumNinSlip(cardType);
        }
        return () => {
            setCardType('');
        };
    }, [cardType, initRemita, premiumNinSlip]);

    const generatePaymentReference = (transactionId) => {
        const value = `NINSLIP-${transactionId}`;
        return value;
    };

    return (
        <>
            <div
                className={`${modal || profileModal || ninSlipError ? 'blur' : ''} ${
                    context ? '' : ''
                } profile col-md-11 col-lg-10 d-flex justify-content-between p-0 mx-auto align-self-center`}
            >
                <ProfileSidebar
                    getTabIndex={(tab) => setTabIndex(tab)}
                    sidebarItems={sidebarItems}
                    profileImage={`https://v1.ibib.io:7070/1/png/${data?.h}.png`}
                    mobileDropdownData={viewProfileData[tabIndex]}
                    loading={profileBtnloading}
                    showProfileModal={() => {
                        setProfileModal(true);
                        setProfileBtnLoading(true);
                    }}
                    showAddNumberModal={() => {
                        setModal(true);
                        setProfileBtnLoading(true);
                    }}
                    printNIN={() => {
                        premiumNinSlip('Premium');
                        setProfileBtnLoading(true);
                    }}
                />
                <div
                    className={`profile_details col-md-7 col-lg-8 p-0 ${
                        viewProfileData[tabIndex].contentType === 'table' ? 'overflow_table' : ''
                    }`}
                >
                    <div className={`${window.screen.width > 767 ? 'd-block' : 'd-none'}`}>
                        <ProfileDetails
                            data={viewProfileData[tabIndex]}
                            loading={profileBtnloading}
                            showProfileModal={() => {
                                setProfileModal(true);
                                setProfileBtnLoading(true);
                            }}
                            showAddNumberModal={() => {
                                setModal(true);
                                setProfileBtnLoading(true);
                            }}
                            printNIN={() => {
                                premiumNinSlip('Premium');
                                setProfileBtnLoading(true);
                            }}
                        />
                    </div>
                </div>
            </div>
            {printModal ? (
                <>
                    <PrintCardPreview
                        closeModal={() => showPrintModal(false)}
                        cardType="simple"
                        cardFace={'Premium'}
                        h={data?.h}
                        downloadLink={`https://slipserver1.nimc.gov.ng/ijebu?h=${data?.h}&p=1&type=pns`}
                    />
                </>
            ) : (
                <></>
            )}

            {/* Link Number Modal Start */}

            {modal && primary === '' ? (
                <Modal
                    onclick={(modal) => {
                        setModal(modal);
                    }}
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
                                                    setProfileBtnLoading(false);
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
                    onclick={(modal) => {
                        setModal(modal);
                        setProfileBtnLoading(false);
                    }}
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
                                                    setProfileBtnLoading(false);
                                                }}
                                                buttonType={'default'}
                                                buttonText={'Cancel'}
                                            />
                                        </div>
                                        <div className="col-7 p-0">
                                            <Button
                                                onButtonClick={() => addNumber()}
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
                            setProfileBtnLoading(false);
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
                                onclick={(modal) => {
                                    setModal(modal);
                                    setProfileBtnLoading(false);
                                }}
                            />
                        }
                        showCloseButton={true}
                    />
                </>
            ) : (
                <></>
            )}
            {/* Link Number Modal End */}

            {noticeModal ? (
                <Modal
                    content={
                        <p className={'m-4 text-center'}>
                            Please do not leave page until transaction is completed
                        </p>
                    }
                    showCloseButton={false}
                />
            ) : (
                <></>
            )}

            {paymentError !== '' || ninSlipError ? (
                <Modal
                    onclick={(modal) => {
                        setModal(modal);
                        setProfileBtnLoading(false);
                        setNinSlipError(false);
                    }}
                    content={
                        <SuccessContent
                            responseType={'error'}
                            responseTexts={
                                <>
                                    {' '}
                                    <p>
                                        {!ninSlipError
                                            ? paymentError
                                            : 'An Error occured! Please try again!'}
                                    </p>{' '}
                                    <p>{paymentError}</p>
                                </>
                            }
                        />
                    }
                    showCloseButton={true}
                />
            ) : (
                <></>
            )}
            {verificationError !== null ? (
                <Modal
                    onclick={() => {
                        verificationError(null);
                        setProfileBtnLoading(false);
                    }}
                    content={
                        <SuccessContent
                            responseType={'error'}
                            responseTexts={
                                <>
                                    <p>{verificationError}</p>
                                </>
                            }
                            onclick={(modal) => setModal(modal)}
                        />
                    }
                    showCloseButton={true}
                />
            ) : (
                <></>
            )}
            {profileModal ? (
                <Modal
                    onclick={(modal) => {
                        setProfileModal(modal);
                        setProfileBtnLoading(false);
                        setSelectedSate('');
                    }}
                    content={
                        <RemitaModal
                            title={'Request Profile Update'}
                            description={
                                'To update your profile please go to any NIMC branch office near you'
                            }
                            children={
                                <>
                                    <div
                                        className={`remita_select_input`}
                                        style={{ height: '7rem' }}
                                    >
                                        <SelectInput
                                            placeholder={'State'}
                                            label={'Select State'}
                                            value={selectedState}
                                            selectItems={states}
                                            profileSelect={true}
                                            getSelectedItem={(item) => {
                                                setSelectedSate(item.selected);
                                            }}
                                            error={error}
                                            errorText={errorText}
                                        />
                                    </div>

                                    <div className={'profile_update_address mb-2'}>
                                        <h5 className="mb-2">
                                            {selectedState === undefined
                                                ? 'Select State and click on link.'
                                                : 'Click link:'}
                                        </h5>
                                        <p className="p-0 m-0">
                                            {selectedState === undefined ? (
                                                'Select State'
                                            ) : (
                                                <a
                                                    href={`https://nimc.gov.ng/${selectedState
                                                        .toLowerCase()
                                                        .replace(' ', '-')}${
                                                        selectedState === 'FCT' ? '' : '-state'
                                                    }-enrolment-centres/`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    style={{ fontSize: '.8rem' }}
                                                >
                                                    View Centers near you
                                                </a>
                                            )}
                                        </p>
                                    </div>
                                </>
                            }
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

export { ViewProfile };
