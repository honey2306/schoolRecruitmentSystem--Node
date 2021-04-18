let express = require('express')
let sqlQurry = require('../db/db')
let Sglobal = require('../global')

let app = express()

app.post('/all_information', async (req, res) => {
  let returnInfo = []
  let data = req.body
  let total = 0
  if (data.type === '1') {
    let result = ''
    //获取全部职业信息   select * from table limit(curPage-1)*pageSize,pageSize
    if (data.workType && (data.workType[0] !== 'qb')) {
      let sql0 = 'SElECT count(*) FROM work WHERE type = ?'
      let result0 = await sqlQurry(sql0, [data.workType[0]])
      total = result0[0]['count(*)']
      let sql = `SElECT * FROM work WHERE type = ? limit ?, ?`
      result = await sqlQurry(sql, [data.workType[0], (data.currentPage - 1)* data.pageSize,  data.pageSize])
    } else {
      let sql0 = 'SElECT count(*) FROM work'
      let result0 = await sqlQurry(sql0, [])
      total = result0[0]['count(*)']
      let sql = `SElECT * FROM work limit ?, ?`
      result = await sqlQurry(sql, [(data.currentPage - 1)* data.pageSize,  data.pageSize])
    }
    
    for (let i = 0; i < result.length; i++) {
      let tmp = {}
      tmp = result[i]
      let sql2 = 'SElECT name, icon, type, state, personcount FROM company WHERE company_id = ?'
      let result2 = await sqlQurry(sql2, [tmp.company_id])
      tmp.companyName = result2[0].name
      tmp.icon = result2[0].icon
      tmp.type = Sglobal.getType(result2[0].type) 
      tmp.state = Sglobal.getState(result2[0].state) 
      tmp.personcount = Sglobal.getPersoncount(result2[0].personcount) 
      returnInfo.push(tmp)
    }
  } else if (data.type === '2') {
    //获取全部学校信息
    let sql0 = 'SElECT count(*) FROM school'
    let result0 = await sqlQurry(sql0, [])
    total = result0[0]['count(*)']
    let sql2 = 'SElECT school_id, name, address, icon FROM school limit ?, ?'
    returnInfo = await sqlQurry(sql2, [(data.currentPage - 1)* data.pageSize,  data.pageSize])
  } else {
    //获取全部企业信息
    if (data.companyType && (data.companyType[0] !== 'qb')) {
      let sql3 = 'SElECT company_id, name, address, icon FROM company WHERE type = ? limit ?, ?'
      returnInfo = await sqlQurry(sql3, [data.companyType[0], (data.currentPage - 1)* data.pageSize,  data.pageSize])
      console.log(data.companyType[0]);
      let sql0 = 'SElECT count(*) FROM company WHERE type = ?'
      let result0 = await sqlQurry(sql0, [data.companyType[0]])
      total = result0[0]['count(*)']
    } else {
      let sql3 = 'SElECT company_id, name, address, icon FROM company limit ?, ?'
      returnInfo = await sqlQurry(sql3, [(data.currentPage - 1)* data.pageSize,  data.pageSize])
      let sql0 = 'SElECT count(*) FROM company'
      let result0 = await sqlQurry(sql0, [])
      total = result0[0]['count(*)']
    }
  }

  returnInfo = {
    data: returnInfo,
    total: total
  }
  res.send(returnInfo)
})

module.exports = app