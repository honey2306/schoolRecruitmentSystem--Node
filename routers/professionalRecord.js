let express = require('express')
let sqlQurry = require('../db/db')

let app = express()

app.get('/professionalRecord', async (req, res) => {
  let sql = ''
  sql = `SElECT * FROM professional_record WHERE student_id = ?`
  let professionalRecords = await sqlQurry(sql, [req.session.info.user.id])
  let Records = []

  for (let i = 0; i < professionalRecords.length; i++) {
    let tmp = {
      apply_time: professionalRecords[i].apply_time,
      professional: professionalRecords[i].professional
    }
    sql = `SElECT name, company_id FROM work WHERE work_id = ?`
    let work = await sqlQurry(sql, [professionalRecords[i].work_id])
    tmp.work_name = work[0].name
    sql = `SElECT name FROM company WHERE company_id = ?`
    let company = await sqlQurry(sql, [work[0].company_id])
    tmp.company_name = company[0].name
    Records.push(tmp)
  }
  res.send(Records)
})

module.exports = app