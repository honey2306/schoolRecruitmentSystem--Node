let express = require('express')
let sqlQurry = require('../db/db')

let app = express()

app.get('/work_detail', async (req, res) => {
  let work_id = req.query.work_id
  let sql = 'SElECT * FROM work WHERE work_id = ?'
  let result = await sqlQurry(sql, [work_id])
  result[0].introduction = result[0].introduction.split('；')
  result[0].requirements = result[0].requirements.split('；')
  let sql2 = 'SElECT introduction, icon, name FROM company WHERE company_id = ?'
  let company = await sqlQurry(sql2, [result[0].company_id])
  result[0]['company'] = company[0]

  let returnInfo = {
    status: 1,
    statusInfo: '获取成功',
    data: result[0],
  }
  res.send(returnInfo)
})

module.exports = app