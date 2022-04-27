import axios from 'axios';
import { encryptAndSaveKey } from '../../../../config/utils/red';

const CIK = process.env.REACT_APP_DECRYPT_KEY_URL;

export const fetchKey = (data) => {
    axios({
        method: 'get',
        url: `${CIK}`,
        headers: {
            'api-key': 'KaGOQemGcrfByteWzBHxV0Dnmoamjyt87rt87*R*^r&%##jkhn5'
        }
    })
        .then((response) => {
            if (response.data.data) {
                let priv = response.data.data.priv;
                priv = priv.replace(/\\n/g, '\n').trim();
                console.log({ priv }, 'fetchkey');
                return encryptAndSaveKey(priv, data);
            }
            return true;
        })
        .catch((error) => {
            console.log({ error });
            return false;
        });
};
