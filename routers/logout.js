let express = require('express')

let app = express()

app.get('/logout', (req, res) => {
  req.session.destroy()
  let returnInfo = {
    status : '1',
    statusInfo : '登出成功'
  }
  res.send(returnInfo) 
})

module.exports = app