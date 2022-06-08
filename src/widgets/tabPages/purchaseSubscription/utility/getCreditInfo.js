import axios from 'axios';
import { BASE_URL } from '../../../../config';
import { decryptAndDecode } from '../../../../config/utils/red';

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
                    const rawData = await decryptAndDecode(response.data.data);
                    localStorage.setItem('credits', rawData.credittotal);
                }
            })
            .catch((error) => {
                console.log(error, 'gteCredInfo');
            });
    }
};
