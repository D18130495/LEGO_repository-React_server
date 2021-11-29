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
      res.send({status: 0, data: user})
    })
    .catch(error => {
      console.error('lognin error.', error)
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

// delete the category year 
router.get('/manage/category/year/delete', (req, res) => {
  const yearID = req.query.yearID
  CategoryModel.deleteOne({_id: yearID})
    .then(result => {
      res.send({status: 0})
    })
    .catch(error => {
      console.error('Delete category year error', error)
      res.send({status: 1, msg: 'Delete category year error'})
    })
})
//------------------------------------------------------------------------------------



//----------------------------operation with set info---------------------------------
//-----------------------------------add set info-------------------------------------
router.post('/manage/set/add', (req, res) => {
  const set = req.body
  SetModel.create(set)
    .then(set => {
      res.send({status: 0, data: set})
    })
    .catch(error => {
      console.error('Add set info error', error)
      res.send({status: 1, msg: 'Add set info error'})
    })
})

//-----------------------------------update set info-------------------------------------
router.post('/manage/set/update', (req, res) => {
  const set = req.body
  SetModel.findOneAndUpdate({_id: set._id}, set)
    .then(result => {
      res.send({status: 0})
    })
    .catch(error => {
      console.error('Update set info error', error)
      res.send({status: 1, msg: 'Update set info error'})
    })
})

//-----------------------------------delete set info-------------------------------------
router.post('/manage/set/delete', (req, res) => {
  const {setID} = req.body
  SetModel.deleteOne({_id: setID})
    .then(result => {
      res.send({status: 0})
    })
    .catch(error => {
      console.error('Delete set info error', error)
      res.send({status: 1, msg: 'Delete set info error'})
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

//----------------------------Search Set Info and pagination-------------------------
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
//-----------------------------------------------------------------------------------------------------------------




//--------------------------------------------operation with user--------------------------------------------------
//--------------------------------------------get user list--------------------------------------------------------
router.get('/manage/user/list', (req, res) => {
  UserModel.find()
    .then(users => {
      res.send({status: 0, data: users})
    })
    .catch(error => {
      console.error('Get user list error', error)
      res.send({status: 1, msg: 'Get user list error'})
    })
})

//-----------------------------------------------add user-----------------------------------------------------------
router.post('/manage/user/add', (req, res) => {
  const {password} = req.body
  UserModel.create({...req.body, password: md5(password)})
    .then(user => {
      res.send({status: 0, data: user})
    })
    .catch(error => {
      console.error('Add user error', error)
      res.send({status: 1, msg: 'Add user error'})
    })
})

//---------------------------------------------update user-----------------------------------------------------------
router.post('/manage/user/update', (req, res) => {
  const user = req.body
  UserModel.findOneAndUpdate({_id: user._id}, user)
    .then(result => {
      res.send({status: 0})
    })
    .catch(error => {
      console.error('Update user info error', error)
      res.send({status: 1, msg: 'Update user info error'})
    })
})

//----------------------------------------------delete user-----------------------------------------------------------
router.post('/manage/user/delete', (req, res) => {
  const {userID} = req.body
  UserModel.deleteOne({_id: userID})
    .then(result => {
      res.send({status: 0})
    })
    .catch(error => {
      console.error('Delete user error', error)
      res.send({status: 1, msg: 'Delete user error'})
    })
})
//-----------------------------------------------------------------------------------------------------------------
require('./imageUpload')(router)

module.exports = router