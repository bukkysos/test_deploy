import "./printPremium.css";
import axios from "axios";
import jsSHA from 'jssha';
import jwt_decode from "jwt-decode";
import { BASE_URL } from "../../../config";
import { useHistory } from "react-router-dom";
import { AppContext } from "../../../appContext";
import { hex_rmd160 } from '../../../config/hex-ripe';
import { Modal, SuccessContent } from "../../../components";
import { generateRemitaRRR } from "../../../application/paymentHandler";
import React, { useContext, useEffect, useState, useRef } from "react";
import { PremiumPrintCard, PremiumCardButton } from "../../../components/card/premiumPrintCard";

const PrintPremiumSlip = () => {
  let message = useRef("An Error occured! Please try again!");
  const [context, setContext] = useContext(AppContext);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkLoading, setCheckLoading] = useState(false);
  const [errorHandler, setErrorHandler] = useState(false)

  const accessToken = localStorage.getItem("accessToken");
  const jwt_code = localStorage.getItem("data");
  const history = useHistory()

  if (jwt_code && accessToken) {
    var jwt_data = jwt_decode(jwt_code);
  }

  useEffect(() => {
    setContext(modal);
    generateHash(jwt_data);
  }, [modal, setContext, jwt_data]);

  useEffect(() => {
    setContext(errorHandler);
  }, [errorHandler, setContext]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://login.remita.net/payment/v1/remita-pay-inline.bundle.js";
    script.async = true;
    script.onload = () => console.log("Loaded...");
    document.body.appendChild(script);
  }, []);

  let generateHash = ({ fn, mn, sn, nin } ) => {
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
  }

  const remitaPayload = {
    user: jwt_data?.userid,   
    amount: 1039.38,
    reference: "0000",
    payersName: `${jwt_data.fn} ${jwt_data.sn}`,
    plan: "",
    paid: false,
    purchasedCredits: 0,
    key: process.env.REACT_APP_REMITA_PUBLIC_KEY,
  };
  const { amount, user, key, payersName, reference } = remitaPayload;

  const checkPaymentStatus = () => {
    setCheckLoading(true);
    axios({
      method: "get",
      url: `${BASE_URL}nimcSlip/download?userID=${jwt_data.userid}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        if (response.data.success) {
          localStorage.setItem("paymentResponse", JSON.stringify({
              txRef: '',
              service: 2,
              status: true,
              action: 'print',
              h: jwt_data?.h,
            }));
        } else {
          localStorage.setItem("paymentResponse", JSON.stringify({
              txRef: '',
              service: 3,
              status: false,
              action: 'pending'
            }));
        }
        setCheckLoading(false); 
        return history.push(`/payment-response`);
      })
      .catch((exception) => {
        setErrorHandler(true);
       return setCheckLoading(false);
      });
  }



  const saveSlipForDownload = (userID) => {
    axios({
      method: "post",
      url: `${BASE_URL}nimcSlip/CN`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
          userID: userID,
          service: 2
        },
    })
      .then((response) => {
       // need to rethink what happens when response is false due payment 
       //record previously existing
      })
      .catch((exception) => {
        setErrorHandler(true);
        return setLoading(false);
      });
  }


  const premiumNinSlip = () => {
    setLoading(true);
    axios({
      method: "get",
      url: `${BASE_URL}nimcSlip/premium?userID=${jwt_data.userid}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        if (response.data.success) {
          setModal(true)
          setTimeout(() => {
            initRemita()
            setModal(false)
          }, 4000);
        } else {
          setModal(false)
          setErrorHandler(true)
          setLoading(false);
        }
      })
      .catch((error) => {
        setModal(false)
        setErrorHandler(true)
        setLoading(false);
      });
  }



  const initRemita = async () => {
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
      // card charged successfully, get reference here
      if (response) {
        const paymentReference = generatePaymentReference(
          response.transactionId
        );
        saveSlipForDownload(user)
        createPaymentLog(paymentReference);
      } else {
        setErrorHandler(true)
        setLoading(false);
      }
    };

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
        return onPaySuccess(response);
      },
      onError: function (response) {
        setErrorHandler(true)
        setLoading(false);
        return onError(response);
      },
      onClose: function () {
        setLoading(false)
      },
    });
    remitaPaymentEngine.showPaymentWidget();
  };

  const generatePaymentReference = (transactionId) => {
    return `NINSLIP-${transactionId}`;
 
  };

  return (
    <>
      <div className={`${modal || errorHandler ? "blur" : ""} ${context ? "" : ""}`}>
        <h3 className="tab_page_title mx-auto">Print Premium NIN Slip</h3>
        <p className="mx-auto tab_page_subtitle">
          Your NIN slip serves as a legal tender throughout the Federal Republic of Nigeria, and is backed by law.
        </p>

        <div className="col-12 d-flex justify-content-center print_premium_card px-4">
          <PremiumPrintCard onclick={() => premiumNinSlip()} loading={loading} />
        </div>
        <div className="col-12 d-flex justify-content-center print_premium_card px-4">
          <PremiumCardButton onclick={() => checkPaymentStatus()} loading={checkLoading} />
        </div>
      </div>
      {modal && (
        <>
          <Modal
            content={<p className={"m-4 text-center"}>Please do not leave page until transaction is completed</p>}
            showCloseButton={false}
          />
        </>
      )}

      {errorHandler &&
        <Modal
          content={
            <SuccessContent
              responseType={"error"}
              responseTexts={message.current}
            />
          }
          showCloseButton={true}
          onclick={() => setErrorHandler(false)}
        /> 
      }
    </>
  );
};

export { PrintPremiumSlip };
