// Setup
require('dotenv').config()
const express = require('express')
const { check, validationResult } = require('express-validator')
const exphbs = require('express-handlebars')
const path = require('path')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Models
const User = require('./models/User')

const mongoDB = process.env.MONGO_CONNECT_STRING
mongoose.connect(mongoDB, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', console.error.bind(console, 'mongo connection error'))

const app = express()
app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')


app.use(session({ secret: 'tyler', resave: false, saveUninitialized: true }))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.urlencoded({ extended: false }))
app.get('/', (req, res) => {
    res.render('home')
})

app.listen(3000, () => {
    console.log('app listening on http://localhost:3000')
})
