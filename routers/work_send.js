let express = require('express')
let sqlQurry = require('../db/db')

let app = express()

app.post('/work_send', async (req, res) => {
  let data = req.body.data

  let sql = ''
  let result = ''
  let flag = false
  sql = `SElECT * FROM  professional_record WHERE student_id = ?`
  result = await sqlQurry(sql, [req.session.info.user.id])
  result.forEach( item => {
    if (item.work_id === data.work_id) {
      flag = true
    }
  })

  let returnInfo = {}
  if (flag) {
    returnInfo.status = '-2'
    returnInfo.statusInfo = '您已经投递过该岗位！'
  } else {
    sql = `INSERT INTO professional_record (student_id, resume, work_id, apply_time, professional, checked) VALUE (?, ?, ?, ?, ?, ?)`
    result = await sqlQurry(sql, [data.student_id, data.resume, data.work_id, data.date, data.professional, 0])
    if (result.affectedRows === 1) {
      returnInfo.status = '1'
      returnInfo.statusInfo = '简历投递成功'
    } else {
      returnInfo.status = '-1'
      returnInfo.statusInfo = '简历投递失败'
    }
  }

  res.send(returnInfo)
})

module.exports = app
