import React from "react";
import QRCode from "react-qr-code";
import { CloseIcon, CoatOfArms, DownloadIcon, Logo } from "../../assets";
import "./printCardModal.css";

const PrintCardModal = ({ closeModal, userData, tableData }) => {
  const { timeStamp, transID, veriStatus, veriType } = tableData;

  const { sn, fn, icao, mn, h, userId } = userData;

  const TempSlipModal = () => {
    return (
      <>
        <>
          <div className="card_holder" id={"cardComp"}>
            <div className="col-sm-9 col-md-9 col-lg-5 d-flex mx-auto flex-column align-items-center card_holder_header">
              <img src={Logo} className="card_logo" alt="Nimc" />
              <p className="text-center p-0 m-0">Verification-as-a-service</p>
            </div>
            <div className="d-flex align-items-center card_holder_bottom w-100 mt-2">
              <div className="col-5 d-flex flex-column card_holder_left p-0">
                <div className="card_holder_left_header mx-auto my-1">
                  <img src={CoatOfArms} className="card_logo" alt="Nimc" />
                </div>

                <div className="d-flex card_holder_left_card">
                  <div className="p-0 card_holder_left_card_image my-auto ml-2">
                    <img
                      src={`https://v1.ibib.io:7070/1/png/${h}.png`}
                      alt="Nimc"
                    />
                  </div>
                  <div className="col-4 card_holder_left_card_details my-auto">
                    <div className="card_holder_left_card_detail ">
                      <h5 className="p-0">Surname</h5>
                      <p className="p-0 m-0">{fn}</p>
                    </div>
                    <div className="card_holder_left_card_detail my-2 ml-1">
                      <h5 className="p-0">Given name(s)/Prénom</h5>
                      <p className="p-0 m-0">{`${mn}, ${sn}`}</p>
                    </div>
                    <div className="card_holder_left_card_detail my-2 ml-1">
                      <h5 className="p-0">Date of Birth</h5>
                      <p className="p-0 m-0">{icao}</p>
                    </div>
                  </div>
                  <div className="col-5 p-0 m-0 d-flex justify-content-center align-items-center">
                    <div className="card_holder_left_card_qr">
                      <QRCode
                        value={transID}
                        size={
                          window.screen.width > 240 && window.screen.width < 281
                            ? 30
                            : window.screen.width > 282 &&
                              window.screen.width < 600
                            ? 40
                            : window.screen.width > 601 &&
                              window.screen.width < 1140
                            ? 90
                            : 100
                        }
                        style={{ width: "90%" }}
                      />
                    </div>
                  </div>
                </div>
                <p className="card_left_verification text-center mt-1">
                  This document has been verified by NIMC
                </p>
              </div>

              <div className="col-4 card_holder_middle p-0">
                <div className="card_holder_middle_detail">
                  <h5 className="m-0 p-0">Surname/Nom</h5>
                  <p className="m-0 p-0">{fn}</p>
                </div>

                <div className="card_holder_middle_detail">
                  <h5 className="m-0 p-0">Given names/Prénom</h5>
                  <p className="m-0 p-0">{`${mn}, ${sn}`}</p>
                </div>

                <div className="card_holder_middle_detail">
                  <h5 className="m-0 p-0">Date of Birth</h5>
                  <p className="m-0 p-0">{icao}</p>
                </div>
              </div>

              <div className="card_holder_right">
                <QRCode
                  value={transID}
                  size={
                    window.screen.width > 250 && window.screen.width < 400
                      ? 60
                      : window.screen.width > 401 && window.screen.width < 600
                      ? 80
                      : window.screen.width > 601 && window.screen.width < 1040
                      ? 120
                      : window.screen.width > 1041 && window.screen.width < 1460
                      ? 170
                      : 190
                  }
                />
              </div>
            </div>
            <div className="table-responsive card_table">
              <table className="table table-bordered">
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Timestamp</th>
                    <th scope="col">Transaction ID</th>
                    <th scope="col">Verification Type</th>
                    <th scope="col">Verification Status</th>
                    <th scope="col">Verification Agent ID</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{timeStamp}</td>
                    <td>{transID}</td>
                    <td>
                      {veriType === "b"
                        ? "Basic"
                        : veriType === "f"
                        ? "Full"
                        : veriType === "n"
                        ? "NIN"
                        : ""}
                    </td>
                    <td>{veriStatus}</td>
                    <td>{userId}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="water_mark_wrapper  py-3">
            <div className="water_mark d-flex flex-column justify-content-center align-items-center">
              <p className="p-0">{userId}</p>
              <p className="p-0">{userId}</p>
              <p className="p-0">{userId}</p>
            </div>
          </div>
        </>
      </>
    );
  };
  return (
    <>
      <div id="modal" className="modal_overlay">
        <div className="print_card_header d-flex justify-content-between">
          <div className="d-flex my-auto justify-content-between left">
            <p
              className="p-0 m-0 print_card_modal_close"
              onClick={() => closeModal(false)}
            >
              <CloseIcon style={{ stroke: "#fff", fill: "#fff" }} />
            </p>
          </div>

          <div className="d-flex my-auto justify-content-end">
            <a
              href={`https://slipserver1.nimc.gov.ng/ijebu?txid=${transID}&p=1&type=vs`}
              download={"my_NIN_Slip.pdf"}
              target="_top"
            >
              <span
                onClick={() => {
                  setTimeout(() => {
                    closeModal(false);
                  }, 2000);
                }}
              >
                <DownloadIcon />
              </span>
            </a>
          </div>
        </div>

        <div className="d-flex justify-content-center align-items-center h-100 w-auto print_card_modal_wrapper">
          <div className="print_card_modal" id="cardContainer">
            <TempSlipModal />
          </div>

          <div className="print_card_zoom d-flex mx-auto px-3" onClick={() => {
                  setTimeout(() => {
                    closeModal(false);
                  }, 2000);
                }}>
            <a
              href={`https://slipserver1.nimc.gov.ng/ijebu?txid=${transID}&p=1&type=vs`}
              className="download_button my-3"
              download={`${h}.pdf`}
              target="_top"
            >
              Download
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export { PrintCardModal };
