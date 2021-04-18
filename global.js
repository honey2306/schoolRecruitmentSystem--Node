let global = {
  username: 'tengxun',
  identity: 'company'
}

let op = {
  get (value) {
    if (global[value]) {
      return global[value]
    } else {
      return '没有该属性'
    }
  },

  set (key, value) {
    global[key] = value
  },

  getType (type) {
    let tmp = ''
    switch (type) {
      case 'hlw':
        tmp = '互联网公司'
        break
      case 'jy':
        tmp = '在线教育公司'
        break
      case 'shfu':
        tmp = '生活服务公司'
        break
      default:
        tmp = '人力资源公司'
    }
    return tmp
  },
  getState (state) {
    let tmp = ''
    switch (state) {
      case '0':
        tmp = '未融资'
        break
      case '1':
        tmp = '天使轮'
        break
      case '2':
        tmp = '已上市'
        break
      default:
        tmp = '不需要融资'
    }
    return tmp
  },
  getPersoncount (personcount) {
    let tmp = ''
    switch (personcount) {
      case '0':
        tmp = '0-100人'
        break
      case '1':
        tmp = '100-1000人'
        break
      case '2':
        tmp = '1000-10000人'
        break
      default:
        tmp = '10000人以上'
    }
    return tmp
  }
}

module.exports = op