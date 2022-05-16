import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
// import { LinkNumbersTable } from '../../../components/table/NewTable/LinkNumbersTable';
import { NewTable } from '../../../components/table/NewTable/newTable';
import { BASE_URL } from '../../../config';
import { ciEncrypt, decryptAndDecode } from '../../../config/utils/red';
import { AddNumberModal } from '../../../components/table/NewTable/components/modals/AddNumberModal';
import { OTPModal } from '../../../components/table/NewTable/components/modals/OTPModal';

export const TestComp = () => {
    const [data, setData] = useState({});
    const [responseData, setResponseData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [serverResponse, setServerResponse] = useState({
        status: null,
        message: '',
        openOTPModal: false
    });

    let ciDT = ciEncrypt.getItem('ciDT');

    const handleKey = useCallback(async () => {
        let ciDD = await ciEncrypt.getItem('ciDD');
        let userData = await decryptAndDecode(ciDD);
        if (userData.userid) {
            setData(userData);
        }
    }, [ciEncrypt]);

    useEffect(() => {
        handleKey();
    }, [handleKey]);

    // useEffect(() => {
    //     setContext(modal);
    // }, [modal, setContext]);
    console.log(serverResponse);

    useEffect(() => {
        if (data.userid) {
            axios({
                method: 'get',
                url: `${BASE_URL}device/getMobileNumbers?userID=${data.userid}`,
                headers: {
                    Authorization: `Bearer ${ciDT}`
                }
            })
                .then((response) => {
                    setResponseData(() => response.data.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }

        // return () => {};
    }, [data.userid]);

    return (
        <>
            <h3 className="tab_page_title mx-auto">Link Mobile Number (Test)</h3>

            <p className="mx-auto tab_page_subtitle">
                The table below shows records of all the mobile numbers linked to your NIN profile.
            </p>
            <div className="col-12 mt-5 page_table">
                {/* <LinkNumbersTable /> */}
                <NewTable
                    responseData={responseData}
                    showModal={showModal}
                    handleShowNumberModal={() => setShowModal((prevState) => !prevState)}
                />
            </div>
            {showModal ? (
                <AddNumberModal
                    handleShowNUmberModal={(val) => setShowModal(val)}
                    userid={data.userid}
                    ciDT={ciDT}
                    setResponse={({ status, message, openOTPModal }) =>
                        setServerResponse({ status, message, openOTPModal })
                    }
                />
            ) : (
                <></>
            )}
            {serverResponse.openOTPModal ? (
                <OTPModal
                    userid={data.userid}
                    ciDT={ciDT}
                    setResponse={({ status, message, openOTPModal }) =>
                        setServerResponse({ status, message, openOTPModal })
                    }
                />
            ) : (
                <></>
            )}
        </>
    );
};
