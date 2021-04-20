let express = require('express')
const multiparty = require('multiparty')
let sqlQurry = require('../db/db')
let isLogin = require('../utils/isLogin')

let app = express()

app.post('/changeResume', async (req, res) => {
  console.log(isLogin(req, res));
  let uploadDir = 'E:/Learn/毕业设计/基于Vue的校企联合就业系统/school_recruitment_system/public/upload/resume/'
  let form = new multiparty.Form(
    {
      uploadDir
    }
  )
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.log(err);
      return
    }
    let myFile = []
    files.file.forEach(element => {
      myFile.push(element.path)
    });
    let sql = `UPDATE student SET resume = ? WHERE username = ?`
    let result = await sqlQurry(sql,[myFile[0], req.session.info.user.username])
    let returnInfo = {}
    if (result.affectedRows === 1) {
      req.session.info.user.resume = myFile[0]
      returnInfo = {
        status: '1',
        statusInfo: '修改成功',
        data: myFile
      }
    } else {
      returnInfo = {
        status: '-1',
        statusInfo: '存入数据库失败',
        data: []
      }
    }
    res.send(returnInfo)

  })
})

module.exports = app