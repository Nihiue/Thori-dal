export function getAccessToken(token, salt, time) {
  return window.CryptoJS.SHA256(`${token}|${salt}|${time}`).toString();
};

export function decryptAES(data, key) {
  return window.CryptoJS.AES.decrypt(data, key).toString(window.CryptoJS.enc.Utf8);
};

export function encryptAES(data, key) {
  return window.CryptoJS.AES.encrypt(data, key).toString();
};

export function genUserToken(name, password) {
  return window.CryptoJS.SHA256(`${name}|${password}`).toString();
};
