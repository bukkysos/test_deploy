import React, { useCallback, useEffect, useState } from 'react';
import { RadioIcon } from '../../../assets';
import { Button, Modal, SuccessContent } from '../../../components';
import './purchaseSubscription.css';
import axios from 'axios';
import { BASE_URL } from '../../../config';
import { generateRemitaRRR } from '../../../application/paymentHandler';
import { ciEncrypt, decryptAndDecode } from '../../../config/utils/red';
import { getCreditInfo } from './utility/getCreditInfo';

const PurchaseSubscription = () => {
    const [userPlan, setPlan] = useState('Individual');
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);
    const [modal, showModal] = useState(false);
    const [error, setError] = useState(false);

    let ciDT = ciEncrypt.getItem('ciDT');

    const handleKey = useCallback(async () => {
        let { data } = await ciEncrypt.getItem('ciDD');
        let userData = await decryptAndDecode(data);
        setData(userData);
    }, [ciEncrypt]);

    useEffect(() => {
        handleKey();
    }, [handleKey]);

    const remitaPayload = {
        user: data?.userID,
        amount: 5227.26,
        reference: '0000',
        payersName: `${data?.fn} ${data?.sn}`,
        plan: '',
        paid: false,
        purchasedCredits: data?.availablecredit,
        key: process.env.REACT_APP_REMITA_PUBLIC_KEY
    };

    const { amount, user, key, payersName, reference } = remitaPayload;

    useEffect(() => {
        const script = document.createElement('script');

        script.src = window.location.host.includes('localhost')
            ? 'https://remitademo.net/payment/v1/remita-pay-inline.bundle.js'
            : 'https://login.remita.net/payment/v1/remita-pay-inline.bundle.js';

        script.async = true;
        script.onload = () => document.body.appendChild(script);
    }, []);

    const initRemita = async () => {
        setLoading(true);
        const amt = String(amount);
        const description = 'Standard NIN Slip';

        const rrr = await generateRemitaRRR(amt, reference, user, description, payersName);
        const onError = (response) => {
            if (response) {
                setError(true);
            }
        };

        const onPaySuccess = (response) => {
            // card charged successfully, get reference here
            if (response) {
                const paymentReference = generatePaymentReference(response.transactionId);
                purchaseSubscription(rrr);
            }
        };

        const remitaPaymentEngine = window.RmPaymentEngine.init({
            key: key,
            firstName: `${data.fn}`,
            lastName: `${data.sn}`,
            narration: 'Purchase Plan',
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
        const value = `SUBSCRIPTION-${transactionId}`;
        return value;
    };

    const purchaseSubscription = async (rrr) => {
        await axios({
            method: 'get',
            url: `${BASE_URL}credit/buySubscription?userID=${data?.userid}&RRR=${rrr}&servicePlan=Individual`,
            headers: {
                Authorization: `Bearer ${ciDT}`
            }
        })
            .then((response) => {
                if (response.data.success) {
                    setLoading(false);
                    setError(false);
                    showModal(true);
                    getCreditInfo(data?.userid, ciDT);
                }
            })
            .catch(() => {
                setLoading(false);
                showModal(true);
                setError(true);
            });
    };

    return (
        <>
            <h3 className={`tab_page_title mx-auto`}>Purchase Service Plan</h3>
            <p className="mx-auto tab_page_subtitle">
                When you purchase verification credits, you can verify the identity of anyone simply
                by the touch of a button.
            </p>

            <div className="col-12 d-flex justify-content-center flex-row subsciption_plans">
                {
                    <>
                        <div className="col-12 d-flex justify-content-center subsciption_plans">
                            <div
                                className={`plans p-0 align-self-${
                                    userPlan === 'individual' ? 'end' : 'end'
                                }`}
                            >
                                <div
                                    className={`individual_plan my-auto d-flex justify-content-between px-2 ${
                                        userPlan === 'Individual' ? 'active_plan' : ''
                                    }`}
                                    onClick={() => setPlan('Individual')}
                                >
                                    <div className="d-flex justify-content-between individual_plan_content my-auto">
                                        {userPlan === 'Individual' ? (
                                            <span className="plan_radio_icon my-auto">
                                                <RadioIcon />
                                            </span>
                                        ) : (
                                            <input
                                                type="radio"
                                                className="PAYG_radio my-auto"
                                                name="PAYG"
                                                value="PAYG"
                                            />
                                        )}
                                        <div className="plan_texts pt-1">
                                            <p className="p-0 my-auto">Individual Plan</p>
                                            <p className="my-auto">Save 9%</p>
                                        </div>
                                    </div>
                                    <p className="p-0 my-auto">₦5,000.00</p>
                                </div>
                                <div className="purchase_subscription_table table-responsive p-0 m-0">
                                    <table className="table table-striped">
                                        <tbody>
                                            <tr>
                                                <td className="">Credits</td>
                                                <td className="text-right">50</td>
                                            </tr>
                                            <tr>
                                                <td className="">Bonus</td>
                                                <td className="text-right">5</td>
                                            </tr>
                                            <tr>
                                                <td className="">Total</td>
                                                <td className="text-right">55</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </>
                }
            </div>

            <div className="d-flex justify-content-center mt-5 ">
                <div className="plan_button">
                    <Button
                        buttonText={'Pay with Remita'}
                        onButtonClick={() => initRemita()}
                        loading={loading}
                    />
                </div>
            </div>
            {modal ? (
                <Modal
                    content={
                        <SuccessContent
                            responseType={error ? 'error' : 'success'}
                            responseTexts={
                                error
                                    ? 'An error occured! Please try again!'
                                    : 'Service plan purchase successful!'
                            }
                        />
                    }
                    showCloseButton={true}
                    onclick={() => {
                        showModal(false);
                        setError(false);
                    }}
                />
            ) : (
                <></>
            )}
        </>
    );
};

export { PurchaseSubscription };
