import React, { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { RadioIcon } from "../../../assets";
import { Button, Modal, SuccessContent } from "../../../components";
import "./purchaseSubscription.css";
import axios from "axios";
import { BASE_URL } from "../../../config";
import { generateRemitaRRR } from "../../../application/paymentHandler";

const PurchaseSubscription = () => {
  const [userPlan, setPlan] = useState("Individual");
  const [loading, setLoading] = useState(false);
  const [modal, showModal] = useState(false)
  const accessToken = localStorage.getItem("accessToken");
  const jwt_code = localStorage.getItem("data");

  const [error, setError] = useState(false);

  if (jwt_code && accessToken) {
    var jwt_data = jwt_decode(jwt_code);
  }

  const remitaPayload = {
    user: jwt_data?.userid,
    amount: 5227.26,
    reference: "0000",
    payersName: `${jwt_data?.fn} ${jwt_data?.sn}`,
    plan: "",
    paid: false,
    purchasedCredits: jwt_data?.availablecredit,
    key: process.env.REACT_APP_REMITA_PUBLIC_KEY,
  };

  const { amount, user, key, payersName, reference } = remitaPayload;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://login.remita.net/payment/v1/remita-pay-inline.bundle.js";
    script.async = true;
    script.onload = () => document.body.appendChild(script);
  }, []);

  const initRemita = async () => {
    setLoading(true);
    const amt = String(amount);
    const description = "Standard NIN Slip";

    const rrr = await generateRemitaRRR(
      amt,
      reference,
      user,
      description,
      payersName
    );
    const onError = (response) => {
      if (response) {
        setError(true);
      }
    };

    const onPaySuccess = (response) => {
      // card charged successfully, get reference here
      if (response) {
        const paymentReference = generatePaymentReference(
          response.transactionId
        );
        purchaseSubscription(paymentReference);
      }
    };

    const remitaPaymentEngine = window.RmPaymentEngine.init({
      key: key,
      firstName: `${jwt_data.fn}`,
      lastName: `${jwt_data.sn}`,
      narration: "Purchase Plan",
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
        setLoading(false);
        return onError(response);
      },
      onClose: function () {
        setLoading(false);
      },
    });

    remitaPaymentEngine.showPaymentWidget();
  };

  const generatePaymentReference = (transactionId) => {
    const value = `SUBSCRIPTION-${transactionId}`;
    return value;
  };

  const purchaseSubscription = async (paymentReference) => {
    await axios({
      method: "post",
      url: `${BASE_URL}credit/buySubscription?userID=${jwt_data?.userid}&txRef=${paymentReference}&servicePlan=Individual`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        setLoading(false);
        setError(false);
        showModal(true)
      })
      .catch((error) => {
        setLoading(false);
        showModal(true)
        setError(true);
      });
  };

  return (
    <>
      <h3 className={`tab_page_title mx-auto`}>
        Purchase Service Plan
      </h3>
      <p className="mx-auto tab_page_subtitle">
        When you purchase verification credits, you can verify the identity of
        anyone simply by the touch of a button.
      </p>

      <div className="col-12 d-flex justify-content-center flex-row subsciption_plans">
        {
          <>
            <div className="col-12 d-flex justify-content-center subsciption_plans">
              <div
                className={`plans p-0 align-self-${userPlan === "individual" ? "end" : "end"
                  }`}
              >
                <div
                  className={`individual_plan my-auto d-flex justify-content-between px-2 ${userPlan === "Individual" ? "active_plan" : ""
                    }`}
                  onClick={() => setPlan("Individual")}
                >
                  <div className="d-flex justify-content-between individual_plan_content my-auto">
                    {userPlan === "Individual" ? (
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
            buttonText={"Pay with Remita"}
            onButtonClick={() => initRemita()}
            loading={loading}
          />
        </div>
      </div>
      {
        modal ?
          <Modal
            content={
              <SuccessContent
                responseType={error ? "error" : "success"}
                responseTexts={error ? "An error occured! Please try again!" : "Service plan purchase successful!"}
              />
            }
            showCloseButton={true}
            onclick={() => {
              showModal(false);
              setError(false)
            }
          }
          /> :
          <></>
      }
    </>
  );
};

export { PurchaseSubscription };
