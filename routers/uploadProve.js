let express = require('express')
const multiparty = require('multiparty')

let app = express()


app.post('/upload/prove', (req, res) => {
  let uploadDir = 'E:/Learn/毕业设计/基于Vue的校企联合就业系统/school_recruitment_system/public/upload/prove/'
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
    let returnInfo = {
      status: '1',
      statusInfo: '上传成功',
      data: myFile
    }
    res.send(returnInfo)

  })
})

module.exports = app