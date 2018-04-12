const crypto = require('crypto');

module.exports.getValidTokens = function (now, origToken, salt, slotSize) {
  const timeSlot = now - (now % slotSize);
  const ret = [];
  for (let i = -1; i <= 1; i++) {
    let currentSlot = timeSlot + i * slotSize;
    let hash = crypto.createHash('sha256');
    hash.update(`${origToken}|${salt}|${currentSlot}`, 'utf8');
    ret.push(hash.digest('hex'));
  }
  return ret;
};