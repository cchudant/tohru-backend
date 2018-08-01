const { promises: fs } = require('fs')
const { join, relative, isAbsolute } = require('path')
const { needLogged } = require('../auth')

const { DIR = join(__dirname, '../..') } = process.env

module.exports = function({ app }) {
  app.get('*', needLogged(), async (req, res) => {
    const path = unescape(req.url)
    const realPath = join(DIR, path)

    res.header('X-Path', path)

    const rel = relative(realPath, DIR)
    if (rel && !rel.startsWith('..') && !isAbsolute(rel)) {
      // Block what you are not supposed to access
      res.status(404).json({ message: 'NOT FOUND' })
      return
    }

    try {
      const stats = await fs.stat(realPath)

      if (stats.isFile()) {
        // Download file

        res.header('X-Type', 'File').sendFile(realPath)
      } else if (stats.isDirectory()) {
        // Read directory content
        const read = await fs.readdir(realPath)
        const withSlash = await Promise.all(
          read.map(f =>
            fs
              .stat(join(realPath, f))
              .catch(() => null)
              .then(stats => (stats.isDirectory() ? f + '/' : f))
          )
        )
        const files = withSlash.filter(f => f)

        res.header('X-Type', 'Directory').json({ path, files })
      } else {
        // Other file types
        res.status(500).json({ message: "CAN'T READ THAT" })
      }
    } catch (e) {
      // Not found & other errors
      res.status(404).json({ message: 'NOT FOUND' })

      if (e.code !== 'ENOENT') console.error(e)
    }
  })
}
