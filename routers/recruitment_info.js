let express = require('express')
let sqlQurry = require('../db/db')

let app = express()

app.get('/recruitment_info', async (req, res) => {
  let id = ''
  let sql = ''
  let recruitments = []
  if (!req.session.info) {
    sql = `SElECT * FROM recruitment_info`
    recruitments = await sqlQurry(sql, [])
    for (let i = 0; i < recruitments.length; i++) {
      sql = `SElECT name FROM company WHERE company_id = ?`
      let company = await sqlQurry(sql, [recruitments[i].company_id])
      sql = `SElECT name FROM school WHERE school_id = ?`
      let school = await sqlQurry(sql, [recruitments[i].school_id])
      recruitments[i].school_name = school[0].name
    }

  } else {
    let identity = req.session.info.user.identity
    if (identity === 'school') {
      id = req.session.info.user.school_id
      sql = `SElECT * FROM recruitment_info WHERE school_id = ?`
    } else {
      id = req.session.info.user.company_id
      sql = `SElECT * FROM recruitment_info WHERE company_id = ?`
    }
    let recruitment_info = await sqlQurry(sql, [id])
    for (let i = 0; i < recruitment_info.length; i++) {
      let tmp = {
        recruitment_id: recruitment_info[i].recruitment_id,
        date: recruitment_info[i].interview_time,
        professional: recruitment_info[i].profession,
        address: recruitment_info[i].address
      }
      if (identity === 'school') {
        sql = `SElECT name FROM company WHERE company_id = ?`
        let company = await sqlQurry(sql, [recruitment_info[i].company_id])
        tmp.company_name = company[0].name
        recruitments.push(tmp)
      } else {
        sql = `SElECT name FROM school WHERE school_id = ?`
        let school = await sqlQurry(sql, [recruitment_info[i].school_id])
        tmp.school_name = school[0].name
        recruitments.push(tmp)
      }
    }
  }

  res.send(recruitments)
})

app.post('/recruitment_info', async (req, res) => {
  let data = req.body
  let sql = `SElECT * FROM recruitment_info WHERE school_id = ?`
  let recruitments = await sqlQurry(sql, [data.school])
  let flag = false
  recruitments.forEach(element => {
    if (element.interview_time === data.date && element.address === data.address) {
      flag = true
    }
  });
  let returnInfo = {}
  if (flag) {
    returnInfo = {
      status: '-1',
      statusInfo: '该时间点该教室已经被占用！'
    }
  } else {
    let sql2 = `INSERT INTO recruitment_info (school_id, company_id, interview_time, profession, address) VALUE (?, ?, ?, ?, ?)`
    let result2 = await sqlQurry(sql2, [data.school, req.session.info.user.company_id, data.date, data.professional, data.address])
    if (result2.affectedRows === 1) {
      returnInfo = {
        status: '1',
        statusInfo: '增加成功'
      }
    } else {
      returnInfo = {
        status: '-2',
        statusInfo: '增加失败'
      }
    }
  }
  res.send(returnInfo)
})

app.put('/recruitment_info', async (req, res) => {
  let data = req.body
  let sql = `SElECT * FROM recruitment_info WHERE school_id = ?`
  let recruitments = await sqlQurry(sql, [data.school])
  let flag = false
  recruitments.forEach(element => {
    if (element.interview_time === data.date && element.address === data.address) {
      flag = true
    }
  });
  let returnInfo = {}
  if (flag) {
    returnInfo = {
      status: '-1',
      statusInfo: '该时间点该教室已经被占用！'
    }
  } else {
    let sql = `UPDATE recruitment_info SET school_id = ?, company_id = ?, interview_time = ?, profession = ?, address = ? WHERE recruitment_id = ?`
    let result2 = await sqlQurry(sql, [data.school, req.session.info.user.company_id, data.date, data.professional, data.address, data.recruitment_id])
    if (result2.affectedRows === 1) {
      returnInfo = {
        status: '1',
        statusInfo: '修改成功'
      }
    } else {
      returnInfo = {
        status: '-2',
        statusInfo: '修改失败'
      }
    }
  }
  res.send(returnInfo)
})

app.delete('/recruitment_info', async (req, res) => {
  let recruitment_id = req.query.recruitment_id
  let sql = `DELETE FROM recruitment_info WHERE recruitment_id = ?`
  let result = await sqlQurry(sql, [recruitment_id])
  let returnInfo = {}
  if (result.affectedRows === 1) {
    returnInfo = {
      status: '1',
      statusInfo: '删除成功'
    }
  } else {
    returnInfo = {
      status: '-2',
      statusInfo: '删除失败'
    }
  }
  res.send(returnInfo)
})

module.exports = app