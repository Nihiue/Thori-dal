const CryptoJS = window.CryptoJS;

function sha256(str) {
  return CryptoJS.SHA256(str).toString();
};
function encryptAES(str, key) {
  return CryptoJS.AES.encrypt(str, key).toString();
};
function decryptAES(str, key) {
  return CryptoJS.AES.decrypt(str, key).toString(CryptoJS.enc.Utf8);
};

export function getAccessToken(token, salt, time) {
  return sha256(`${token}|${salt}|${time}`);
};

export function genUserToken(name, password) {
  const UserTokenSalt = '5083785e-9c1b-4a3b-a487-190e4409ad0d';
  return sha256(`${name}|${UserTokenSalt}|${password}`);
};

export function encryptObject(obj, key) {
  // add some noise
  obj._ = genRandomPassword(Math.random() * 128);
  return encryptAES(JSON.stringify(obj), key);
}

export function decryptObject(source, key) {
  if (!source) {
    return {};
  }
  let json = decryptAES(source, key);
  if (source.length > 0 && !json) {
    throw new Error('decrypt object failed');
  }
  const obj = JSON.parse(json);
  delete obj._;
  return obj;
}

export function genRandomPassword(length = 12) {
  const RandomCharset = '!@#$%abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%';
  let ret = '';
  for (let i = 0; i < length; i++) {
    ret += RandomCharset[Math.floor(Math.random() * RandomCharset.length)];
  }
  return ret;
};
