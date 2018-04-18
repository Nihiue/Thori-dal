function text2buffer(text) {
  const encoder = new TextEncoder('utf-8');
  return encoder.encode(text);
}

function buffer2text(buf) {
  const decoder = new TextDecoder('utf-8');
  return decoder.decode(buf);
}

function buffer2base64(buf) {
  var binStr = Array.prototype.map.call(new Uint8Array(buf), function (ch) {
    return String.fromCharCode(ch);
  }).join('');
  return btoa(binStr);
}

function base642buffer(base64) {
  var binStr = atob(base64);
  var iArr = new Uint8Array(binStr.length);
  Array.prototype.forEach.call(binStr, function (ch, i) {
    iArr[i] = ch.charCodeAt(0);
  });
  return iArr.buffer;
}

const jsCipher = {};
const webCipher = {};

const CryptoJS = window.CryptoJS;

webCipher.encryptText = async (plainText, password) => {
  const ptUtf8 = text2buffer(plainText);
  const pwHash = await crypto.subtle.digest('SHA-256', text2buffer(password));
  const iv = crypto.getRandomValues(new Uint8Array(16));
  const alg = {
    name: 'AES-CBC',
    iv: iv
  };
  const key = await crypto.subtle.importKey('raw', pwHash, alg, false, ['encrypt']);
  const encBuffer = await crypto.subtle.encrypt(alg, key, ptUtf8);
  return {
    iv: buffer2base64(iv.buffer),
    data: buffer2base64(encBuffer)
  };
};

webCipher.decryptText = async (data, password, iv) => {
  const pwHash = await crypto.subtle.digest('SHA-256', text2buffer(password));
  const alg = {
    name: 'AES-CBC',
    iv: base642buffer(iv)
  };
  const key = await crypto.subtle.importKey('raw', pwHash, alg, false, ['decrypt']);
  const ptBuffer = await crypto.subtle.decrypt(alg, key, base642buffer(data));
  return buffer2text(ptBuffer);
};

jsCipher.encryptText = async (plainText, password) => {
  const key = CryptoJS.SHA256(password);
  const ivBuffer = crypto.getRandomValues(new Uint8Array(16)).buffer;
  var iv = CryptoJS.enc.Base64.parse(buffer2base64(ivBuffer));
  const encrypted = CryptoJS.AES.encrypt(plainText, key, {
    mode: CryptoJS.mode.CBC,
    iv: iv
  });
  return {
    iv: iv.toString(CryptoJS.enc.Base64),
    data: encrypted.toString()
  };
};

jsCipher.decryptText = async (data, password, iv) => {
  const key = CryptoJS.SHA256(password);
  const decrypted = CryptoJS.AES.decrypt(data, key, {
    mode: CryptoJS.mode.CBC,
    iv: CryptoJS.enc.Base64.parse(iv)
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
};
