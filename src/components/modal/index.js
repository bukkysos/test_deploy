import React from "react";
import { CloseIcon } from "../../assets";
import "./modal.css";

const Modal = ({ onclick=()=>{}, content, showCloseButton = true }) => {

  return (
    <>
      <div
        id="modal"
        className="d-flex justify-content-center align-items-center modal_overlay"
      >

          <div className="modal_outer d-flex flex-column justify-content-center align-items-center">
          <div className="modal_wrapper">
            <div className="modal_">{content}</div>

          </div>
          {showCloseButton ? (
              <span
                className="modal_close mx-auto"
                onClick={() => onclick(false)}
              >
                <CloseIcon fill="#000"/>
              </span>
            ) : (
              <>{" "}</>
            )}
          </div>
        
      </div>
    </>
  );
};

export { Modal };
