let express = require('express')
let sqlQurry = require('../db/db')
let chooseIdentity = require('../utils/chooseIdentity')
let isLogin = require('../utils/isLogin')
var session = require("express-session")

let login = express()



login.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

login.use(express.json())
login.post ('/login',async (req, res) => {
  let returnInfo = {}
  var isLoginInfo = isLogin(req, res)
  if (isLoginInfo) {
    res.send(req.session.info.data)
  } else {
    let data = req.body
    let tableName = chooseIdentity(data.identityValue)
    let sql = `SElECT * FROM ${tableName}`
    let result = await sqlQurry(sql, [])
    let flag = 0
    result.forEach(element => {
      if (element.username === data.username && element.password === data.password) {
        flag++
        returnInfo.user = element
      }
    })
    if (flag === 1) {
      console.log("登录成功");
      returnInfo.status = 1
      returnInfo.statusInfo = '登录成功'
      returnInfo.user.identity = tableName
      req.session.info={
        status: '1',
        user: returnInfo.user
      }
    } else {
      console.log("登录失败");
      returnInfo.status = -1
      returnInfo.statusInfo = '用户名或者密码错误'
      returnInfo.user = ''
    }
    delete returnInfo.user.password
  }
  res.send(returnInfo)
})

module.exports = login