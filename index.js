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

// passport setup

passport.use(
    new LocalStrategy((username, password, done) => {
        User.findOne({ username: username }, (err, user) => {
            if (err) return done(err)
            if (!user) {
                return done(null, false, { msg: "Incorrect username" })
            }
            if (user.password !== password) {
                return done(null, false, { msg: "Incorrect password" })
            }
            return done(null, user)
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
app.use(express.urlencoded({ extended: false }))
app.get('/', (req, res) => {
    res.render('home', { user: req.user })
})

app.get('/sign-up', (req, res) => {
    res.render('sign-up')
})

app.get('/log-in', (req, res) => {
    res.render('log-in')
})

app.get("/log-out", (req, res) => {
    req.logout()
    res.redirect("/")
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

app.post("/log-in", passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/"
    })
)

app.use(function (req, res, next) {
    res.status(404).render('404')
  })

app.listen(port, () => {
    console.log(`app listening on http://localhost:${port}`)
})

module.exports = app