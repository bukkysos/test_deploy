const NodeRSA = require('node-rsa');
const key = new NodeRSA({ b: 3072 });
// key.setOptions({ encryptionScheme: ‘pkcs1’ });

export const decryptor = (encrypted) => {
    const decryptedData = key.decrypt(encrypted, 'utf8');
    return decryptedData;
};
