import React from "react";
import {
  CloseIcon,
  PremiumCardPreview,
  StandardCardPreview,
} from "../../assets";
import "./printCardPreview.css";

const PrintCardPreview = ({
  closeModal,
  cardFace = "standard",
  h,
  downloadLink,
}) => {
  return (
    <>
      <div id="modal" className="modal_overlay">
        <div className="preview_print_card_header d-flex justify-content-between">
          <div className="col-5 d-flex my-auto justify-content-between left">
            <p
              className="col-1 p-0 m-0 preview_print_card_modal_close"
              onClick={() => closeModal(false)}
            >
              <CloseIcon style={{ stroke: "#fff", fill: "#fff" }} />
            </p>
          </div>
        </div>

        <div className="d-flex justify-content-center align-items-center h-100 w-auto  preview_print_card_modal_wrapper">
          <div className="simple_preview_print_card_modal">
            <div className="">
              <img
                src={
                  cardFace === "Premium"
                    ? PremiumCardPreview
                    : StandardCardPreview
                }
                alt={`Standard NIN Preview card`}
              />
            </div>
            <div className="preview_print_card_zoom d-flex justify-content-center px-3">
              <a
                href={downloadLink}
                className="download_button my-3"
                download={`${h}.pdf`}
                target="_top"
                onClick={() => {
                  setTimeout(() => {
                    closeModal(false);
                  }, 2000);
                }}
              >
                Download
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { PrintCardPreview };
