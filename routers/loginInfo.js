let express = require('express')

let app = express()

app.get('/loginInfo', (req, res) => {
  let returnInfo = {}
  if (req.session.info) {
    returnInfo.user = req.session.info.user
    returnInfo.status = req.session.info.status
    returnInfo.statusInfo = '登录成功'

  } else {
    returnInfo.status = '-1'
    returnInfo.statusInfo = '未登录'
  }
  res.send(returnInfo) 
})

module.exports = app