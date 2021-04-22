let express = require('express')
let sqlQurry = require('../db/db')

let app = express()

app.get('/like', async (req, res) => {
    let like = req.query.like
    //职业
    let sql1 = 'SELECT * FROM work WHERE approved = 1 and concat(name, address, edu_requirements, schools, introduction, requirements, type) LIKE ?'
    let result = await sqlQurry(sql1, [`%${like}%`])
    let works = []
    for (let i = 0; i < result.length; i++) {
        let tmp = {}
        tmp = result[i]
        let sql2 = 'SElECT name, icon FROM company WHERE company_id = ?'
        let result2 = await sqlQurry(sql2, [tmp.company_id])
        tmp.companyName = result2[0].name
        tmp.icon = result2[0].icon
        works.push(tmp)
    }

    //学校
    let sql2 = 'SELECT * FROM school WHERE approved = 1 and concat(name, address,  introduction) LIKE ?'
    let schools = await sqlQurry(sql2, [`%${like}%`])

    //企业
    let sql3 = 'SELECT * FROM company WHERE approved = 1 and concat(name, address, introduction) LIKE ?'
    let companys = await sqlQurry(sql3, [`%${like}%`])

    //企业下面的职位
    for (const item of companys) {
        let sql4 = 'SELECT * FROM work WHERE approved = 1 and company_id = ?'
        let result = await sqlQurry(sql4, [item.company_id])
        for (var i = 0; i < result.length; i++) {
            result[i].companyName = item.name
            result[i].icon = item.icon
            works.push(result[i])
        }
    }

    let returnInfo = {
        works,
        schools,
        companys
    }
    res.send(returnInfo)
})

module.exports = app
