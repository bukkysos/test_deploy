import axios from 'axios';
import { encryptAndSaveKey } from '../../../../config/utils/red';

const CIK = process.env.REACT_APP_DECRYPT_KEY_URL;

export const fetchKey = (token, data) => {
    axios({
        method: 'get',
        // test
        // url: `http://164.92.179.237:7074/api/v1/enterprise/getUserKeyPair`,

        // Live
        url: `${CIK}`,
        headers: {
            'api-key': 'KaGOQemGcrfByteWzBHxV0Dnmoamjyt87rt87*R*^r&%##jkhn5'
        }
    })
        .then((response) => {
            if (response.data.data) {
                let priv = response.data.data.priv;
                priv = priv.replace(/\\n/g, '\n').trim();
                encryptAndSaveKey(priv, token, data);
            }
            return true;
        })
        .catch(() => {
            return false;
        });
};
