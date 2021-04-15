import cipher from './cipher';

function hexToUint8(hex) {
  const ret = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    ret[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return ret;
}

function base32ToUint8(base32) {
  const base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = '';

  if ((base32.length * 5) % 8 !== 0) {
    throw new Error('invalid base32 length');
  }

  for (let i = 0; i < base32.length; i += 1) {
    const val = base32chars.indexOf(base32.charAt(i).toUpperCase());
    if (val === -1) {
      throw new Error('invalid base32 char');
    }
    bits += val.toString(2).padStart(5, '0');
  }

  const ret = new Uint8Array(bits.length / 8);
  for (let i = 0; i < bits.length; i += 8) {
    ret[i / 8] = parseInt(bits.substr(i, 8), 2);
  }
  return ret;
}


export default async function generateCode(key, now = Date.now()) {
  // https://tools.ietf.org/id/draft-mraihi-totp-timebased-06.html

  const CODE_DIGITS = 6;
  const DIGITS_POWER = [1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000];
  const STEP = 30;

  const epoch = Math.round(now / 1000);
  const time = Math.floor(epoch / STEP).toString(16).toUpperCase().padStart(16, '0');

  let hash;
  try {
    hash = await cipher.hmacSha1(hexToUint8(time), base32ToUint8(key.trim()));
  } catch (e) {
    console.error(e.toString());
    return 'ERROR';
  }

  const offset = hash[hash.length - 1] & 0xf;
  const binary =
    ((hash[offset] & 0x7f) << 24) |
    ((hash[offset + 1] & 0xff) << 16) |
    ((hash[offset + 2] & 0xff) << 8) |
    (hash[offset + 3] & 0xff);
  const otp = (binary % DIGITS_POWER[CODE_DIGITS]).toString();

  return otp.padStart(CODE_DIGITS, '0');
}
