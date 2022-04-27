import { EncryptStorage } from 'encrypt-storage';
const NodeRSA = require('node-rsa');
import jwt_decode from 'jwt-decode';

// const ci = process.env.REACT_APP_CIE.split(', ');
// const dk = process.env.REACT_APP_CID;

export const ciEncrypt = new EncryptStorage('secret-key', {
    prefix: '@cid',
    encAlgorithm: 'Rabbit'
});

export const encryptAndSaveKey = (priv, token, data) => {
    ciEncrypt.setItem('ciDK', priv);
    ciEncrypt.setItem('ciDD', data);
    ciEncrypt.setItem('ciDT', token);
    return true;
};

export const decryptAndDecode = async (data) => {
    const priv = await ciEncrypt.getItem('ciDK');
    const key = new NodeRSA(priv);
    const decrypted = key.decrypt(data, 'utf8');
    const decoded = jwt_decode(decrypted);
    return decoded;
};
