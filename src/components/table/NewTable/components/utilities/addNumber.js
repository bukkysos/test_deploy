import axios from "axios";
import { BASE_URL } from "../../../../../config";

export const addNumber = (otpInputVal, userid, normalInputVal, ciDT, callback) => {

    if (otpInputVal === '' || otpInputVal.length !== 6 || error) {
        setError(true);
        callback({
            status: 'error',
            message: 'Ensure OTP is entered correctly'
        });
        // return setBtnLoading(false);
        return;
    }

    axios({
        method: 'post',
        url: `${BASE_URL}utility/addMobileNumber`,
        data: {
            userID: userid,
            mobile: normalInputVal,
            otp: otpInputVal,
            index: '4'
        },
        headers: {
            Authorization: `Bearer ${ciDT}`
        }
    })
        .then((response) => {
            if (response.data.success) {
                callback({
                    status: 'success',
                    message: response.data.message
                });
            } else {
                callback({
                    status: 'error',
                    message: response.data.message
                });
            }
        })
        .catch((error) => {
            callback({
                status: 'error',
                message: error.response.message
            });
        });
    return true;
};
