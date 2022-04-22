const dk = process.env.REACT_APP_CID;

export const decrypt = (key, data) => {
    const decrypted = key.decrypt(data, dk);
    console.log(decrypted, dk, 'from decrypt');
};
