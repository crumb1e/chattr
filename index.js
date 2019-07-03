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
const port = process.env.PORT || 300

// Models
const User = require('./models/User')

const mongoDB = process.env.MONGO_CONNECT_STRING
mongoose.connect(mongoDB, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', console.error.bind(console, 'mongo connection error'))

const app = express()
app.engine('handlebars', exphbs({
    extname: 'handlebars',
    defaultLayout: 'main',
    partialsDir: path.join(__dirname, 'views/partials'),
    layoutsDir: path.join(__dirname, 'views/layouts')
  }));
app.set('view engine', 'handlebars');
app.set('views',path.join(__dirname,'views'))


app.use(session({ secret: 'tyler', resave: false, saveUninitialized: true }))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.urlencoded({ extended: false }))
app.get('/', (req, res) => {
    res.render('home')
})

app.get('/sign-up', (req, res) => {
    res.render('sign-up')
})

app.post("/sign-up", (req, res, next) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    }).save(err => {
        if (err) return next(err)
        res.redirect("/")
    })
})

app.listen(port, () => {
    console.log(`app listening on http://localhost:${port}`)
})

module.exports = app
