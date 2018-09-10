module.exports = {
  needLogged() {
    return (req, res, next) => {
      if (req.user && req.user.username) return next()

      res.status(401).json({ message: 'You are not logged' })
    }
  },
  needAdmin() {
    return (req, res, next) => {
      if (req.user && req.user.role && req.user.role === 'admin') return next()

      res.status(401).json({ message: 'You are not admin' })
    }
  }
}
