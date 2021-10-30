/*
  model for user 
 */
// import mongoose and md5 encryption
const mongoose = require('mongoose')
const md5 = require('blueimp-md5')

// User Schema
const userSchema = new mongoose.Schema({
  username: {type: String, required: true},
  password: {type: String, required: true},
  phone: String,
  email: String,
  create_time: {type: Number, default: Date.now},
  role_id: String
})

// create Model in the mogodb
const UserModel = mongoose.model('users', userSchema)

// defaule root user: admin/123456
UserModel.findOne({username: 'admin'}).then(user => {
  if(!user) {
    UserModel.create({username: 'admin', password: md5('123456')})
      .then(user => {
        console.log('Root user: {username : admin, password : 123456}')
      })
  }
})

// expore user model
module.exports = UserModel