// Setup
require('dotenv').config()
const bcrypt = require('bcryptjs')
const express = require('express')
const { check, validationResult } = require('express-validator')
const exphbs = require('express-handlebars')
const path = require('path')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const flash = require('connect-flash')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const port = process.env.PORT || 300

// Models
const User = require('./models/User')
const Post = require('./models/Post')

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

app.use(express.static(path.join(__dirname, '/public')))

app.use(session({ secret: 'tyler', resave: false, saveUninitialized: true }))
app.use(flash())

// passport setup

passport.use(
    new LocalStrategy((username, password, done) => {
        User.findOne({ username: username }, (err, user) => {
            if (err) return done(err)
            if (!user) {
                return done(null, false, { msg: "Incorrect username" })
            }
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                  return done(null, user)
                } else {
                  return done(null, false, {msg: "Incorrect password"})
                }
            })
        })
    })
)

passport.serializeUser(function(user, done) {
    done(null, user.id)
})
  
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user)
    })
})

app.use(passport.initialize())
app.use(passport.session())

app.use(function(req, res, next) {
    res.locals.currentUser = req.user
    next()
})

app.use(express.urlencoded({ extended: false }))
app.get('/', (req, res) => {
    res.render('home', { user: req.user })
})

app.get('/sign-up', (req, res) => {
    res.render('sign-up')
})

app.get('/log-in', (req, res) => {
    res.render('log-in', { message: req.flash('info') })
})

app.get('/login-failed', (req, res) => {
    req.flash('info', 'Log in failed, did you spell everything correctly?')
    res.redirect('/log-in')
})

app.get("/log-out", (req, res) => {
    req.logout()
    res.redirect("/")
})

app.post("/sign-up", (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        const user = new User({
            username: req.body.username,
            password: hashedPassword
        }).save(err => {
            if (err) return next(err)
            passport.authenticate('local')(req, res, function () {
                res.render('home', { user: req.user });
            })
        })
    })
})

app.post("/log-in", passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login-failed",
        failureFlash: true
    })
)

app.use(function (req, res, next) {
    res.status(404).render('404')
  })

app.listen(port, () => {
    console.log(`app listening on http://localhost:${port}`)
})

module.exports = app
