/*
  model for category
 */
// import mongoose
const mongoose = require('mongoose')

// Category Schema
const categorySchema = new mongoose.Schema({
  name: {type: String, required: true},
  parentId: {type: String, required: true, default: '0'}
})

// create Model in the mogodb
const CategoryModel = mongoose.model('categorys', categorySchema)

// expore user model
module.exports = CategoryModel