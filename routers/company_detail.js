let express = require('express')
let sqlQurry = require('../db/db')

let app = express()

app.get('/company_detail', async (req, res) => {
  let company_id = req.query.company_id
  console.log(req.query);
  let sql = 'SElECT name, address, icon, introduction, type, state, personcount FROM company WHERE company_id = ?'
  let result = await sqlQurry(sql, [company_id])
  console.log(result);
  switch (result[0].type) {
    case 'hlw':
      result[0].type = '互联网公司'
      break
    case 'jy':
      result[0].type = '在线教育公司'
      break
    case 'shfu':
      result[0].type = '生活服务公司'
      break
    default:
      result[0].type = '人力资源公司'
  }
  switch (result[0].state) {
    case '0':
      result[0].state = '未融资'
      break
    case '1':
      result[0].tystatepe = '天使轮'
      break
    case '2':
      result[0].state = '已上市'
      break
    default:
      result[0].state = '不需要融资'
  }
  switch (result[0].personcount) {
    case '0':
      result[0].personcount = '0-100人'
      break
    case '1':
      result[0].personcount = '100-1000人'
      break
    case '2':
      result[0].personcount = '1000-10000人'
      break
    default:
      result[0].personcount = '10000人以上'
  }
  let returnInfo = {
    status: 1,
    statusInfo: '获取成功',
    data: result[0],
  }
  res.send(returnInfo)
})

module.exports = app