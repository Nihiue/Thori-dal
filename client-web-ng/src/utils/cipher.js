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

function genRandomKey() {
  const buf = crypto.getRandomValues(new Uint8Array(32)).buffer;
  return buffer2base64(buf);
};

const jsCipher = {
  genRandomKey
};
const webCipher = {
  genRandomKey
};

const CryptoJS = window.CryptoJS;
const crypto = window.crypto;

webCipher.sha256 = async function (text) {
  const hash = await crypto.subtle.digest('SHA-256', text2buffer(text));
  return buffer2base64(hash);
};

webCipher.hmacSha1 = async function (msgUintArr, keyUintArr) {

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyUintArr,
    {
      name: 'HMAC',
      hash: 'SHA-1'
    },
    false,
    ['sign']
  );

  const result = await crypto.subtle.sign(
    'HMAC',
    cryptoKey,
    msgUintArr
  );

  return new Uint8Array(result);
};

webCipher.encryptText = async (plainText, strKey, usePWD) => {
  const ptUtf8 = text2buffer(plainText);
  let rawKey;
  if (usePWD) {
    rawKey = await crypto.subtle.digest('SHA-256', text2buffer(strKey));
  } else {
    rawKey = base642buffer(strKey);
  }
  const iv = crypto.getRandomValues(new Uint8Array(16));
  const alg = {
    name: 'AES-CBC',
    iv: iv
  };
  const key = await crypto.subtle.importKey('raw', rawKey, alg, false, ['encrypt']);
  const encBuffer = await crypto.subtle.encrypt(alg, key, ptUtf8);
  return {
    iv: buffer2base64(iv.buffer),
    data: buffer2base64(encBuffer)
  };
};

webCipher.decryptText = async (data, strKey, iv, usePWD) => {
  let rawKey;
  if (usePWD) {
    rawKey = await crypto.subtle.digest('SHA-256', text2buffer(strKey));
  } else {
    rawKey = base642buffer(strKey);
  }
  const alg = {
    name: 'AES-CBC',
    iv: base642buffer(iv)
  };
  const key = await crypto.subtle.importKey('raw', rawKey, alg, false, ['decrypt']);
  const ptBuffer = await crypto.subtle.decrypt(alg, key, base642buffer(data));
  return buffer2text(ptBuffer);
};

jsCipher.sha256 = function (str) {
  return CryptoJS.SHA256(str).toString(CryptoJS.enc.Base64);
};

jsCipher.hmacSha1 = function (msgUintArr, keyUintArr) {

  function hexToUint8(hex) {
    const ret = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      ret[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return ret;
  }

  function uint8ToStr(uint8) {
    return [].map.call(uint8, i => String.fromCharCode(i)).join('');
  }

  const msg = uint8ToStr(msgUintArr);
  const key = uint8ToStr(keyUintArr);

  return hexToUint8(CryptoJS.HmacSHA1(msg, key).toString(CryptoJS.enc.hex));
};

jsCipher.encryptText = function (plainText, strKey, usePWD) {
  let key;
  if (usePWD) {
    key = CryptoJS.SHA256(strKey);
  } else {
    key = CryptoJS.enc.Base64.parse(strKey);
  }
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

jsCipher.decryptText = function (data, strKey, iv, usePWD) {
  let key;
  if (usePWD) {
    key = CryptoJS.SHA256(strKey);
  } else {
    key = CryptoJS.enc.Base64.parse(strKey);
  }
  const decrypted = CryptoJS.AES.decrypt(data, key, {
    mode: CryptoJS.mode.CBC,
    iv: CryptoJS.enc.Base64.parse(iv)
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
};

const IsWebCipherAvailable = Boolean(window.crypto && window.crypto.subtle);

console.log('use web cipher:', IsWebCipherAvailable);
const cipher = IsWebCipherAvailable ? webCipher : jsCipher;

export default cipher;
