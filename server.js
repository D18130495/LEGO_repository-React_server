/*
  npm start "start": "node server.js" start the server
  use express to start the server
  parse json
  use cookie to store userid(1day)
  use router to navigation all requests
  use mongoose to connect the db
 */
const mongoose = require('mongoose')
const express = require('express')
const app = express()

// use static 
app.use(express.static('public'))

// Parsing request
app.use(express.urlencoded({extended: true}))
app.use(express.json()) // json structure: {name: admin, pwd: 123456}

// use router
const indexRouter = require('./routers')
app.use('/', indexRouter)  

// use mongoose to connect the db
mongoose.connect('mongodb://localhost/lego_repo', {useNewUrlParser: true})
  .then(() => {
    console.log('Database connection is successful!')
    // after connected the db, start the server
    app.listen('41571', () => {
      console.log('Server started successfully at http://localhost:41571')
    })
  })
  .catch(error => {
    console.error('Unable to connect to the db', error)
  })

