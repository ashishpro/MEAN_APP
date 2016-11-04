var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MsgSchema = new Schema({
  author : {type: Schema.Types.ObjectId, ref : 'User'},
  content : String,
  created : {type: Date, defauly: Date.now}
});

module.exports = mongoose.model('Msg', MsgSchema);
