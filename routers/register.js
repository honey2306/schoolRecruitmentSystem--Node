let express = require('express')
let sqlQurry = require('../db/db')
let Sglobal = require('../global')
let chooseIdentity = require('../utils/chooseIdentity')

let app = express()


app.post('/register', async (req, res) => {
  let registerInfo = req.body
  let tableName = chooseIdentity(registerInfo.identity)
  let sql = `SElECT username FROM ${tableName}`
  let result = await sqlQurry(sql, [])
  let registerUserName = registerInfo.username
  let userNameList = []
  let returnInfo = {}
  result.forEach(element => {
    userNameList.push(element.username)
  })
  let flag = userNameList.indexOf(registerUserName)
  if (flag === -1) {
    let sql2 = ''
    let result2 = {}
    if (tableName === 'student') {
      sql2 = `INSERT INTO ${tableName} (username, password, name, school, resume, prove, approved) VALUE (?, ?, ?, ?, ?, ?, ?)`
      result2 = await sqlQurry(sql2, [registerInfo.username, registerInfo.password,registerInfo.username, 'null', 'null', registerInfo.prove, '0'])
    } else if (tableName === 'school') {
      sql2 = `INSERT INTO ${tableName} (username, password, name, address, introduction, icon, prove, approved, isHot) VALUE (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      result2 = await sqlQurry(sql2, [registerInfo.username, registerInfo.password,registerInfo.username, 'null', 'null', 'null', registerInfo.prove, '0', '0'])
    } else{
      sql2 = `INSERT INTO ${tableName} (username, password, name, address, introduction, type, state, personcount, icon, prove, approved, isHot) VALUE (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      result2 = await sqlQurry(sql2, [registerInfo.username, registerInfo.password, registerInfo.username, 'null', 'null', 'null', 'null', 'null', 'null',registerInfo.prove, '0', '0'])
    }
    if (result2.affectedRows !== 0) {
      returnInfo.status = '1'
      returnInfo.statusInfo = '注册成功'
      returnInfo.username = registerUserName
      returnInfo.identity = tableName
      Sglobal.set('identity', tableName)
      Sglobal.set('username', registerInfo.username)
      console.log('注册成功');
    } else {
      console.log('插入失败!');
      returnInfo.status = '-2'
      returnInfo.statusInfo = '数据库导入数据失败'
    }
  } else {
    returnInfo.status = '-1'
    returnInfo.statusInfo = '该用户已经注册，请直接登录'
    console.log('该用户已经注册，请直接登录');
  }
  console.log(returnInfo);
  res.send(returnInfo)
})

module.exports = app