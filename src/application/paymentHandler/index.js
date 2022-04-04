import axios from "axios";

import { getBenefactors } from "./benefactors";

var sha512 = require("js-sha512");
const generateRemitaRRR = async (amount, reference, user, description, payersName) => {
  const email = "mobileid@nimc.gov.ng";
  var d = new Date();

//   const apiKey = "1946";
// const merchantId = "2547916";
// const serviceTypeId = "4430731";
  const apiKey = "193664733";
  const merchantId = "6385767922";
  const serviceTypeId = "6493110142";
  const orderId = d.getTime();
  const payerName = `${payersName}`;
  const payerEmail = email;
  const amt = String(amount);
  const consumerToken = sha512(
    merchantId + serviceTypeId + orderId + amt + apiKey
  );

  const url = "https://login.remita.net/remita/exapp/api/v1/send/api/echannelsvc/merchant/api/paymentinit?callback=jsonp";
    //"https://remitademo.net/remita/exapp/api/v1/send/api/echannelsvc/merchant/api/paymentinit?callback=jsonp"

    //


  const requestData = {
    serviceTypeId: serviceTypeId,
    amount: amt,
    orderId: orderId,
    payerName: payerName,
    payerEmail: payerEmail,
    description: description,
    lineItems: getBenefactors(amt),
  };


  const config = {
    headers: {
      dataType: "json",
      "Content-Type": "application/json",
      Authorization: `remitaConsumerKey=${merchantId},remitaConsumerToken=${consumerToken}`,
    },
  };

  try {
    const req = await axios.post(url, requestData, config);
    let RRR;
    const f = new Function("jsonp", `${req.data}`);
    f(function (ref) {
      RRR = ref.RRR;
    });
    return RRR;
  } catch (err) {
    return err;
  }
};
export { generateRemitaRRR };
