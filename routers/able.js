let express = require('express')
let sqlQurry = require('../db/db')

let app = express()

app.put('/able', async (req, res) => {
  let data = req.query
  let sql = ''
  if(data.type === '1') {
    //学生
    sql = `UPDATE student SET approved = ? WHERE id = ?`
  } else if (data.type === '2') {
    //职位
    sql = `UPDATE work SET approved = ? WHERE work_id = ?`
  } else if (data.type === '3') {
    //学校
    sql = `UPDATE school SET approved = ? WHERE school_id = ?`
  } else {
    //企业
    sql = `UPDATE company SET approved = ? WHERE company_id = ?`
  } 
  let result = await sqlQurry(sql,[data.able, data.id])
  let returnInfo = {}

  if (result.affectedRows === 1) {
    returnInfo.status = '1'
    returnInfo.statusInfo = '成功'
  } else {
    returnInfo.status = '-1'
    returnInfo.statusInfo = '失败'
  }

  res.send(returnInfo)
  
})


module.exports = app