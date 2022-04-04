import React, { useCallback, useContext, useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
  AppContext,
  NavContext,
  // IdContext
} from "../../../appContext";
import jwt_decode from "jwt-decode";
import {
  Button,
  HomeCard,
  Input,
  Modal,
  PrintCardPreview,
  ProfileDetails,
  ProfileSidebar,
  RemitaModal,
  SelectInput,
  SuccessContent,
} from "../../../components";
import { LinkMobile, Print } from "../../../assets";
import "./singleDependent.css";
import { BASE_URL } from "../../../config";
import axios from "axios";
import { generateRemitaRRR } from "../../../application/paymentHandler";
import OtpInput from "react-otp-input";

const SingleDependent = () => {
  const [context, setContext] = useContext(AppContext);
  const [headerIconDisplay, setHeaderIconDisplay] = useContext(NavContext);
  const [modal, setModal] = useState(false);
  const [noticeModal, setNoticeModal] = useState(false);

  const [primary, handlePrimaryButton] = useState("");
  const [responseData, setResponseData] = useState([]);
  const [normalInputVal, setNormalInputVal] = useState("");
  const [otpInputVal, setOTPInputVal] = useState("");
  const [numberLinked, setNumberLinked] = useState(false);
  const [error, setError] = useState(false);
  const [ninSlipError, setNinSlipError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [verificationError, setVerificationError] = useState(null);
  const [single_nav, setSingle_nav] = useState("quick_action");
  const [tabIndex, setTabIndex] = useState(0);
  const [deviceInfo, setDeviceInfo] = useState([]);
  const [printModal, showPrintModal] = useState(false);
  const [cardType, setCardType] = useState("");
  const [btnloading, setBtnLoading] = useState(false);
  const [profileBtnloading, setProfileBtnLoading] = useState(false);

  const [premiumLoading, setPremiumLoading] = useState(false);
  const [standardLoading, setStandardLoading] = useState(false);
  const [addNumberLoading, setAddNumberLoading] = useState(false);
  const [profileModal, setProfileModal] = useState(false);
  const [selectedState, setSelectedSate] = useState("");
  const { id } = useParams();

  const history = useHistory();

  const { index } = history.location.state;

  const accessToken = localStorage.getItem("accessToken");
  const jwt_code = localStorage.getItem("data");

  if (jwt_code && accessToken) {
    var jwt_data = jwt_decode(jwt_code);
  }

  const states = [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "FCT",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
  ];

  const profileData = [
    {
      leftData: [
        "USER ID",
        "NIN",
        "FIRST NAME",
        "MIDDLE NAME",
        "LAST NAME",
        "GENDER",
        "DATE OF BIRTH",
        "NATIONALITY",
      ],
      rightData: [
        responseData?.userid,
        responseData?.nin,
        responseData?.fn,
        responseData?.mn,
        responseData?.sn,
        responseData?.g === "F"
          ? "FEMALE"
          : responseData?.g === "M"
            ? "MALE"
            : "NA",
        responseData?.icao,
        responseData?.n,
      ],
      primaryButtonText: "Request Profile Update",
      contentType: null,
    },

    deviceInfo.map((info, i) => {
      return {
        idNumber: info.idNumber,
        mobile: info.MSISDN,
        status: info.deviceStatus,
        primaryButtonText: "Link Mobile Number",
        contentType: "table",
        routeTo: "/link-number",
      };
    }),
  ];

  useEffect(() => {
    setHeaderIconDisplay(true);
  }, [setHeaderIconDisplay]);

  useEffect(() => {
    setContext(modal);
  }, [modal, setContext]);

  useEffect(() => {
    setContext(profileModal);
  }, [profileModal, setContext]);

  useEffect(() => {
    setContext(printModal);
  }, [printModal, setContext]);

  useEffect(() => {
    axios({
      method: "get",
      url: `${BASE_URL}utility/myDependents?parentNin=${jwt_data?.nin}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        setResponseData(() => response.data.data[index]);
      })
      .catch((error) => {
        return;
      });
  }, [index, jwt_data?.nin, accessToken]);

  useEffect(() => {
    if (tabIndex === 1) {
      if (deviceInfo && Object.keys(deviceInfo).length !== 0) {
      } else {
        axios({
          method: "get",
          url: `${BASE_URL}device/getMobileNumbers?userID=${id}`,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
          .then((response) => {
            setDeviceInfo(response.data.data);
          })
          .catch((error) => {
            return;
          });
      }
    }
  }, [tabIndex, accessToken, id, deviceInfo]);

  // Payment
  const [paymentError, setPaymentError] = useState("");

  const remitaPayload = {
    user: responseData?.userid,
    reference: "0000",
    payersName: `${responseData?.fn} ${responseData?.sn}`,
    plan: "",
    paid: false,
    purchasedCredits: jwt_data?.availablecredit,
    key: process.env.REACT_APP_REMITA_PUBLIC_KEY,
  };

  const { user, key, payersName, reference } = remitaPayload;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://login.remita.net/payment/v1/remita-pay-inline.bundle.js";
    script.async = true;
    script.onload = () => document.body.appendChild(script);
  }, []);

  const validPhonePattern = /^0\d{10}$/;

  const validatePhoneNumberOnChange = (numberVal) => {
    if (isNaN(numberVal)) {
      return;
    } else if (normalInputVal.length === 12) {
      return;
    }
    setNormalInputVal(numberVal);
  };

  const validateOnBlur = () => {
    if (!validPhonePattern.test(normalInputVal)) {
      setError(true);
    }
  };

  // Hit this endpoint with phone number to get OTP
  const sendOTP = () => {
    if (
      normalInputVal === "" ||
      normalInputVal.length < 11 ||
      normalInputVal.length > 11 ||
      isNaN(parseInt(normalInputVal))
    ) {
      setError(true);
      setErrorText("Invalid Number");
      return;
    }
    setAddNumberLoading(true);
    setBtnLoading(true);
    setError(false);

    axios({
      method: "post",
      url: `${BASE_URL}utility/sendOTP`,
      data: {
        userID: jwt_data?.userid,
        mobile: normalInputVal,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        setBtnLoading(false);
        handlePrimaryButton("change");
        setAddNumberLoading(false);
      })
      .catch((error) => {
        setBtnLoading(false);
        setAddNumberLoading(false);
      });
  };

  // Hit this endpoint with OTP to add number
  const addNumber = () => {
    setBtnLoading(true);

    if (otpInputVal === "" || otpInputVal.length !== 6) {
      setError(true);
      setErrorText("Ensure OTP is entered correctly");
      return setBtnLoading(false);
    }

    axios({
      method: "post",
      url: `${BASE_URL}utility/addMobileNumber`,
      data: {
        userID: jwt_data?.userid,
        mobile: normalInputVal,
        otp: otpInputVal,
        index: "4",
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        if (response.data.success) {
          setBtnLoading(false);
          setError(false);
          setNumberLinked(true);
          handlePrimaryButton("finished");
        }
      })
      .catch((error) => {
        setNumberLinked(false);
        setBtnLoading(false);
      });
  };

  const initRemita = useCallback(
    async (cardType) => {

      const amt = cardType === "Standard" ? "416.88" : "1039.38";
      const description = `${cardType} NIN Slip`;

      const rrr = await generateRemitaRRR(
        amt,
        reference,
        user,
        description,
        payersName
      );
      const onError = (response) => {
        if (response) {
          setPaymentError(true);
        }
      };

      const onPaySuccess = (response) => {
        // card charged successfully, get reference here
        if (response) {
          const paymentReference = generatePaymentReference(
            response.transactionId
          );
          createPaymentLog(paymentReference);
        }
      };

      const createPaymentLog = (paymentReference) => {
        axios({
          method: "post",
          url: `${BASE_URL}nimcSlip/paymentLog`,
          data: {
            userID: jwt_data?.userid,
            txRef: paymentReference,
            rrr: rrr,
            service: cardType === "Standard" ? 1 : 2,
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
          .then((response) => {
            if (response.data.success === true) {
              // showPrintModal(true);
              setProfileBtnLoading(false);
              localStorage.setItem("paymentResponse", JSON.stringify({
                txRef: paymentReference,
                service: cardType === "Standard" ? 1 : 2,
                h: responseData.ninHash,
                status: true
              }));
              setTimeout(() => {
                history.push(`/payment-response/${paymentReference}`)
              }, 1000);
            } else {
              setVerificationError(error);
              setProfileBtnLoading(false);
            }
          })
          .catch((error) => {
            setVerificationError(error);
            setProfileBtnLoading(false);
          });
      };

      const remitaPaymentEngine = window.RmPaymentEngine.init({
        key: key,
        firstName: `${jwt_data.fn}`,
        lastName: `${jwt_data.sn}`,
        narration: `${cardType} NIN slip`,
        amount: amt,
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
          setPremiumLoading(false);
          setStandardLoading(false);
          setNinSlipError(true)
          return onError(response);
        },
        onClose: function () {
          setPremiumLoading(false);
          setStandardLoading(false);
        },
      });

      remitaPaymentEngine.showPaymentWidget();
    },
    [
      accessToken,
      key,
      jwt_data.sn,
      jwt_data.fn,
      jwt_data.userid,
      responseData.ninHash,
      payersName,
      reference,
      user,
      history
    ]
  );

  const ninSlip = useCallback((cardType) => {
    if (cardType === "Premium") {
      setPremiumLoading(true);
    } else if (cardType === "Standard") {
      setStandardLoading(true);
    }

    axios({
      method: "get",
      url: cardType === "Premium" ? `${BASE_URL}nimcSlip/premium?userID=${responseData.userid}` : `${BASE_URL}nimcSlip/standardNINSlip?userID=${responseData.userid}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        if (response.data.success === true) {
          setNoticeModal(true)
          setNinSlipError(false)

          setTimeout(() => {
            initRemita(cardType)
            setModal(false)
          }, 4000);

        } else {
          setPremiumLoading(false);
          setStandardLoading(false);
          setNinSlipError(true)
        }
      })
      .catch((error) => {
        setPremiumLoading(false);
        setStandardLoading(false);
        setNinSlipError(true)
      });
  }, [accessToken, initRemita, responseData.userid])


  useEffect(() => {
    if (cardType !== "") {
      ninSlip(cardType);
    }
    return () => {
      setCardType("");
    };
  }, [cardType, ninSlip]);

  const generatePaymentReference = (transactionId) => {
    const value = `NINSLIP-${transactionId}`;
    return value;
  };

  return (
    <>
      <div
        className={`${modal || profileModal || ninSlipError ? "blur" : ""} ${headerIconDisplay || context ? "" : ""
          }`}
      >
        <div className="single_nav d-flex justify-content-start">
          <div
            className={`single_nav_item p-2 mr-4 ${single_nav === "quick_action" ? "single_nav_active" : ""
              }`}
            onClick={() => setSingle_nav("quick_action")}
          >
            Quick Actions
          </div>
          <div
            className={`single_nav_item p-2 ${single_nav === "view_profile" ? "single_nav_active" : ""
              }`}
            onClick={() => setSingle_nav("view_profile")}
          >
            View Profile
          </div>
        </div>
      </div>

      {single_nav === "quick_action" ? (
        <>
          <div className={`${modal || profileModal ? "blur" : ""}`}>
            <h3 className="tab_page_title mx-auto">Quick Actions</h3>
            <p className="mx-auto tab_page_subtitle">
              Perform quick actions on the accounts of your dependents. What
              would you like to do today?
            </p>

            <div className="col-12 d-flex flex-wrap justify-content-center px-4">
              <HomeCard
                icon={<Print />}
                description={
                  "Print the dependent’s Premium NIN slip and use anywhere. "
                }
                buttonText={"Premium NIN Slip"}
                iconType={"print"}
                to={null}
                loading={premiumLoading}
                disabled={premiumLoading}
                onclick={() => {
                  setCardType("Premium");
                }}
              />
              <HomeCard
                icon={<Print />}
                description={
                  "Print the dependent’s Standard NIN slip and use anywhere."
                }
                buttonText={"Standard NIN Slip"}
                iconType={"print"}
                to={null}
                loading={standardLoading}
                disabled={standardLoading}
                onclick={() => {
                  setCardType("Standard");
                }}
              />
              <HomeCard
                icon={<LinkMobile />}
                description={"Link a mobile number to the dependent’s profile."}
                buttonText={"Add Mobile Number"}
                loading={addNumberLoading}
                disabled={addNumberLoading}
                iconType={"print"}
                to={null}
                onclick={() => {
                  setModal(true);
                  setAddNumberLoading(true);
                }}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div
            className={`${modal || profileModal ? "blur" : ""
              } profile col-md-11 col-lg-10 d-flex justify-content-between p-0 mx-auto align-self-center`}
          >
            <ProfileSidebar
              getTabIndex={(tab) => setTabIndex(tab)}
              mobileDropdownData={profileData[tabIndex]}
              loading={profileBtnloading}
              showProfileModal={() => {
                setProfileModal(true);
                setProfileBtnLoading(true);
              }}
              showAddNumberModal={() => {
                setModal(true);
                setProfileBtnLoading(true);
              }}
              profileImage={`https://v1.ibib.io:7070/1/png/${responseData?.ninHash}.png`}
            />
            <div
              className={`profile_details col-md-7 col-lg-8 p-0 ${profileData[tabIndex].contentType === "table"
                ? "overflow_table"
                : ""
                }`}
            >
              <div
                className={`${window.screen.width > 767 ? "d-block" : "d-none"
                  }`}
              >
                <ProfileDetails
                  data={profileData[tabIndex]}
                  userDetails={jwt_data}
                  loading={profileBtnloading}
                  showProfileModal={() => {
                    setProfileModal(true);
                    setProfileBtnLoading(true);
                  }}
                  showAddNumberModal={() => {
                    setModal(true);
                    setProfileBtnLoading(true);
                  }}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {printModal ? (
        <>
          <PrintCardPreview
            closeModal={() => showPrintModal(false)}
            cardType="simple"
            cardFace={cardType}
            h={responseData?.ninHash}
            downloadLink={`https://slipserver1.nimc.gov.ng/ijebu?h=${responseData?.ninHash}&p=1&type=pns`}
          />
        </>
      ) : (
        <></>
      )}

      {/* Link Number Modal Start */}

      {modal && primary === "" ? (
        <Modal
          onclick={(modal) => {
            setModal(modal);
            setAddNumberLoading(false);
          }}
          content={
            <RemitaModal
              responseType={"error"}
              title={"Add Mobile Number"}
              description={
                "Please endeavour to input a valid phone number in the field below."
              }
              children={
                <>
                  <div className={`remita_select_input`}>
                    <Input
                      placeholder={"08000000000"}
                      label={"Phone Number"}
                      value={normalInputVal}
                      onblur={() => validateOnBlur()}
                      onchange={(val) => validatePhoneNumberOnChange(val)}
                      name="remita_select"
                      mxlength={11}
                      error={error}
                      errorText={errorText}
                    />
                  </div>
                  <div className="remita_buttons d-flex justify-content-between">
                    <div className="col-4 p-0">
                      <Button
                        onButtonClick={() => {
                          setModal(false);
                          handlePrimaryButton("");
                          setNormalInputVal("");
                          setBtnLoading(false);
                          setAddNumberLoading(false);
                          setProfileBtnLoading(false);
                        }}
                        buttonType={"default"}
                        buttonText={`Cancel`}
                      />
                    </div>
                    <div className="col-7 p-0">
                      <Button
                        onButtonClick={() => sendOTP()}
                        buttonType={"primary"}
                        buttonText={"Next"}
                        loading={btnloading}
                      />
                    </div>
                  </div>
                </>
              }
            />
          }
          showCloseButton={false}
        />
      ) : modal && primary === "change" ? (
        <Modal
          onclick={(modal) => {
            setModal(modal);
            setAddNumberLoading(false);
            setProfileBtnLoading(false);
          }}
          content={
            <RemitaModal
              responseType={"error"}
              title={"Verify Number"}
              description={
                "We just sent a six(6) digits one time password to the phone number."
              }
              children={
                <>
                  <div className={`remita_select_otp my-5`}>
                    <OtpInput
                      value={otpInputVal}
                      onChange={(val) => {
                        setOTPInputVal(val);
                        setError(false);
                      }}
                      numInputs={6}
                      isInputNum={true}
                      containerStyle={
                        "d-flex justify-content-between col-12 p-0 m-0"
                      }
                      inputStyle={`filter_box ${error ? "error" : ""}`}
                      focusStyle={`filter_box_focus ${error ? "error" : ""}`}
                      hasErrored={true}
                      separator={" "}
                    />
                  </div>
                  <div className="remita_buttons d-flex justify-content-between">
                    <div className="col-4 p-0">
                      <Button
                        onButtonClick={() => {
                          setModal(false);
                          handlePrimaryButton("");
                          setOTPInputVal("");
                          setNormalInputVal("");
                          setBtnLoading(false);
                          setProfileBtnLoading(false);
                          setAddNumberLoading(false);
                        }}
                        buttonType={"default"}
                        buttonText={"Cancel"}
                      />
                    </div>
                    <div className="col-7 p-0">
                      <Button
                        onButtonClick={() => addNumber()}
                        buttonType={"primary"}
                        buttonText={"Confirm"}
                        loading={btnloading}
                      />
                    </div>
                  </div>
                </>
              }
            />
          }
          showCloseButton={false}
        />
      ) : modal && primary === "finished" ? (
        <>
          <Modal
            onclick={(modal) => {
              setModal(modal);
              setAddNumberLoading(false);
              setProfileBtnLoading(false);
              setNinSlipError(false);
            }
            }
            content={
              <SuccessContent
                responseType={numberLinked ? "success" : "error"}
                responseTexts={
                  <>
                    {numberLinked ? (
                      <p>Number linked successfully</p>
                    ) : (
                      <p>Number not linked. Try again!</p>
                    )}
                  </>
                }
                onclick={(modal) => {
                  setModal(modal);
                  setAddNumberLoading(false);
                  setProfileBtnLoading(false);
                  setNinSlipError(false);
                }}
              />
            }
            showCloseButton={true}
          />
        </>
      ) : (
        <></>
      )}
      {/* Link Number Modal End */}

      {
        noticeModal ?
          <Modal
            content={<p className={"m-4 text-center"}>Please do not leave page until transaction is completed</p>}
            showCloseButton={false}
          />
          :
          <></>
      }

      {paymentError !== "" || ninSlipError ? (
        <Modal
          onclick={(modal) => modal}
          content={
            <SuccessContent
              responseType={"error"}
              responseTexts={
                <>
                  <p>{!ninSlipError ? paymentError : "An Error occured! Please try again!"}</p>
                </>
              }
              onclick={(modal) => {
                setModal(modal);
                setStandardLoading(false);
                setPremiumLoading(false);
                setProfileBtnLoading(false);
              }}
            />
          }
          showCloseButton={true}
        />
      ) : (
        <></>
      )}
      {verificationError !== null ? (
        <Modal
          onclick={() => {
            verificationError(null);
            setProfileBtnLoading(false);
          }}
          content={
            <SuccessContent
              responseType={"error"}
              responseTexts={
                <>
                  <p>{verificationError}</p>
                </>
              }
              onclick={(modal) => setModal(modal)}
            />
          }
          showCloseButton={true}
        />
      ) : (
        <></>
      )}
      {profileModal ? (
        <Modal
          onclick={(modal) => {
            setProfileModal(modal);
            setProfileBtnLoading(false);
            setSelectedSate("");
          }}
          content={
            <RemitaModal
              title={"Request Profile Update"}
              description={
                "To update your profile please go to any NIMC branch office near you"
              }
              children={
                <>
                  <div
                    className={`remita_select_input`}
                    style={{ height: "7rem" }}
                  >
                    <SelectInput
                      placeholder={"State"}
                      label={"Select State"}
                      value={selectedState}
                      selectItems={states}
                      profileSelect={true}
                      getSelectedItem={(item) => {
                        setSelectedSate(item.selected);
                      }}
                      error={error}
                      errorText={errorText}
                    />
                  </div>

                  <div className={"profile_update_address mb-2"}>
                    <h5 className="mb-2">
                      {selectedState === undefined
                        ? "Select State and click on link."
                        : "Click link:"}
                    </h5>
                    <p className="p-0 m-0">
                      {selectedState === undefined ? (
                        "Select State"
                      ) : (
                        <a
                          href={`https://nimc.gov.ng/${selectedState
                            .toLowerCase()
                            .replace(" ", "-")}${selectedState === "FCT" ? "" : "-state"
                            }-enrolment-centres/`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ fontSize: ".8rem" }}
                        >
                          View Centers near you
                        </a>
                      )}
                    </p>
                  </div>
                </>
              }
            />
          }
          showCloseButton={true}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export { SingleDependent };
