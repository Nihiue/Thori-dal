const crypto = require('crypto');
const nodemailer = require('nodemailer');

module.exports.getAccessToken = function (token, salt, time) {
  let hash = crypto.createHash('sha256');
  hash.update(`${token}|${salt}|${time}`, 'utf8');
  return hash.digest('hex');
};

module.exports.getIP = function getIP(ctx) {
  if (ctx.request.header['x-real-ip']) {
    return ctx.request.header['x-real-ip'];
  }
  return (typeof ctx.ip === 'string') ? ctx.ip.split(':').pop() : '';
}

module.exports.createLog = async function(ctx, data) {
  data.IP = getIP(ctx);
  data.User = ctx.user ? ctx.user._id : '';
  await ctx.model.Log.create(data);
}

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