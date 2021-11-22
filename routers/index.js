/*
    router for all the request
 */
const express = require('express')
const md5 = require('blueimp-md5')

const UserModel = require('../models/UserModel')
const CategoryModel = require('../models/CategoryModel')
const SetModel = require('../models/SetModel')

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
      res.send({status: 1, msg: 'login error'})
    })
})

//-------------------------------category--------------------------------
// get category list
router.get('/manage/category/list', (req, res) => {
  const parentId = req.query.parentId || '0'
  CategoryModel.find({parentId})
    .then(categorys => {
      res.send({status: 0, data: categorys})
    })
    .catch(error => {
      console.error('Get category list error.', error)
      res.send({status: 1, msg: 'Get category list error'})
    })
})

// add category list
router.post('/manage/category/add', (req, res) => {
  const {name, parentId} = req.body
  CategoryModel.create({name: name, parentId: parentId || '0'})
    .then(category => {
      res.send({status: 0, data: category})
    })
    .catch(error => {
      console.error('Add category error.', error)
      res.send({status: 1, msg: 'Add category error'})
    })
})

// update category list
router.post('/manage/category/update', (req, res) => {
  const {name, parentId} = req.body
  CategoryModel.findOneAndUpdate({_id: parentId}, {name: name})
    .then(result => {
      res.send({status: 0})
    })
    .catch(error => {
      console.error('Update category list, error.', error)
      res.send({status: 1, msg: 'Update category list, error'})
    })
})

// get the redisplay year with specific category ID
router.get('/manage/category/year', (req, res) => {
  const categoryId = req.query.categoryId // get the categoryId from request
  CategoryModel.findOne({_id: categoryId}) // query the data
    .then(year => {
      res.send({status: 0, data: year})
    })
    .catch(error => {
      console.error('Get redisplay year error', error)
      res.send({status: 1, msg: 'Get redisplay year error'})
    })
})




//----------------------------get the set info by pagination--------------------------
router.get('/manage/set/list', (req, res) => {
  const {pageNum, pageSize} = req.query // get the pageNum and pageSize from request
  SetModel.find({}) // query the database
    .then(sets => { // store the result in the sets
      res.send({status: 0, data: pageFilter(sets, pageNum, pageSize)}) // if successful, send data back to the client
    })
    .catch(error => {
      console.error('Get set info list error', error)
      res.send({status: 1, msg: 'Get set list info list error'}) // if unsuccessful, send error message to the client
    })
})

//----------------------------Search Set Info and pagincation-------------------------
router.get('/manage/set/search', (req, res) => {
  const {pageNum, pageSize, searchName} = req.query // get the searchName, pageSize and pageNum from request
  let condition = {name: new RegExp(`^.*${searchName}.*$`)} // create condition, for fuzzy query
  SetModel.find(condition) // query the database with condition
    .then(sets => { // store the result in the sets
      res.send({status: 0, data: pageFilter(sets, pageNum, pageSize)}) // if successful, send data back to the client
    })
    .catch(error => {
      console.error('Search set Info error', error)
      res.send({status: 1, msg: 'Search set Info error'}) // if unsuccessful, send error message to the client
    })
})

// pagination function
function pageFilter(arr, pageNum, pageSize) { // arr: data from database, pageNum: current page number, pageSize: page size
  pageNum = pageNum * 1 // convert to int
  pageSize = pageSize * 1 // convert to int
  const total = arr.length // total count of data
  const pages = Math.floor((total + pageSize - 1) / pageSize) // how many page of total data be divided
  const start = pageSize * (pageNum - 1) // start position
  const end = start + pageSize <= total ? start + pageSize : total // end position
  const list = [] // result set

  for (var i = start; i < end; i++) {
    list.push(arr[i])
  }

  return {pageNum, total, pages, pageSize, list}
}

module.exports = router