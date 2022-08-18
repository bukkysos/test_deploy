import axios from 'axios';

import { getBenefactors } from './benefactors';

var sha512 = require('js-sha512');
const generateRemitaRRR = async (amount, reference, user, description, payersName) => {
    const email = 'mobileid@nimc.gov.ng';
    var d = new Date();

    const apiKey = window.location.host.includes('localhost') ? '1946' : '193664733';
    const merchantId = window.location.host.includes('localhost') ? '2547916' : '6385767922';
    const serviceTypeId = window.location.host.includes('localhost') ? '4430731' : '6493110142';

    // const apiKey = '193664733';
    // const merchantId = '6385767922';
    // const serviceTypeId = '6493110142';

    const orderId = d.getTime();
    const payerName = `${payersName}`;
    const payerEmail = email;
    const amt = String(amount);
    const consumerToken = sha512(merchantId + serviceTypeId + orderId + amt + apiKey);

    const url = window.location.host.includes('localhost')
        ? 'https://remitademo.net/remita/exapp/api/v1/send/api/echannelsvc/merchant/api/paymentinit?callback=jsonp'
        : 'https://login.remita.net/remita/exapp/api/v1/send/api/echannelsvc/merchant/api/paymentinit?callback=jsonp';

    // const url =
    //     'https://login.remita.net/remita/exapp/api/v1/send/api/echannelsvc/merchant/api/paymentinit?callback=jsonp';

    const requestData = {
        serviceTypeId: serviceTypeId,
        amount: amt,
        orderId: orderId,
        payerName: payerName,
        payerEmail: payerEmail,
        description: description,
        lineItems: getBenefactors(amt)
    };

    const config = {
        headers: {
            dataType: 'json',
            'Content-Type': 'application/json',
            Authorization: `remitaConsumerKey=${merchantId},remitaConsumerToken=${consumerToken}`
        }
    };

    try {
        const req = await axios.post(url, requestData, config);
        let RRR;
        const f = new Function('jsonp', `${req.data}`);
        f(function (ref) {
            RRR = ref.RRR;
        });
        return RRR;
    } catch (err) {
        return err;
    }
};
export { generateRemitaRRR };
