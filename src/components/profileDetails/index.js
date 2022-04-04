import React, { useEffect } from "react";
import { SortIcon } from "../../assets";
import { Button } from "../button";
import "./profileDetails.css";

const ProfileDetails = ({
  data,
  loading=false,
  showProfileModal = () => {},
  showAddNumberModal = () => {},
  printNIN = () => {},
}) => {
  useEffect(() => {}, [data]);

  const handleProfleButton = (determinant) => {
    if (determinant === "Request Profile Update") {
      showProfileModal(true);
    } else if (determinant === "Link Mobile Number") {
      showAddNumberModal(true);
    } else if (determinant === "Purchase Subscription") {
      printNIN();
    }
  };

  return (
    <>
      <div className="profile_details_title d-flex">
        <p className="my-auto p-0">Account Information</p>
      </div>

      <div
        className={`d-flex justify-content-center profile_details_body ${
          data.contentType === "table" ? "table-responsive" : ""
        }`}
      >
        {data.contentType !== null ? (
          <>
            <div className="p-0 m-0 profile_details_body col-11">
              <table className="table table-striped mt-4 mb-5">
                <thead>
                  <tr>
                    <th>
                      ID Number <SortIcon />
                    </th>
                    <th>Mobile</th>
                    <th>
                      Status <SortIcon />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(data).length !== 0 ? (
                    data.map((d, i) => {
                      return (
                        <tr key={i}>
                          <td>{d.idNumber === "" ? "NA" : d.idNumber}</td>
                          <td>{d.mobile === "" ? "NA" : d.mobile}</td>
                          <td>{d.status === "" ? "NA" : d.status}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center">
                        No devices
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {Object.keys(data).length !== 0 ? (
                <div
                  className="profile_details_button col-6"
                  style={{ marginTop: "5rem" }}
                >
                  <Button
                    buttonText={data[0]?.primaryButtonText}
                    buttonType={"primary"}
                    loading={loading}
                    onButtonClick={() =>
                      handleProfleButton(data[0]?.primaryButtonText)
                    }
                  />
                </div>
              ) : (
                <></>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="col-6 py-4 px-0">
              {data.leftData.map((item, index) => (
                <React.Fragment key={index}>
                  <p className="profile_details_left">{item}</p>
                </React.Fragment>
              ))}
              <div className="profile_details_button col-12 p-0">
                <Button
                  buttonText={data.primaryButtonText}
                  buttonType={"primary"}
                  loading={loading}
                  onButtonClick={() =>
                    handleProfleButton(data.primaryButtonText)
                  }
                />
              </div>
            </div>
            <div className="col-6 py-4 profile_details_right">
              {data.rightData.map((item, index) => (
                <React.Fragment key={index}>
                  <p>{item}</p>
                </React.Fragment>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export { ProfileDetails };
