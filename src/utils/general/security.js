var CryptoJS = require("crypto-js");

export const secretKey = "h4KhETNkSGktJQQx9FDbkBKFe";

/**
 * Función que encripta un texto
 * @param {string} sText | Texto a cifrar
 * @returns Texto cifrado
 */
export const encryptText = (sText) => {
  return CryptoJS.AES.encrypt(sText, secretKey).toString();
};
/**
 * Descifra el texto
 * @param {string} sKey | Texto cifrado
 * @returns Texto descifrado
 */
export const decryptText = (sKey) => {
  return CryptoJS.AES.decrypt(sKey, secretKey).toString(CryptoJS.enc.Utf8);
};
