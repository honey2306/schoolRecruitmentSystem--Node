let express = require('express')
let sqlQurry = require('../db/db')

let app = express()

app.get('/school_detail', async (req, res) => {
  let school_id = req.query.school_id
  console.log(req.query);
  let sql = 'SElECT name, address, icon, introduction FROM school WHERE school_id = ?'
  let result = await sqlQurry(sql, [school_id])
  console.log(result);
  let returnInfo = {
    status: 1,
    statusInfo: '获取成功',
    data: result[0],
  }
  res.send(returnInfo)
})

module.exports = app