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
  return window.CryptoJS.SHA256(`${name}|5083785e-9c1b-4a3b-a487-190e4409ad0d|${password}`).toString();
};

const charset = '!@#$%abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%';

export function genRandomPassword(length = 12) {
  let ret = '';
  for (let i = 0; i < length; i++) {
    ret += charset[Math.ceil(Math.random() * charset.length)];
  }
  return ret;
};
