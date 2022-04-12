export const decryptor = (encrypted) => {
    const privateKey = '';
    const NodeRSA = require(privateKey);
    const privKey = new NodeRSA({ b: 512 });
    let plainText = privKey.decrypt(encrypted, 'utf8');

    console.log('decrypted: ', plainText);

    return plainText;

    // key.setOptions({ encryptionScheme: 'pkcs1' });
    // var privatePem = key.exportKey('pkcs8' + '-private-pem');
    // console.log({ hello: 'pkcs8' + 'privateKey: \n', privatePem, encrypted });
    // console.log({ key: nk });
    // const decryptedData = key.decrypt(encrypted, 'utf8');
};
