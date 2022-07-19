const utils = require('./index');

module.exports.initPinyin = async function(model) {
  try {
    const docs = await model.Record.find({ 
      NamePinyin: { $exists: false } 
    }).select('Name').exec();

    if (!docs || !docs.length) {
      return true;
    }

    for (let i = 0; i < docs.length; i += 1) {
      const doc = docs[i];
      await model.Record.updateOne({
        _id: doc._id
      }, {
        NamePinyin: utils.convertPinyin(doc.Name)
      }).exec();
    }

    console.log('initPinyin', docs.length);
    return true;
  } catch (e) {
    console.log('initPinyin', e);
    return false;
  }
}