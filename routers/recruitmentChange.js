let express = require('express')
let sqlQurry = require('../db/db')

let app = express()

app.put('/recruitmentChange', async (req, res) => {
  let data = req.body
  let id = ''
  if (data.identity === 'school') {
    sql = `UPDATE school SET recruitmentDate = ? , recruitmentAddress = ? WHERE school_id = ?`
    id = req.session.info.user.school_id
  } else {
    sql = `UPDATE campany SET recruitmentDate = ? , recruitmentAddress = ? WHERE company_id = ?`
    id = req.session.info.user.company_id
  }
  result = await sqlQurry(sql,[data.date, data.address, id])
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