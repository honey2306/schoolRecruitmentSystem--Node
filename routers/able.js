let express = require('express')
let sqlQurry = require('../db/db')

let app = express()

app.put('/able', async (req, res) => {
  let data = req.query
  let sql = ''
  let result = ''
  if(data.type === '1') {
    //学生
    sql = `UPDATE student SET approved = ? WHERE id = ?`
    result = await sqlQurry(sql,[data.able, data.id])
  } else if (data.type === '2') {
    //职位
    if (data.able === '1') {
      let sql2 = 'SELECT * FROM work WHERE work_id = ?'
      let result2 = await sqlQurry(sql2, [data.id])
      sql2 = 'SELECT approved FROM company WHERE company_id = ?'
      result2 = await sqlQurry(sql2, [result2[0].company_id])
      if (result2[0].approved === 0) {
        result = '该职位的公司暂未启用，请先启用公司'
      } else {
        sql = `UPDATE work SET approved = ? WHERE work_id = ?`
        result = await sqlQurry(sql,[data.able, data.id])
      }
    } else {
      sql = `UPDATE work SET approved = ? WHERE work_id = ?`
      result = await sqlQurry(sql,[data.able, data.id])
    }
  } else if (data.type === '3') {
    //学校
    sql = `UPDATE school SET approved = ? WHERE school_id = ?`
    result = await sqlQurry(sql,[data.able, data.id])
  } else {
    //企业
    sql = `UPDATE company SET approved = ? WHERE company_id = ?`
    if (data.able === '0') {
        let sql2 = 'SELECT * FROM work WHERE approved = 1 and company_id = ?'
        let result2 = await sqlQurry(sql2, [data.id])
        for (var i = 0; i < result2.length; i++) {
          let sql3 = `UPDATE work SET approved = 0, isHot = 0 WHERE work_id = ?`
          let result3 = await sqlQurry(sql3,[result2[i].work_id])
          if (result3.affectedRows === 1) {
            console.log('企业下面的职位停用成功')
          } else {
            console.log('企业下面的职位停用失败')
          }
        }
    }
    result = await sqlQurry(sql,[data.able, data.id])
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
