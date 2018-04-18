import cipher from './cipher';

window.test = cipher;

export async function getAccessToken(token, salt, time) {
  const ret = await cipher.sha256(`${token}|${salt}|${time}`);
  return ret;
};

export async function genUserToken(name, password) {
  const salt1 = '5083785e-9c1b-4a3b-a487-190e4409ad0d';
  const salt2 = 'd0b2cbe0-bff1-463d-9750-68e53ada7a44';
  const hashedPassword = await cipher.sha256(password + salt1);
  const ret = await cipher.sha256(`${name}|${salt2}|${hashedPassword}`);
  return ret;
};

export function genRandomPassword(length = 12) {
  const RandomCharset = '!@#$%abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%';
  let ret = '';
  for (let i = 0; i < length; i++) {
    ret += RandomCharset[Math.floor(Math.random() * RandomCharset.length)];
  }
  return ret;
};
