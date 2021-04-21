let express = require('express')
let sqlQurry = require('../db/db')
let Sglobal = require('../global')
const multiparty = require('multiparty')

let app = express()

app.put('/perfection', (req, res) => {
  let identity = Sglobal.get('identity')
  let uploadDirPre = 'E:/Learn/毕业设计/基于Vue的校企联合就业系统/school_recruitment_system/public/upload/'
  if (identity === 'student') {
    uploadDir = 'resume'
  } else if (identity === 'school') {
    uploadDir = 'icon/school'
  } else {
    uploadDir = 'icon/company'
  }
  uploadDir = uploadDirPre + uploadDir
  let form = new multiparty.Form(
    {
      uploadDir  //文件上传地址
    }
  )
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.log(err);
      return
    } 
    let sql = ''
    let result = {}
    if (identity === 'student') {
      sql = `UPDATE ${identity} SET name = ?, school = ?, resume = ? WHERE username = ?`
      result = await sqlQurry(sql,[fields.name[0], fields.school[0], files.file[0].path, Sglobal.get('username')])
    } else if (identity === 'school') {
      sql = `UPDATE ${identity} SET name = ?, address = ?, introduction= ?, icon = ? WHERE username = ?`
      result = await sqlQurry(sql, [fields.name[0], fields.address[0], fields.introduction[0], files.file[0].path, Sglobal.get('username')])
    } else{
      sql = `UPDATE ${identity} SET name = ?, address = ?, introduction= ?, type = ?, state = ?, personcount = ?, icon = ? WHERE username = ?`
      result = await sqlQurry(sql, [fields.name[0], fields.address[0], fields.introduction[0], fields.type[0], fields.state[0], fields.personCount[0], files.file[0].path, Sglobal.get('username')])
    }
    let returnInfo = {}
    if (result.affectedRows === 1) {
      returnInfo.status = '1'
      returnInfo.statusInfo = '完善信息成功'
    } else {
      returnInfo.status = '-1'
      returnInfo.statusInfo = '完善信息失败'
    }
    res.send(returnInfo)
  })
})
module.exports = app