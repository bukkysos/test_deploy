import axios from 'axios';
import { BASE_URL } from '../../../../../config';

// Hit this endpoint with phone number to get OTP
export const sendNumber = (inputVal, ciDT, userid, callback) => {
    if (
        inputVal === '' ||
        inputVal.length < 11 ||
        inputVal.length > 11 ||
        isNaN(parseInt(inputVal))
    ) {
        callback({
            status: 'error',
            message: 'Invalid Number'
        });
    }

    axios({
        method: 'post',
        url: `${BASE_URL}utility/sendOTP`,
        data: {
            userID: userid,
            mobile: inputVal
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
            return true;
        })
        .catch((error) => {
            callback({
                status: 'error',
                message: error.response.message
            });
        });
    return true;
};
