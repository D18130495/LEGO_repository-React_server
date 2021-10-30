/*
    router for all the request
 */
const express = require('express')
const md5 = require('blueimp-md5')

const UserModel = require('../models/UserModel')

// get the router
const router = express.Router()

// login
router.post('/login', (req, res) => {
  const {username, password} = req.body
  // use username and password to find a user
  UserModel.findOne({username, password: md5(password)})
    .then(user => {
      if (user) { // login successful
        // generate a cookie 'userid' and store in the browser(1day)
        res.cookie('userid', user._id, {maxAge: 1000 * 60 * 60 * 24})
        if (user.role_id) {
          RoleModel.findOne({_id: user.role_id})
            .then(role => {
              user._doc.role = role
              console.log('role user', user)
              res.send({status: 0, data: user})
            })
        } else {
          user._doc.role = {menus: []}
          // login successful and send back response message
          res.send({status: 0, data: user})
        }

      } else {// login failed.
        res.send({status: 1, msg: 'username or password is incorrect.'})
      }
    })
    .catch(error => {
      console.error('lognin error.', error)
      // connection failed message
      res.send({status: 1, msg: 'login error, please try again.'})
    })
})

module.exports = router