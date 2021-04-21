const crypto = require('crypto');

function sha256(str) {
  return crypto.createHash('sha256').update(str, 'utf8').digest();
}

function getRandomKey(password) {
  const userMasterKey = Buffer.from(crypto.randomFillSync(new Uint8Array(32))).toString('base64');

  const iv = Buffer.from(crypto.randomFillSync(new Uint8Array(16)));
  let key = Buffer.from(sha256(password));

  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(userMasterKey, 'uft8', 'base64');
  encrypted += cipher.final('base64');
  return {
    Data: encrypted,
    IV: Buffer.from(iv).toString('base64')
  };
}

function genUserToken(name, password) {
  const salt1 = '5083785e-9c1b-4a3b-a487-190e4409ad0d';
  const salt2 = 'd0b2cbe0-bff1-463d-9750-68e53ada7a44';
  const hashedPassword = sha256(password + salt1).toString('base64');
  return sha256(`${name}|${salt2}|${hashedPassword}`).toString('base64');
}

module.exports.createRootUser = async function (model, { name, password, email }) {
  try {
    if (!name || !password || !email) {
      throw new Error('invalid config');
    }
    const anyExistUser = await model.User.findOne({ AdminFlag: true }).select('_id').exec();
    if (anyExistUser) {
      return false;
    }

    const newUser = {
      Name: name,
      AdminFlag: true,
      Email: email,
      Token: genUserToken(name, password),
      Key: getRandomKey(password)
    };
    await model.User.create(newUser);
    console.log('Root user created:', name);
    return true;
  } catch (e) {
    console.log('Cannot create root user:', name);
    return false;
  }
}