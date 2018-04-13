const crypto = require('crypto');
const nodemailer = require('nodemailer');

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

module.exports.sendEmail = function ({account, to, subject, text}) {
  return new Promise(function (resolve, reject) {
    let transporter = nodemailer.createTransport({
      host: account.smtp_address,
      secure: true,
      auth: {
        user: account.user,
        pass: account.pwd
      }
    });

    let mailObject = {
      from: `"Thoridal" <${account.email}>`,
      to,
      subject,
      text
    };

    transporter.sendMail(mailObject, (error, info) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}