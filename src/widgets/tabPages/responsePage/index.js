import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { BASE_URL } from '../../../config';
import React, { useState, useRef } from 'react';
import { ResponseCard } from '../../../components';
// import { useHistory, useParams } from 'react-router-dom';
import { Modal, SuccessContent } from '../../../components';
import jsSHA from 'jssha';
import { hex_rmd160 } from '../../../config/hex-ripe';

const ResponsePage = () => {
    let message = useRef('An Error occured! Please try again!');
    //   const history = useHistory();
    //   const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [errorHandler, setErrorHandler] = useState(false);
    const accessToken = localStorage.getItem('accessToken');

    const jwt_code = localStorage.getItem('data');
    const paymentResponse = JSON.parse(localStorage.getItem('paymentResponse'));
    const { service, status, h, action } = paymentResponse;

    if (jwt_code && accessToken) {
        var jwt_data = jwt_decode(jwt_code);
    }

    // if (id === undefined || id === "" || id !== txRef) {
    //     history.goBack()
    // }

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
        let url = `https://slipserver1.nimc.gov.ng/ijebu?h=${generateHash(jwt_data)}&p=1&type=${
            service === 1 ? 'ninslip' : 'pns'
        }`;
        var element = document.createElement('a');
        element.setAttribute('href', url);
        element.setAttribute('download', `${h}.pdf`);
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const checkPaymentStatus = () => {
        setLoading(true);
        axios({
            method: 'get',
            url: `${BASE_URL}nimcSlip/download?userID=${jwt_data.userID}`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then((response) => {
                if (response.data.success) {
                    setLoading(false);
                    download();
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

                <div className="col-12 print_standard_slip d-flex justify-content-center px-4">
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
