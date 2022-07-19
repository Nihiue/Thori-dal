const crypto = require('crypto');
const nodemailer = require('nodemailer');
const pinyin = require('pinyin').default;

module.exports.getAccessToken = function (token, salt, time) {
  let hash = crypto.createHash('sha256');
  hash.update(`${token}|${salt}|${time}`, 'utf8');
  return hash.digest('base64');
};

function getIP(ctx) {
  const proxyIP = ctx.request.header['x-real-ip'] || ctx.request.header['x-forwarded-for'];
  if (proxyIP) {
    return proxyIP;
  }
  return (typeof ctx.ip === 'string') ? ctx.ip.split(':').pop() : '';
}

module.exports.getIP = getIP;

module.exports.createLog = async function(ctx, data) {
  data.IP = getIP(ctx);
  data.User = ctx.user ? ctx.user._id : '';
  await ctx.model.Log.create(data);
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
      resolve(info);
    });
  });
};

module.exports.convertPinyin = function (str) {
  if (typeof str !== 'string' || !str) {
    return '';
  }
  
  return pinyin(str, {
    style: 'normal',
    segment: false,  
    group: false
  }).flat().join('');
}