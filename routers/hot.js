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


app.put('/hot', async (req, res) => {
  let data = req.query
  let sql = ''
  let result = ''
  if (data.type === '2') {
    //职位
    if (data.isHot === '1') {
      let sql2 = 'SELECT * FROM work WHERE work_id = ?'
      let result2 = await sqlQurry(sql2, [data.id])
      sql2 = 'SELECT approved FROM company WHERE company_id = ?'
      result2 = await sqlQurry(sql2, [result2[0].company_id])
      if (result2[0].approved === 0) {
        result = '该职位的公司暂未启用，请先启用公司'
      } else {
        sql = `UPDATE work SET isHot = ? WHERE work_id = ?`
        result = await sqlQurry(sql,[data.isHot, data.id])
      }
    } else {
      sql = `UPDATE work SET isHot = ? WHERE work_id = ?`
      result = await sqlQurry(sql,[data.isHot, data.id])
    }
  } else if (data.type === '3') {
    //学校
    sql = `UPDATE school SET isHot = ? WHERE school_id = ?`
    result = await sqlQurry(sql,[data.isHot, data.id])
  } else {
    //企业
    sql = `UPDATE company SET isHot = ? WHERE company_id = ?`
    result = await sqlQurry(sql,[data.isHot, data.id])
  }
  let returnInfo = {}

  if (result.affectedRows) {
    if (result.affectedRows === 1) {
      returnInfo.status = '1'
      returnInfo.statusInfo = '成功'
    } else {
      returnInfo.status = '-1'
      returnInfo.statusInfo = '失败'
    }
  } else {
    returnInfo.status = '-2'
    returnInfo.statusInfo = result
  }

  res.send(returnInfo)

})

module.exports = app
