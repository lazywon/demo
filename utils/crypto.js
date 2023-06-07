const CryptoJS = require("crypto-js");
const dotenv = require("dotenv").config();

const KEY = CryptoJS.enc.Hex.parse(process.env.REACT_APP_ENC_KEY || "");
const IV = CryptoJS.enc.Hex.parse(process.env.REACT_APP_ENC_IV || "");

const encrypt = (text) => {
  const cipherParams = CryptoJS.AES.encrypt(text, KEY, { iv: IV });
  const cipherText = cipherParams.ciphertext.toString(CryptoJS.enc.Hex);
  return cipherText;
};

const decrypt = (text) => {
  const cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: CryptoJS.enc.Hex.parse(text),
  });
  const bytes = CryptoJS.AES.decrypt(cipherParams, KEY, { iv: IV });
  const plainText = bytes.toString(CryptoJS.enc.Utf8);
  return plainText;
};

exports.encrypt = encrypt;
exports.decrypt = decrypt;
