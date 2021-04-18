let express = require('express')
let sqlQurry = require('../db/db')

let app = express()

app.get('/hot', async (req, res) => {
  //获取热门职业
  let sql = 'SElECT * FROM work WHERE isHot = ?'
  let result = await sqlQurry(sql, ['1'])
  let hotWork = []
  for (let i = 0; i < result.length; i++) {
    let tmp = {}
    tmp = result[i]
    let sql2 = 'SElECT name, icon FROM company WHERE company_id = ?'
    let result2 = await sqlQurry(sql2, [tmp.company_id])
    tmp.companyName = result2[0].name
    tmp.icon = result2[0].icon
    hotWork.push(tmp)
  }
 
  //获取热门学校
  let sql2 = 'SElECT school_id, name, address, icon FROM school WHERE isHot = ?'
  let hotSchool = await sqlQurry(sql2, ['1'])

  //获取热门企业
  let sql3 = 'SElECT company_id, name, address, icon FROM company WHERE isHot = ?'
  let hotCompany = await sqlQurry(sql3, ['1'])

  let returnInfo = {
    hotWork,
    hotSchool,
    hotCompany
  }
  res.send(returnInfo)
})

module.exports = app