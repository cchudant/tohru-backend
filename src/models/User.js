const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const schema = mongoose.Schema({
  username: String,
  password: String,
  role: String
})

schema.methods.generateHash = async function(password) {
  this.password = await bcrypt.hash(password, 12)
}

schema.methods.validPassword = function(password) {
  return bcrypt.compare(password, this.password)
}

module.exports = mongoose.model('User', schema)
