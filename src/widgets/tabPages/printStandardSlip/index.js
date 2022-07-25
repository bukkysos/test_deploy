import axios from 'axios';
import jsSHA from 'jssha';
import { BASE_URL } from '../../../config';
import { useHistory } from 'react-router-dom';
import { AppContext } from '../../../appContext';
import { hex_rmd160 } from '../../../config/hex-ripe';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { generateRemitaRRR } from '../../../application/paymentHandler';
import { Modal, PrintStandardCard, StandardCardButton, SuccessContent } from '../../../components';
import { ciEncrypt, decryptAndDecode } from '../../../config/utils/red';

const PrintStandardSlip = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({});
    const [modal, setModal] = useState(false);
    const [checkLoading, setCheckLoading] = useState(false);
    const [context, setContext] = useContext(AppContext);
    const [errorHandler, setErrorHandler] = useState({ status: false, message: '' });

    const history = useHistory();

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
        generateHash(data);
        setContext(modal);
    }, [modal, setContext, data]);

    useEffect(() => {
        setContext(errorHandler);
    }, [errorHandler, setContext]);

    useEffect(() => {
        const script = document.createElement('script');

        script.src = window.location.host.includes('localhost')
            ? 'https://remitademo.net/payment/v1/remita-pay-inline.bundle.js'
            : 'https://login.remita.net/payment/v1/remita-pay-inline.bundle.js';

        // script.src = 'https://remitademo.net/payment/v1/remita-pay-inline.bundle.js';

        script.async = true;
        script.onload = () => console.log('Loaded...');
        document.body.appendChild(script);
    }, []);

    let generateHash = ({ fn, mn, sn, nin }) => {
        let inflow = JSON.stringify({
            fn: fn,
            mn: mn,
            sn: sn,
            nin: nin
        });

        let shaObj = new jsSHA('SHA-512', 'TEXT');
        let shaObj2 = new jsSHA('SHA-512', 'TEXT');
        shaObj.update(inflow);
        let s1 = shaObj.getHash('HEX');
        shaObj2.update(s1);
        let s2 = shaObj2.getHash('HEX');
        return hex_rmd160(s2);
    };

    const remitaPayload = {
        user: data?.userid,
        amount: 416.88,
        reference: '0000',
        payersName: `${data.fn} ${data.sn}`,
        plan: '',
        paid: false,
        purchasedCredits: data?.availablecredit,
        key: process.env.REACT_APP_REMITA_PUBLIC_KEY
    };

    const { amount, user, key, payersName, reference } = remitaPayload;

    const checkPaymentStatus = () => {
        setCheckLoading(true);
        axios({
            method: 'get',
            url: `${BASE_URL}nimcSlip/download?userID=${data.userid}`,
            headers: {
                Authorization: `Bearer ${ciDT}`
            }
        })
            .then((response) => {
                if (response.data.success) {
                    localStorage.setItem(
                        'paymentResponse',
                        JSON.stringify({
                            txRef: '',
                            service: 1,
                            status: true,
                            action: 'print',
                            h: data?.h
                        })
                    );
                } else {
                    localStorage.setItem(
                        'paymentResponse',
                        JSON.stringify({
                            txRef: '',
                            service: 3,
                            status: false,
                            action: 'pending'
                        })
                    );
                }
                setCheckLoading(false);
                return history.push(`/payment-response`);
            })
            .catch((error) => {
                setErrorHandler({
                    status: true,
                    message: error.response.message
                });
                return setCheckLoading(false);
            });
    };

    const saveSlipForDownload = (userid, paymentReference) => {
        axios({
            method: 'post',
            url: `${BASE_URL}nimcSlip/CN`,
            headers: {
                Authorization: `Bearer ${ciDT}`
            },
            data: {
                userID: userid,
                service: 1
            }
        })
            .then((response) => {
                if (response.data.success) {
                    localStorage.setItem(
                        'paymentResponse',
                        JSON.stringify({
                            txRef: paymentReference,
                            service: 1,
                            h: data?.h,
                            status: true
                        })
                    );
                    setLoading(false);
                    setTimeout(() => {
                        history.push(`/payment-response`);
                    }, 1000);
                } else {
                    setErrorHandler({
                        status: true,
                        message: response.data.message
                    });
                }
                return setLoading(false);
            })
            .catch((error) => {
                setErrorHandler({
                    status: true,
                    message: error.response.message
                });
                return setLoading(false);
            });
    };

    const standardNinSlip = () => {
        setLoading(true);
        axios({
            method: 'get',
            url: `${BASE_URL}nimcSlip/standardNINSlip?userID=${data.userid}`,
            headers: {
                Authorization: `Bearer ${ciDT}`
            }
        })
            .then((response) => {
                if (response.data.success) {
                    setModal(true);
                    setTimeout(() => {
                        initRemita();
                        setModal(false);
                    }, 4000);
                } else {
                    setModal(false);
                    setErrorHandler({
                        status: true,
                        message: response.data.message
                    });
                    setLoading(false);
                }
            })
            .catch((error) => {
                setModal(false);
                setErrorHandler({
                    status: true,
                    message: error.response.message
                });
                setLoading(false);
            });
    };

    const initRemita = async () => {
        setLoading(true);
        const amt = String(amount);
        const description = 'Standard NIN Slip';
        const rrr = await generateRemitaRRR(amt, reference, user, description, payersName);
        const onError = (response) => {
            if (response) {
                // return;
            }
        };

        const onPaySuccess = (response) => {
            // card charged successfully, get reference here
            if (response) {
                const paymentReference = generatePaymentReference(response.transactionId);
                createPaymentLog(paymentReference);
            } else {
                setErrorHandler({
                    status: true,
                    message: response.data.message
                });
                setLoading(false);
            }
        };

        const createPaymentLog = (paymentReference) => {
            axios({
                method: 'post',
                url: `${BASE_URL}nimcSlip/paymentLog`,
                data: {
                    userID: data.userid,
                    txRef: paymentReference,
                    rrr: rrr,
                    service: 1
                },
                headers: {
                    Authorization: `Bearer ${ciDT}`
                }
            })
                .then((response) => {
                    if (response.data.success === true) {
                        saveSlipForDownload(user, paymentReference);
                        setLoading(false);
                    } else {
                        setErrorHandler({
                            status: true,
                            message: response.data.message
                        });
                        setLoading(false);
                    }
                })
                .catch((error) => {
                    setErrorHandler({
                        status: true,
                        message: error.response.message
                    });
                    localStorage.setItem(
                        'paymentResponse',
                        JSON.stringify({
                            txRef: paymentReference,
                            service: 1,
                            h: data.h,
                            status: false
                        })
                    );
                });
        };

        const remitaPaymentEngine = window.RmPaymentEngine.init({
            key,
            firstName: `${data.fn}`,
            lastName: `${data.sn}`,
            narration: 'Standard NIN slip',
            amount: amount,
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
                setErrorHandler({
                    status: true,
                    message: response.data.message
                });
                setLoading(false);
                return onError(response);
            },
            onClose: function () {
                setLoading(false);
            }
        });

        remitaPaymentEngine.showPaymentWidget();
    };

    const generatePaymentReference = (transactionId) => {
        const value = `NINSLIP-${transactionId}`;
        return value;
    };

    return (
        <>
            <div className={`${modal || errorHandler.status ? 'blur' : ''} ${context ? '' : ''}`}>
                <h3 className="tab_page_title mx-auto">Print Standard NIN Slip</h3>
                <p className="mx-auto tab_page_subtitle">
                    Your NIN slip serves as a legal tender throughout the Federal Republic of
                    Nigeria, and is backed by law.
                </p>

                <div className="col-12 print_standard_slip d-flex justify-content-center px-4">
                    <PrintStandardCard
                        loading={loading}
                        onclick={() => {
                            standardNinSlip();
                        }}
                    />
                </div>
                <div className="col-12 d-flex justify-content-center print_premium_card px-4">
                    <StandardCardButton
                        onclick={() => checkPaymentStatus()}
                        loading={checkLoading}
                    />
                </div>
            </div>
            {modal && (
                <>
                    <Modal
                        content={
                            <p className={'m-4 text-center'}>
                                Please do not leave page until transaction is completed
                            </p>
                        }
                        showCloseButton={false}
                    />
                </>
            )}

            {errorHandler.status && (
                <Modal
                    content={
                        <SuccessContent
                            responseType={'error'}
                            responseTexts={errorHandler.message}
                        />
                    }
                    showCloseButton={true}
                    onclick={() => setErrorHandler(false)}
                />
            )}
        </>
    );
};

export { PrintStandardSlip };
