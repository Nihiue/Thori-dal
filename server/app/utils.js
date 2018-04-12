const TIME_SLOT_SIZE = 10000;

function hashString(str) {
  const hash = crypto.createHash('sha1');
  hash.update(str, 'utf8');
  return hash.digest('hex');
}

module.exports.calcAccessToken = function (origToken, salt, timestamp) {
  const timeSlot = timestamp - (timestamp % TIME_SLOT_SIZE);
  return [timeSlot - TIME_SLOT_SIZE, timeSlot, timeSlot + TIME_SLOT_SIZE].map((slot) => hashString(`${origToken}|${salt}|${slot}`));
}



/*
const TIME_SLOT_SIZE = 10000;

function hex(buffer) {
  var hexCodes = [];
  var view = new DataView(buffer);
  for (var i = 0; i < view.byteLength; i += 4) {
    var value = view.getUint32(i)
    var stringValue = value.toString(16)
    var padding = '00000000'
    var paddedValue = (padding + stringValue).slice(-padding.length)
    hexCodes.push(paddedValue);
  }
  return hexCodes.join('');
}

async function hashString(str) {
  const enc = new TextEncoder();
  const buffer = await crypto.subtle.digest('SHA-1', enc.encode(str).buffer);
  return hex(buffer);
}

calcAccessToken = async function (origToken, salt, timestamp) {
  const timeSlot = timestamp - (timestamp % TIME_SLOT_SIZE);
  const tokenSlots = [timeSlot - TIME_SLOT_SIZE, timeSlot, timeSlot + TIME_SLOT_SIZE];
  const ret = [];
  for (let i = 0; i < tokenSlots.length; i++) {
    const hash = await hashString(`${origToken}|${salt}|${tokenSlots[i]}`);
    ret.push(hash)
  }
  return ret;
}
*/