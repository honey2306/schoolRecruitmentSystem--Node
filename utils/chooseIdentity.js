module.exports = function (identity) {
  let tableName = ''
  switch (identity) {
    case '1':
      tableName = 'student'
      break
      case '2':
        tableName = 'school'
        break
      case '3':
        tableName = 'company'
        break
      default:
        tableName = 'administrator'
        break  
  }

  return tableName
}