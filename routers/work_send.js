let express = require('express')
let sqlQurry = require('../db/db')

let app = express()

app.post('/work_send', async (req, res) => {
  let data = req.body.data
  sql = `INSERT INTO professional_record (student_id, resume, work_id, apply_time, professional) VALUE (?, ?, ?, ?, ?)`
  result = await sqlQurry(sql, [data.student_id, data.resume, data.work_id, data.date, data.professional])
  console.log(result)
  let returnInfo = {}
  if (result.affectedRows === 1) {
    returnInfo.status = '1'
    returnInfo.statusInfo = '简历投递成功'
  } else {
    returnInfo.status = '-1'
    returnInfo.statusInfo = '简历投递失败'
  }
  res.send(returnInfo)
})

module.exports = app