import axios from 'axios';
import React from 'react';
import { generateRemitaRRR } from '../../application/paymentHandler';

export const initializeRemita = async (
    {
        remitaAmount, narration,
        returnOnPaySuccess = () => { },
        // onClose = () => { },
        // onError = () => { }
    }
) => {

    const accessToken = localStorage.getItem("accessToken");
    const jwt_code = localStorage.getItem("data");
    // const history = useHistory()

    if (jwt_code && accessToken) {
        var jwt_data = jwt_decode(jwt_code);
    }

    const remitaPayload = {
        user: jwt_data?.userid,
        amount: remitaAmount,
        reference: "0000",
        payersName: `${jwt_data.fn} ${jwt_data.sn}`,
        plan: "",
        paid: false,
        purchasedCredits: 0,
        key: process.env.REACT_APP_REMITA_PUBLIC_KEY,
    };

    const { amount, user, key, payersName, reference } = remitaPayload;

    const amt = String(amount);
    const description = "Premium NIN Slip";
    const rrr = await generateRemitaRRR(
        amt,
        reference,
        user,
        description,
        payersName
    );

    const onError = (response) => {
        if (response) {
            setLoading(false)
        }
    };

    const onPaySuccess = (response) => {
        if (response) {
            const paymentReference = generatePaymentReference(
                response.transactionId
            );
            createPaymentLog(paymentReference);
        }
    }

    const createPaymentLog = (paymentReference) => {
        setModal(true);
        axios({
            method: "post",
            url: `${BASE_URL}nimcSlip/paymentLog`,
            data: {
                userID: jwt_data.userid,
                txRef: paymentReference,
                rrr: rrr,
                service: 2,
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then((response) => {
                setModal(false)
                if (response.data.success) {
                    localStorage.setItem("paymentResponse", JSON.stringify({
                        txRef: paymentReference,
                        service: 2,
                        h: jwt_data?.h,
                        status: true,
                        action: 'success'
                    }));
                    history.push(`/payment-response`)
                } else {
                    setErrorHandler(true)
                    setLoading(false);
                }
            })
            .catch((exception) => {
                setErrorHandler(true)
                setLoading(false);
            });
    };

    const remitaPaymentEngine = window.RmPaymentEngine.init({
        key: key,
        firstName: `${jwt_data.fn}`,
        lastName: `${jwt_data.sn}`,
        narration: "Premium NIN slip",
        amount: amount,
        transactionId: "",
        processRrr: true,
        extendedData: {
            customFields: [
                {
                    name: "rrr",
                    value: rrr,
                },
            ],
        },

        onSuccess: function (response) {
            // return onPaySuccess(response);
            onPaySuccess(response)
            console.log(response, "RmPaymentEngine success")
        },
        onError: function (response) {
            // setErrorHandler(true)
            // setLoading(false);
            // return onError(response);
            console.log(response, "RmPaymentEngine error")
        },
        onClose: function () {
            // setLoading(false)
            console.log("RmPaymentEngine close")
        },
    });
    remitaPaymentEngine.showPaymentWidget();

}

const generatePaymentReference = (transactionId) => {
    return `NINSLIP-${transactionId}`;
};
