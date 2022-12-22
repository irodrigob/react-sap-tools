var CryptoJS = require("crypto-js");

export default class Encrypt {
  /**
   * Función que encripta un texto
   * @param {string} sText | Texto a cifrar
   * @returns Texto cifrado
   */
  static encryptText = (sText: string): string => {
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
  static decryptText(sKey: string): string {
    return CryptoJS.AES.decrypt(
      sKey,
      process.env.REACT_APP_SECRET_KEY
    ).toString(CryptoJS.enc.Utf8);
  }
}
