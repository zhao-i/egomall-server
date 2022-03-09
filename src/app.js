'use strict'

const express = require('express')
const https = require('https')
const path = require('path')
const fs = require('fs')
const jsonwebtoken = require('jsonwebtoken')
const { accountVerify, commodityManage } = require('./database/index')

const app = express()

app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://192.168.1.5:8080');//req.headers.origin
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,POST');//允许方法
    res.header('Access-Control-Allow-Credentials', 'true');
    // res.header('Access-Control-Expose-Headers', 'token')
    next();
})
app.use('/', express.static(path.join(__dirname, 'public')))//加载内置静态资源中间件函数
app.use(express.json())//加载内置json解析中间件函数

app.get('/', function (req, res) {

})
app.post('/manage/login', function (req, res) {
    const token = req.headers.authorization
    if (token !== "null") {
        console.log('有token')
        jsonwebtoken.verify(req.headers.authorization, "null", { subject: 'egoMallVerifyAPI', audience: 'app.egomall.administrators' }, (err, decode) => {
            if (err) {
                //token无效
                console.log('err')
                res.json({ code: 0, msg: "token过期,正在重新验证" }).end() //0
            } else {
                console.log('succ')
                res.json({ code: 1, msg: "ok" }).end()

            }
        })
    } else {
        console.log('无token')
        const { account, password } = req.body
        accountVerify.login({ account: account, password: password }, function (result) {
            const data = result[0]
            if (data.status === 0) {
                console.log('账户已停用')
                res.json({ code: -1, msg: "account locked" }).end() //-1该账号已停用
            } else if (result.length === 1) {
                console.log('登陆成功')
                jsonwebtoken.sign(
                    { id: data.id, phone: data.phone },
                    "null",
                    { algorithm: 'HS256', expiresIn: '1d', subject: 'egoMallVerifyAPI', audience: 'app.egomall.administrators' },
                    (err, token) => {
                        if (err) throw err;
                        const resbody = {
                            code: 1,
                            msg: "ok",
                            data: {
                                name: data.name,
                                gender: data.gender,
                                level: data.level,
                                evaluation: data.evaluation,
                                commodity: data.commodity,
                                put: data.put,
                                bill: data.bill,
                            },
                            token: token
                        }
                        res.json(resbody).end()
                    }
                )
            } else {
                console.log('身份验证失败')
                res.json({ code: 0, msg: "failed" }).end()  //0验证错误
            }
        })
    }
})
function JWTVerify() {

}
app.post('/manage/register', function (req, res) { })
/*
1.登陆,检查是否携带token,如果携带则验证,否则跳到数据库查询,若验证token成功,返回用户基本信息给res对象附带新的token
2.用户进行需要权限的请求时,查询token内的用户id,依照id查询数据库信息,从取得的查询结果判断是否有权限,仅当权限满足条件时,执行进行下一步sql查询,再返回给res
*/
app.listen(80, () => { console.log('http://www.zhaozone.link') })
const httpsServer = https.createServer({
    /* key: fs.readFileSync('test/fixtures/keys/agent2-key.pem'),
    cert: fs.readFileSync('test/fixtures/keys/agent2-cert.pem') */
}, app)
httpsServer.listen(443, () => console.log('https://www.zhaozone.link'))