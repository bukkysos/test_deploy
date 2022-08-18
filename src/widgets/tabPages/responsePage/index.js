import axios from 'axios';
import { BASE_URL } from '../../../config';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ResponseCard } from '../../../components';
import { useParams, useHistory } from 'react-router-dom';
import { Modal, SuccessContent } from '../../../components';
import jsSHA from 'jssha';
import { hex_rmd160 } from '../../../config/hex-ripe';
import { ciEncrypt, decryptAndDecode } from '../../../config/utils/red';

const ResponsePage = () => {
    let message = useRef('An Error occured! Please try again!');
    const history = useHistory();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [errorHandler, setErrorHandler] = useState(false);
    const [jwt_data, setData] = useState({});
    const [dependentData, setDependentData] = useState({});

    const paymentResponse = JSON.parse(localStorage.getItem('paymentResponse'));
    const { service, status, h, action } = paymentResponse;

    let ciDT = ciEncrypt.getItem('ciDT');

    const handleKey = useCallback(async () => {
        let { data } = await ciEncrypt.getItem('ciDD');
        let userData = await decryptAndDecode(data);
        setData(userData);
    }, [ciEncrypt]);

    const getUserIdFromHistoryState = useCallback(() => {
        if (history.location.state !== undefined) {
            setDependentData(history?.location?.state?.dependentData);
        }
    }, [history.location.state]);

    useEffect(() => {
        getUserIdFromHistoryState();
    }, [getUserIdFromHistoryState]);

    useEffect(() => {
        handleKey();
    }, [handleKey]);

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

    let download = () => {
        if (jwt_data) {
            let url = `https://slipserver1.nimc.gov.ng/ijebu?h=${
                dependentData.fn ? generateHash(dependentData) : generateHash(jwt_data)
            }&p=1&type=${service === 1 ? 'ninslip' : 'pns'}`;
            var element = document.createElement('a');
            element.setAttribute('href', url);
            element.setAttribute('download', `${h}.pdf`);
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        }
    };

    const checkPaymentStatus = () => {
        setLoading(true);
        axios({
            method: 'get',
            url: `${BASE_URL}nimcSlip/download?userID=${id ? id : jwt_data.userid}`,
            headers: {
                Authorization: `Bearer ${ciDT}`
            }
        })
            .then((response) => {
                if (response.data.success) {
                    setLoading(false);
                    download();
                    // localStorage.removeItem('paymentResponse');
                } else {
                    message.current = response.data.message;
                    setLoading(false);
                    setErrorHandler(true);
                }
            })
            .catch((error) => {
                message.current = error.tostring();
                setErrorHandler(true);
                setLoading(false);
            });
    };

    return (
        <>
            <div className="">
                <h3 className="tab_page_title mx-auto">
                    Print {service === 1 ? 'Standard' : service === 2 ? 'Premium' : ''} NIN Slip
                </h3>
                <p className="mx-auto tab_page_subtitle">
                    Your NIN slip serves as a legal tender throughout the Federal Republic of
                    Nigeria, and is backed by law.
                </p>

                <div className="col-12 print_standard_slip d-flex justify-content-center flex-column align-items-center px-4">
                    <ResponseCard
                        action={action}
                        status={status}
                        serviceType={service}
                        loading={loading}
                        onclick={action === 'print' ? download : checkPaymentStatus}
                    />
                </div>
            </div>
            {errorHandler && (
                <Modal
                    content={
                        <SuccessContent responseType={'error'} responseTexts={message.current} />
                    }
                    showCloseButton={true}
                    onclick={() => setErrorHandler(false)}
                />
            )}
        </>
    );
};

export default ResponsePage;
