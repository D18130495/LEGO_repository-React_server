/*
    router for all the request
 */
const express = require('express')
const md5 = require('blueimp-md5')

const UserModel = require('../models/UserModel')
const CategoryModel = require('../models/CategoryModel')

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

//-------------------------------category--------------------------------
// add category
router.post('/manage/category/add', (req, res) => {
  const {categoryName, parentId} = req.body
  CategoryModel.create({name: categoryName, parentId: parentId || '0'})
    .then(category => {
      res.send({status: 0, data: category})
    })
    .catch(error => {
      console.error('Add category error.', error)
      res.send({status: 1, msg: 'Add category error, try again.'})
    })
})

// get category list
router.get('/manage/category/list', (req, res) => {
  const parentId = req.query.parentId || '0'
  CategoryModel.find({parentId})
    .then(categorys => {
      res.send({status: 0, data: categorys})
    })
    .catch(error => {
      console.error('Get category list error.', error)
      res.send({status: 1, msg: 'Get category list error, try again.'})
    })
})

// update category list
router.post('/manage/category/update', (req, res) => {
  const {categoryId, categoryName} = req.body
  CategoryModel.findOneAndUpdate({_id: categoryId}, {name: categoryName})
    .then(oldCategory => {
      res.send({status: 0})
    })
    .catch(error => {
      console.error('Update category list, error.', error)
      res.send({status: 1, msg: 'Update category list, error, try again.'})
    })
})

module.exports = router