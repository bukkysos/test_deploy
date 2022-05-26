import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
    AppContext,
    NavContext
    // IdContext
} from '../../../appContext';
import {
    HomeCard,
    Modal,
    PrintCardPreview,
    ProfileDetails,
    ProfileSidebar,
    RemitaModal,
    SelectInput,
    SuccessContent
} from '../../../components';
import { Print, Profile } from '../../../assets';
import './singleDependent.css';
import { BASE_URL } from '../../../config';
import axios from 'axios';
import { generateRemitaRRR } from '../../../application/paymentHandler';
import { ciEncrypt, decryptAndDecode } from '../../../config/utils/red';

const SingleDependent = () => {
    const [context, setContext] = useContext(AppContext);
    const [headerIconDisplay, setHeaderIconDisplay] = useContext(NavContext);
    const [modal, setModal] = useState(false);
    const [noticeModal, setNoticeModal] = useState(false);
    const [data, setData] = useState({});
    const [nin, setNin] = useState('');
    const [responseData, setResponseData] = useState([]);
    const [error] = useState(false);
    const [ninSlipError, setNinSlipError] = useState(false);
    const [verificationError, setVerificationError] = useState(null);
    const [single_nav, setSingle_nav] = useState('quick_action');
    const [tabIndex, setTabIndex] = useState(0);
    const [deviceInfo, setDeviceInfo] = useState([]);
    const [printModal, showPrintModal] = useState(false);
    const [cardType, setCardType] = useState('');
    const [profileBtnloading, setProfileBtnLoading] = useState(false);
    const [premiumLoading, setPremiumLoading] = useState(false);
    const [standardLoading, setStandardLoading] = useState(false);
    const [profileModal, setProfileModal] = useState(false);
    const [selectedState, setSelectedSate] = useState('');
    const { id } = useParams();

    const history = useHistory();

    const { index } = history.location.state;

    let ciDT = ciEncrypt.getItem('ciDT');

    const handleKey = useCallback(async () => {
        let ciDD = await ciEncrypt.getItem('ciDD');
        let userData = await decryptAndDecode(ciDD);
        setNin(userData.nin);
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

    const profileData = [
        {
            leftData: [
                'USER ID',
                'NIN',
                'FIRST NAME',
                'MIDDLE NAME',
                'LAST NAME',
                'GENDER',
                'DATE OF BIRTH',
                'NATIONALITY'
            ],
            rightData: [
                responseData?.userid,
                responseData?.nin,
                responseData?.fn,
                responseData?.mn,
                responseData?.sn,
                responseData?.g === 'F' ? 'FEMALE' : responseData?.g === 'M' ? 'MALE' : 'NA',
                responseData?.icao,
                responseData?.n
            ],
            primaryButtonText: 'Request Profile Update',
            contentType: null
        }
    ];

    useEffect(() => {
        setHeaderIconDisplay(true);
    }, [setHeaderIconDisplay]);

    useEffect(() => {
        setContext(modal);
    }, [modal, setContext]);

    useEffect(() => {
        setContext(profileModal);
    }, [profileModal, setContext]);

    useEffect(() => {
        setContext(printModal);
    }, [printModal, setContext]);

    useEffect(() => {
        if (nin) {
            axios({
                method: 'get',
                url: `${BASE_URL}utility/myDependents?parentNin=${nin}`,
                headers: {
                    Authorization: `Bearer ${ciDT}`
                }
            })
                .then((response) => {
                    decryptAndDecode(response.data.data).then((data) => {
                        setResponseData(() => data[index]);
                    });
                })
                .catch(() => {
                    // return;
                });
        }
    }, [index, data?.nin, ciDT]);

    useEffect(() => {
        if (tabIndex === 1) {
            if (deviceInfo && Object.keys(deviceInfo).length !== 0) {
                // Do something with the data
            } else {
                axios({
                    method: 'get',
                    url: `${BASE_URL}device/getMobileNumbers?userID=${id}`,
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
    }, [tabIndex, ciDT, id, deviceInfo]);

    // Payment
    const [paymentError, setPaymentError] = useState('');

    const remitaPayload = {
        user: responseData?.userid,
        reference: '0000',
        payersName: `${responseData?.fn} ${responseData?.sn}`,
        plan: '',
        paid: false,
        purchasedCredits: data?.availablecredit,
        key: process.env.REACT_APP_REMITA_PUBLIC_KEY
    };

    const { user, key, payersName, reference } = remitaPayload;

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://login.remita.net/payment/v1/remita-pay-inline.bundle.js';
        script.async = true;
        script.onload = () => document.body.appendChild(script);
    }, []);

    // Hit this endpoint with phone number to get OTP

    // Hit this endpoint with OTP to add number

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
                        userID: data?.userID,
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
                            // showPrintModal(true);
                            setProfileBtnLoading(false);
                            localStorage.setItem(
                                'paymentResponse',
                                JSON.stringify({
                                    txRef: paymentReference,
                                    service: cardType === 'Standard' ? 1 : 2,
                                    h: responseData.ninHash,
                                    status: true
                                })
                            );
                            setTimeout(() => {
                                history.push(`/payment-response/${paymentReference}`);
                            }, 1000);
                            setNoticeModal(false);
                        } else {
                            setVerificationError(error);
                            setProfileBtnLoading(false);
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
                    setPremiumLoading(false);
                    setStandardLoading(false);
                    setNinSlipError(true);
                    setNoticeModal(false);
                    return onError(response);
                },
                onClose: function () {
                    setPremiumLoading(false);
                    setStandardLoading(false);
                    setNoticeModal(false);
                }
            });

            remitaPaymentEngine.showPaymentWidget();
        },
        [
            ciDT,
            key,
            data.sn,
            data.fn,
            data.userID,
            responseData.ninHash,
            payersName,
            reference,
            user,
            history
        ]
    );

    const ninSlip = useCallback(
        (cardType) => {
            if (cardType === 'Premium') {
                setPremiumLoading(true);
            } else if (cardType === 'Standard') {
                setStandardLoading(true);
            }

            axios({
                method: 'get',
                url:
                    cardType === 'Premium'
                        ? `${BASE_URL}nimcSlip/premium?userID=${responseData.userid}`
                        : `${BASE_URL}nimcSlip/standardNINSlip?userID=${responseData.userid}`,
                headers: {
                    Authorization: `Bearer ${ciDT}`
                }
            })
                .then((response) => {
                    if (response.data.success) {
                        setNoticeModal(true);
                        setNinSlipError(false);

                        setTimeout(() => {
                            initRemita(cardType);
                            setModal(false);
                        }, 4000);
                    } else {
                        setPremiumLoading(false);
                        setStandardLoading(false);
                        setNinSlipError(true);
                    }
                })
                .catch(() => {
                    setPremiumLoading(false);
                    setStandardLoading(false);
                    setNinSlipError(true);
                });
            return true;
        },
        [ciDT, initRemita, responseData.userid]
    );

    useEffect(() => {
        if (cardType !== '') {
            ninSlip(cardType);
        }
        return () => {
            setCardType('');
        };
    }, [cardType, ninSlip]);

    const generatePaymentReference = (transactionId) => {
        const value = `NINSLIP-${transactionId}`;
        return value;
    };

    return (
        <>
            <div
                className={`${modal || profileModal || ninSlipError ? 'blur' : ''} ${
                    headerIconDisplay || context ? '' : ''
                }`}
            >
                <div className="single_nav d-flex justify-content-start">
                    <div
                        className={`single_nav_item p-2 mr-4 ${
                            single_nav === 'quick_action' ? 'single_nav_active' : ''
                        }`}
                        onClick={() => setSingle_nav('quick_action')}
                    >
                        Quick Actions
                    </div>
                    <div
                        className={`single_nav_item p-2 ${
                            single_nav === 'view_profile' ? 'single_nav_active' : ''
                        }`}
                        onClick={() => setSingle_nav('view_profile')}
                    >
                        View Profile
                    </div>
                </div>
            </div>

            {single_nav === 'quick_action' ? (
                <>
                    <div className={`${modal || profileModal ? 'blur' : ''}`}>
                        <h3 className="tab_page_title mx-auto">Quick Actions</h3>
                        <p className="mx-auto tab_page_subtitle">
                            Perform quick actions on the accounts of your dependents. What would you
                            like to do today?
                        </p>

                        <div className="col-12 d-flex flex-wrap justify-content-center px-4">
                            <HomeCard
                                icon={<Print />}
                                description={
                                    'Print the dependent’s Premium NIN slip and use anywhere. '
                                }
                                buttonText={'Premium NIN Slip'}
                                iconType={'print'}
                                to={null}
                                loading={premiumLoading}
                                disabled={premiumLoading}
                                onclick={() => {
                                    setCardType('Premium');
                                }}
                            />
                            <HomeCard
                                icon={<Print />}
                                description={
                                    'Print the dependent’s Standard NIN slip and use anywhere.'
                                }
                                buttonText={'Standard NIN Slip'}
                                iconType={'print'}
                                to={null}
                                loading={standardLoading}
                                disabled={standardLoading}
                                onclick={() => {
                                    setCardType('Standard');
                                }}
                            />
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div
                        className={`${
                            modal || profileModal ? 'blur' : ''
                        } profile col-md-11 col-lg-10 d-flex justify-content-between p-0 mx-auto align-self-center`}
                    >
                        <ProfileSidebar
                            getTabIndex={(tab) => setTabIndex(tab)}
                            mobileDropdownData={profileData[tabIndex]}
                            loading={profileBtnloading}
                            showProfileModal={() => {
                                setProfileModal(true);
                                setProfileBtnLoading(true);
                            }}
                            showAddNumberModal={() => {
                                setModal(true);
                                setProfileBtnLoading(true);
                            }}
                            sidebarItems={[
                                {
                                    linkName: 'Account Information',
                                    linkIcon: <Profile />
                                }
                            ]}
                            profileImage={`https://v1.ibib.io:7070/1/png/${responseData?.ninHash}.png`}
                        />
                        <div
                            className={`profile_details col-md-7 col-lg-8 p-0 ${
                                profileData[tabIndex].contentType === 'table'
                                    ? 'overflow_table'
                                    : ''
                            }`}
                        >
                            <div className={`${window.screen.width > 767 ? 'd-block' : 'd-none'}`}>
                                <ProfileDetails
                                    data={profileData[tabIndex]}
                                    userDetails={data}
                                    loading={profileBtnloading}
                                    showProfileModal={() => {
                                        setProfileModal(true);
                                        setProfileBtnLoading(true);
                                    }}
                                    showAddNumberModal={() => {
                                        setModal(true);
                                        setProfileBtnLoading(true);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </>
            )}

            {printModal ? (
                <>
                    <PrintCardPreview
                        closeModal={() => showPrintModal(false)}
                        cardType="simple"
                        cardFace={cardType}
                        h={responseData?.ninHash}
                        downloadLink={`https://slipserver1.nimc.gov.ng/ijebu?h=${responseData?.ninHash}&p=1&type=pns`}
                    />
                </>
            ) : (
                <></>
            )}

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
                    onclick={(modal) => modal}
                    content={
                        <SuccessContent
                            responseType={'error'}
                            responseTexts={
                                <>
                                    {!ninSlipError
                                        ? paymentError
                                        : 'An Error occured! Please try again!'}
                                </>
                            }
                            onclick={() => {
                                setModal(false);
                                setStandardLoading(false);
                                setPremiumLoading(false);
                                setProfileBtnLoading(false);
                            }}
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

export { SingleDependent };
