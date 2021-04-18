function isLogin (req,res) {
   if (req.session.info && req.session.info.status === '1') {
     return true
   } else {
     return false
   }
}

module.exports = isLogin