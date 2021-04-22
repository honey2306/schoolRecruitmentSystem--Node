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
    //获取全部职业信息
    if (data.workType && (data.workType[0] !== 'qb')) {
      let sql0 = 'SElECT count(*) FROM work WHERE type = ? and approved = 1'
      let result0 = await sqlQurry(sql0, [data.workType[0]])
      total = result0[0]['count(*)']
      let sql = `SElECT * FROM work WHERE type = ? and approved = 1 limit ?, ?`
      result = await sqlQurry(sql, [data.workType[0], (data.currentPage - 1) * data.pageSize, data.pageSize])
    } else {
      let sql0 = ''
      let sql = ''
      if (data.admin) {
        sql0 = 'SElECT count(*) FROM work'
        sql = `SElECT * FROM work limit ?, ?`
      } else {
        sql0 = 'SElECT count(*) FROM work WHERE approved = 1'
        sql = `SElECT * FROM work WHERE approved = 1 limit ?, ?`
      }
      let result0 = await sqlQurry(sql0, [])
      total = result0[0]['count(*)']
      result = await sqlQurry(sql, [(data.currentPage - 1) * data.pageSize, data.pageSize])
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
    let sql0 = ''
    let sql2 = ''
    if (data.admin) {
      sql0 = 'SElECT count(*) FROM school'
      sql2 = 'SElECT school_id, username, name, address, icon, prove, approved, isHot, recruitmentAddress, recruitmentDate FROM school limit ?, ?'
    } else {
      sql0 = 'SElECT count(*) FROM school WHERE approved = 1'
      sql2 = 'SElECT school_id, username, name, address, icon, prove, approved, isHot, recruitmentAddress, recruitmentDate FROM school WHERE approved = 1 limit ?, ?'
    }
    let result0 = await sqlQurry(sql0, [])
    total = result0[0]['count(*)']
    returnInfo = await sqlQurry(sql2, [(data.currentPage - 1) * data.pageSize, data.pageSize])
  } else if (data.type === '3') {
    //获取全部企业信息
    if (data.companyType && (data.companyType[0] !== 'qb')) {
      let sql3 = 'SElECT company_id, name, address, icon FROM company WHERE type = ? and approved = 1 limit ?, ?'
      returnInfo = await sqlQurry(sql3, [data.companyType[0], (data.currentPage - 1) * data.pageSize, data.pageSize])
      let sql0 = 'SElECT count(*) FROM company WHERE type = ? and approved = 1'
      let result0 = await sqlQurry(sql0, [data.companyType[0]])
      total = result0[0]['count(*)']
    } else {
      let sql0 = ''
      let sql3 = ''
      if (data.admin) {
        sql0 = 'SElECT count(*) FROM company'
        sql3 = 'SElECT company_id, username, name, address, icon, prove, approved, isHot FROM company limit ?, ?'
      } else {
        sql0 = 'SElECT count(*) FROM company WHERE approved = 1'
        sql3 = 'SElECT company_id, username, name, address, icon, prove, approved, isHot FROM company WHERE approved = 1 limit ?, ?'
      }
      returnInfo = await sqlQurry(sql3, [(data.currentPage - 1) * data.pageSize, data.pageSize])
      let result0 = await sqlQurry(sql0, [])
      total = result0[0]['count(*)']
    }
  } else {
    //获取全部学生信息
    let sql0 = ''
    let sql2 = ''
    if (data.admin) {
      sql0 = 'SElECT count(*) FROM student'
      sql2 = 'SElECT id, username, name, school, resume, prove, approved FROM student limit ?, ?'
    } else {
      sql0 = 'SElECT count(*) FROM student WHERE approved = 1'
      sql2 = 'SElECT id, username, name, school, resume, prove, approved FROM student WHERE approved = 1 limit ?, ?'
    }
    let result0 = await sqlQurry(sql0, [])
    total = result0[0]['count(*)']
    returnInfo = await sqlQurry(sql2, [(data.currentPage - 1) * data.pageSize, data.pageSize])
  }

  returnInfo = {
    data: returnInfo,
    total: total
  }
  res.send(returnInfo)
})

module.exports = app
