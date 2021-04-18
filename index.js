// 引入express
let express = require('express')
let login = require('./routers/login')
let uploadProve = require('./routers/uploadProve')
let perfection = require('./routers/perfection')
let register = require('./routers/register')
let hot = require('./routers/hot')
let work_detail = require('./routers/work_detail')
let school_detail = require('./routers/school_detail')
let company_detail = require('./routers/company_detail')
let all_information = require('./routers/all_information')
let like = require('./routers/like')
let loginInfo = require('./routers/loginInfo')
let logout = require('./routers/logout')
let passChange = require('./routers/passChange')
let changeResume = require('./routers/changeResume')
let professionalRecord = require('./routers/professionalRecord')

// 实例化express

let app = express()

//解决跨域
app.all('*',function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (req.method == 'OPTIONS') {
    res.send(200);
  }
  else {
    next();
  }
});

app.use(hot)
app.use(like)
app.use(login)
app.use(logout)
app.use(register)
app.use(loginInfo)
app.use(passChange)
app.use(perfection)
app.use(uploadProve)
app.use(work_detail)
app.use(changeResume)
app.use(school_detail)
app.use(company_detail)
app.use(all_information)
app.use(professionalRecord)


app.listen(3000, () => {
  console.log('启动成功');
})