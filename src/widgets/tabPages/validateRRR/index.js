import React, { useRef, useState } from 'react';
import axios from 'axios';
import jsSHA from 'jssha';
import { useHistory } from 'react-router-dom';
import { hex_rmd160 } from '../../../config/hex-ripe';
import { RRRResponseCard } from '../../../components/card/rrrResponseCard';
import { ValidateRRRCard } from '../../../components/card/validateRRRCard';
import { ciEncrypt } from '../../../config/utils/red';
import { BASE_URL } from '../../../config';

export const ValidateRRR = () => {
    let message = useRef('An Error occured! Please try again!');
    const [userData, setUserData] = useState({});
    const [response, setResponse] = useState({ status: false, responseText: '', filterParams: '' });
    const history = useHistory();

    const [paymentData, setPaymentData] = useState({
        action: '',
        status: false,
        service: 1,
        rrr: ''
    });

    const { action, status, service } = paymentData;

    const getResponse = (status, responseText, filterParams) => {
        setResponse({ status, responseText, filterParams });
    };

    let ciDT = ciEncrypt.getItem('ciDT');

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
        if (userData) {
            let url = `https://slipserver1.nimc.gov.ng/ijebu?h=${generateHash(userData)}&p=1&type=${
                service === 1 ? 'ninslip' : 'pns'
            }`;
            var element = document.createElement('a');
            element.setAttribute('href', url);
            element.setAttribute('download', `${userData.h}.pdf`);
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        }
    };

    const checkPaymentStatus = () => {
        if (userData.userid) {
            axios({
                method: 'get',
                url: `${BASE_URL}nimcSlip/download?userID=${userData.userid}`,
                headers: {
                    Authorization: `Bearer ${ciDT}`
                }
            })
                .then((response) => {
                    if (response.data.success && paymentData.action === 'print') {
                        download();
                    } else {
                        message.current = response.data.message;
                    }
                })
                .catch((error) => {
                    message.current = error.tostring();
                });
        }
    };

    return (
        <>
            <div className={``}>
                <h3 className="tab_page_title mx-auto">Validate RRR</h3>
                <p className="mx-auto tab_page_subtitle">
                    Did you make an offline payment? Please input your Remita Retrivial Reference
                    below to validate your payment.
                </p>

                <div className="col-12 print_standard_slip d-flex justify-content-center px-4">
                    {response.responseText ? (
                        <RRRResponseCard
                            reload={() => history.push('/premium-slip')}
                            onclick={action === 'print' ? download : checkPaymentStatus}
                            action={action}
                            status={status}
                            serviceType={service}
                            errorText={response.responseText}
                        />
                    ) : (
                        <ValidateRRRCard
                            buttonText={'Validate Payment'}
                            getResponse={getResponse}
                            getValidationData={(validationData) =>
                                setPaymentData({
                                    action: validationData.action,
                                    status: validationData.status,
                                    service: validationData.service,
                                    rrr: validationData.rrr
                                })
                            }
                            getUserData={(values) => setUserData(values)}
                        />
                    )}
                </div>
            </div>
        </>
    );
};
