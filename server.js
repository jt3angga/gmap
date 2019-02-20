const express = require('express')
const next = require('next')

const port = parseInt(process.env.PORT, 10) || 3002
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  server.get('/data', (req, res) => {
    const start_date = req.query.start_date
    const end_date = req.query.end_date

    const data = require('./data.json')
    
    let histories = data.filter(function (item) {
      return (item.date >= start_date && item.date <= end_date)
    })

    res.json({data: histories})
  })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})