require('dotenv').config()
const express = require('express')
const path = require('path')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const mongoDB = process.env.MONGO_CONNECT_STRING
mongoose.connect(mongoDB, { useNewUrlParser: true })
const db = mongoose.connection
