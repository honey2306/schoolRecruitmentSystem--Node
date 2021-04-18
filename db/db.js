let mysql = require('mysql')
let config = require('./db.config')


function query (sql, params) {
  return new Promise ((resolve, reject) => {
      //每次要使用的时候就创建连接
      let connection = mysql.createConnection(config)
  
      //数据库连接
      connection.connect( error=> {
        if (error) {
          console.log('数据库连接失败', error)
          reject(error)
        }
      })
  
      //数据库使用
      connection.query(sql,params,(error, res) => {
        if (error) {
          console.log('数据库操作失败')
          reject(error)
          throw error
        } 
        resolve(JSON.parse(JSON.stringify(res)))
      })
  
  
      //使用完毕后要关闭数据库连接
      connection.end( error=> {
        if (error) {
          console.log('数据库关闭失败', error)
          reject(error)
        }
      })
  })
}




module.exports = query