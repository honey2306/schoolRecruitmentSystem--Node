let express = require('express')
let sqlQurry = require('../db/db')

let app = express()

app.put('/introChange', async (req, res) => {
  let data = req.body

  let id = ''
  if (data.identity === 'school') {
    id = req.session.info.user.school_id
    sql = `UPDATE school SET introduction = ? WHERE school_id = ?`
  } else {
    id = req.session.info.user.company_id
    sql = `UPDATE company SET introduction = ? WHERE company_id = ?`
  }
  result = await sqlQurry(sql,[data.intro, id])
  let returnInfo = {}
  if (result.affectedRows === 1) {
    returnInfo.status = '1'
    returnInfo.statusInfo = '修改成功'
  } else {
    returnInfo.status = '-1'
    returnInfo.statusInfo = '修改失败'
  }


  res.send(returnInfo)
  
})

module.exports = app