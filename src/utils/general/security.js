var CryptoJS = require("crypto-js");

/**
 * Función que encripta un texto
 * @param {string} sText | Texto a cifrar
 * @returns Texto cifrado
 */
export const encryptText = (sText) => {
  return CryptoJS.AES.encrypt(
    sText,
    process.env.REACT_APP_SECRET_KEY
  ).toString();
};
/**
 * Descifra el texto
 * @param {string} sKey | Texto cifrado
 * @returns Texto descifrado
 */
export const decryptText = (sKey) => {
  return CryptoJS.AES.decrypt(sKey, process.env.REACT_APP_SECRET_KEY).toString(
    CryptoJS.enc.Utf8
  );
};
