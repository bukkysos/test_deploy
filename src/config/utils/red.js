import { EncryptStorage } from 'encrypt-storage';
const NodeRSA = require('node-rsa');

const ci = process.env.REACT_APP_CIE.split(', ');
const dk = process.env.REACT_APP_CID;

export const key = new NodeRSA({ b: Number(ci[Math.floor(Math.random() * ci.length)]) });

export const ciEncrypt = new EncryptStorage('secret-key', {
    prefix: '@cid',
    encAlgorithm: 'Rabbit'
});

export const encryptAndSaveKey = (d, data) => {
    const encryptedData = key.encrypt(d, 'base64');
    ciEncrypt.setItem('ciDD', data);
    ciEncrypt.setItem('ciDK', encryptedData);
    return true;
};

export const decrypt = (data) => {
    const decrypted = key.decrypt(data, dk);
    console.log(decrypted, dk, 'from decrypt');
    return true;
};
