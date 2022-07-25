import axios from 'axios';
import { BASE_URL } from '../../../../config';

export const getCreditInfo = async (userid, ciDT) => {
    if (userid) {
        await axios({
            method: 'get',
            url: `${BASE_URL}credit/getCreditInfo?userID=${userid}`,
            headers: {
                Authorization: `Bearer ${ciDT}`
            }
        })
            .then(async (response) => {
                if (response.data.success) {
                    localStorage.setItem('credits', response.data.data.credittotal);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }
};
