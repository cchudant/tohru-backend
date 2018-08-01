const { needAdmin } = require('../auth')

module.exports = function({ app, passport }) {
  app.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) next(err)

      if (!user) return res.status(401).json(info)

      req.login(user, err => {
        if (err) next(err)
        res.json({
          message: 'Success',
          username: user.username,
          role: user.role
        })
      })
    })(req, res, next)
  })

  app.post('/signup', needAdmin(), (req, res, next) => {
    passport.authenticate('local-signup', (err, user, info) => {
      if (err) next(err)

      if (!user) return res.status(401).json(info)

      res.json({ message: 'Success', username: user.username, role: user.role })
    })(req, res, next)
  })

  app.post('/logged', (req, res, next) => {
    const username = req.user && req.user.username
    const role = req.user && req.user.role
    res.json({ logged: !!username, username, role })
  })

  app.post('/logout', (req, res, next) => {
    req.logout()
    res.json({ message: 'Success' })
  })
}
