import React from "react";
import { LoadingIcon, StandardCardPreview } from "../../../assets";
import { Card, CheckPaymentCard } from "../card";
import "./standardPrintCard.css";
const PrintStandardCard = ({ onclick, loading}) => {
  return (
    <>
      <Card>
        <div className={`standard_print_card_image mx-auto`}>
          <img src={StandardCardPreview} alt="NIN Slip" />
        </div>
        <p className="mx-auto standard_print_card_description mb-4 text-center">
        Click below to print improved NIN Slip
        </p>

        <span className="standard_print_card_credits mx-auto"> ₦ 400.00</span>

        <div className="standard_print_card_button mx-auto">
          <button
            type="button"
            className="button mt-4 mx-auto mb-3"
            disabled={loading}
            onClick={(e) => onclick(e)} >

<span>
              {loading ? (
                <span>
                  <>
                    <span className="mr-2 btn_loading">
                      <LoadingIcon fill={"#fff"}/>{" "}
                    </span>
                    {"Pay with Remita"}
                  </>
                </span>
              ) : (
                "Pay with Remita"
              )}
            </span>
          </button>
        </div>
      </Card>
    </>
  );
};

export const StandardCardButton = ({ onclick, loading }) => {
  return (
    <>
      <CheckPaymentCard>
        <p>I have already paid</p>
        <div className="check_payment_button">
          <button
            type="button"
            className="button mt-1 mx-auto mb-1"
            disabled={loading}
            onClick={(e) => onclick(e)}
          >
            <span>
              {loading ? (
                <span>
                  <>
                    <span className="mr-2 btn_loading">
                      <LoadingIcon fill={"#fff"}/>{" "}
                    </span>
                    {"Checking Status"}
                  </>
                </span>
              ) : (
                "Check Status"
              )}
            </span>
          </button>
        </div>
      </CheckPaymentCard>
    </>
  );
};

export { PrintStandardCard };
