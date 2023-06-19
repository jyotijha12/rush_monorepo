import CryptoJS from "crypto-js";

export const getENV = (key) => {
  const secret = process.env.REACT_APP_ENCRYPTION_SECRET;
  const encrypted = sessionStorage.getItem("encryptedData");
  try {
    const parsedSecred = CryptoJS.enc.Utf8.parse(secret);
    const data = CryptoJS.AES.decrypt(encrypted, parsedSecred, {
      mode: CryptoJS.mode.ECB,
    });
    const decryptedData = JSON.parse(data.toString(CryptoJS.enc.Utf8));
    return decryptedData[key];
  } catch (error) {
    return error;
  }
};
