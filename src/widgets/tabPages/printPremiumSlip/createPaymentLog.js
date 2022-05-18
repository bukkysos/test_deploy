import axios from 'axios';
import { BASE_URL } from '../../../config';

export const createPaymentLog = (
    paymentReference,
    // userID,
    // txRef,
    rrr,
    successCallack
    // errorCallback
) => {
    setModal(true);
    axios({
        method: 'post',
        url: `${BASE_URL}nimcSlip/paymentLog`,
        data: {
            userID: jwt_data.userid,
            txRef: paymentReference,
            rrr: rrr,
            service: 2
        },
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
        .then((response) => {
            successCallack();
            setModal(false);
            if (response.data.success) {
                localStorage.setItem(
                    'paymentResponse',
                    JSON.stringify({
                        txRef: paymentReference,
                        service: 2,
                        h: jwt_data?.h,
                        status: true,
                        action: 'success'
                    })
                );
                history.push(`/payment-response`);
            } else {
                setErrorHandler(true);
                setLoading(false);
            }
        })
        .catch(() => {
            setErrorHandler(true);
            setLoading(false);
        });
};
