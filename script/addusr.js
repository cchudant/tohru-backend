#!/bin/env node
const { prompt } = require('inquirer')
const mongoose = require('mongoose')
const User = require('../src/models/User')

const { DB_URI = 'mongodb://localhost:27017/tohru' } = process.env

// DB
mongoose.connect(
  DB_URI,
  { useNewUrlParser: true }
)

prompt([
  { name: 'username' },
  { name: 'password', type: 'password' },
  { name: 'role' }
])
  .then(async ({ username, password, role }) => {
    const user = await User.findOne({ username })
    if (user)
      throw 'Username already taken'

    const created = new User({ username, role: role || undefined })
    await created.generateHash(password)
    await created.save()

    console.log('Done!')
    process.exit(0)
  })
  .catch(e => {
    console.error(e)
    process.exit(1)
  })