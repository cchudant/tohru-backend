const { Strategy: LocalStrategy } = require('passport-local')
const User = require('./models/User')

module.exports = function(passport) {
  // used to serialize the user for the session
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  // used to deserialize the user
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })

  passport.use(
    'local',
    new LocalStrategy((username, password, done) => {
      return User.findOne({ username })
        .then(async user => {
          if (!user || !(await user.validPassword(password)))
            return done(null, false, { message: 'Invalid cridentals' })

          done(null, user)
        })
        .catch(e => done(e))
    })
  )

  passport.use(
    'local-signup',
    new LocalStrategy((username, password, done) => {
      return User.findOne({ username })
        .then(async user => {
          if (user)
            return done(null, false, { message: 'Username already taken' })

          const created = new User({ username })
          await created.generateHash(password)
          await created.save()

          done(null, created)
        })
        .catch(e => done(e))
    })
  )
}
