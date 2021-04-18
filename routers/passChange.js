let express = require('express')
let sqlQurry = require('../db/db')

let app = express()

app.put('/passChange', async (req, res) => {
  let user = req.body
  let returnInfo = {}
  let sql = `SELECT password FROM ${user.identity} WHERE username = ?`
  let result = await sqlQurry(sql, [user.username])
  if (result[0].password !== user.old_password) {
    returnInfo.status = '-1'
    returnInfo.statusInfo = '输入的原密码不正确'
  } else{
    let sql = `UPDATE ${user.identity} SET password = ? WHERE username = ?`
    let result = await sqlQurry(sql, [user.new_password, user.username])
    if (result.affectedRows === 1) {
      req.session.destroy()
      returnInfo.status = '1'
      returnInfo.statusInfo = '密码修改成功'
    } else {
      returnInfo.status = '-2'
      returnInfo.statusInfo = '密码修改失败'
    }
  }
  res.send(returnInfo) 
})

module.exports = app