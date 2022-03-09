const mysql = require('mysql')
const { mysqlOptions } = require('../admin.config.js')

const rules = {}
//返回登陆使用的账户类型
rules.channel = (value) => {
    const match = /^[1]([3-5]|[7-9])[0-9]{9}$/  /* 11位手机号正则表达式排除10,11,12,16 */
    return match.test(value) ? "phone" : "id"
}


const accountVerify = {
    login: (data, callback) => {
        const { account, password } = data
        const statement = `SELECT * FROM staff WHERE ${rules.channel(account)}="${account}" and password=MD5("${password}") `
        const connection = mysql.createConnection(mysqlOptions)
        connection.connect()
        connection.query(statement, (err, result, fields) => {
            if (err) throw err;
            callback(result);
            console.log('sql查询成功')
        })
        connection.end()
    },
    register: (data, callback) => {
        const { name, gender, phone, password } = data
        if (!(name && gender && phone && password)) { return null } //请求注册的数据不足时,操作中断
        const statement = `INSERT INTO staff (name, gender, phone, password) VALUES (${name},${gender},${phone},MD5(${password})) `
        const connection = mysql.createConnection(mysqlOptions)
        connection.connect()
        connection.query(statement, (err, result, fields) => {
            if (err) throw err;
            callback(result);
        })
        connection.end()
    }
}
const commodityManage = {
    query: () => { },
    update: () => { },
    delete: () => { }
}

module.exports = {
    accountVerify,
    commodityManage
}