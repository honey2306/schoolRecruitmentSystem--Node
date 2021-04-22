let express = require('express')
let sqlQurry = require('../db/db')

let app = express()

app.get('/professionalRecord', async (req, res) => {
    let sql = ''
    let professionalRecords = []
    if (req.session.info.user.identity === 'student') {
        sql = `SElECT * FROM professional_record WHERE student_id = ?`
        professionalRecords = await sqlQurry(sql, [req.session.info.user.id])
    } else {
        sql = `SElECT * FROM professional_record`
        professionalRecords = await sqlQurry(sql, [])
        let tmp = []
        for (let i = 0; i < professionalRecords.length; i++) {
            sql = `SElECT company_id FROM work WHERE work_id = ?`
            let work = await sqlQurry(sql, [professionalRecords[i].work_id])
            if (work[0].company_id === req.session.info.user.company_id) {
                tmp.push(professionalRecords[i])
            }
        }
        professionalRecords = tmp
    }

    let Records = []

    for (let i = 0; i < professionalRecords.length; i++) {
        let tmp = professionalRecords[i]
        sql = `SElECT name, company_id FROM work WHERE work_id = ?`
        let work = await sqlQurry(sql, [professionalRecords[i].work_id])
        sql = `SElECT name, school FROM student WHERE id = ?`
        let student = await sqlQurry(sql, [professionalRecords[i].student_id])
        tmp.student_name = student[0].name
        tmp.school_name = student[0].school
        tmp.work_name = work[0].name
        sql = `SElECT name FROM company WHERE company_id = ?`
        let company = await sqlQurry(sql, [work[0].company_id])
        tmp.company_name = company[0].name
        Records.push(tmp)
    }
    res.send(Records)
})

app.put('/professionalRecord', async (req, res) => {
    let data = req.query
    let sql = `UPDATE professional_record SET checked = ? WHERE record_id = ?`
    let result = await sqlQurry(sql, [data.checked, data.record_id])
    let returnInfo = {}
    if (result.affectedRows === 1) {
        returnInfo.status = '1'
        returnInfo.statusInfo = '成功'
    } else {
        returnInfo.status = '-1'
        returnInfo.statusInfo = '失败'
    }
    res.send(returnInfo)
})

module.exports = app
