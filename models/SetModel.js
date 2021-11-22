// SetModel use to operate set
// 1. import mongoose
const mongoose = require('mongoose')

// 2. set schema
const setSchema = new mongoose.Schema({
  categoryId: {type: String, required: true}, // category ID, year of the set, such as(2021, 2020, 2019)
  pCategoryId: {type: String, required: true}, // parent category ID, such as(Architecture, Batman™, Harry Potter™)
  name: {type: String, required: true}, // name of set
  price: {type: Number, required: true}, // price of set
  desc: {type: String}, // short desc of set
  imgs: {type: Array, default: []}, // address of images
  detail: {type: String} // detail of the set
})

// 3. collection(sets) of MongoDB
const SetModel = mongoose.model('sets', setSchema)

// 4. export Model
module.exports = SetModel