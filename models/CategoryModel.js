// CategoryModel use to operate category
// 1. import mongoose
const mongoose = require('mongoose')

// 2. category Schema
const categorySchema = new mongoose.Schema({
  name: {type: String, required: true}, // the name of the category
  parentId: {type: String, required: true, default: '0'} // the parent ID of the category
})

// 3. collection(categorys) of MongoDB
const CategoryModel = mongoose.model('categorys', categorySchema)

// 4. export Model
module.exports = CategoryModel