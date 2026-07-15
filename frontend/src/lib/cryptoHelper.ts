import CryptoJS from "crypto-js";

const SECRET_KEY =
   process.env.REACT_APP_SECRET_KEY || "your-fallback-secure-key-32-chars";

export const encryptPassword = (plainText: string | CryptoJS.lib.WordArray) => {
   if (!plainText) return "";
   return CryptoJS.AES.encrypt(plainText, SECRET_KEY).toString();
};

export const decryptPassword = (
   cipherText: string | CryptoJS.lib.CipherParams,
) => {
   if (!cipherText) return "";
   const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
   return bytes.toString(CryptoJS.enc.Utf8);
};
