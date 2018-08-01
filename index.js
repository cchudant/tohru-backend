const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const passport = require('passport')
const session = require('cookie-session')
const chalk = require('chalk')

const passportConfig = require('./src/passport')
const routes = require('./src/routes')

const {
  DB_URI = 'mongodb://localhost:27017/tohru',
  SECRET = 'imaweeb',
  PORT = 5050,
  ALLOWED_ORIGIN = 'http://localhost:8080'
} = process.env

const app = express()

// DB
mongoose.connect(
  DB_URI,
  { useNewUrlParser: true }
)

// Middlewares
app.use(morgan('dev'))
app.use(cookieParser(SECRET))
app.use(bodyParser.json())

// Cors
app.use(
  cors({
    origin: [ALLOWED_ORIGIN],
    credentials: true
  })
)

// Auth middlewares
app.use(
  session({
    secret: SECRET,
    resave: false,
    saveUninitialized: true
  })
)
app.use(passport.initialize())
app.use(passport.session())

passportConfig(passport)

// Init routes
const context = { app, passport }
Object.values(routes).forEach(route => {
  route(context)
})

// Launch
app.listen(PORT)
console.log(
  chalk.blue(`Waiting for your orders on port ${chalk.green(PORT)}, master!`)
)
