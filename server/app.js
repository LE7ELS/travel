// 引入模块
const Koa = require('koa')
const Router = require('koa-router')
const db = require('./config/db')
const bodyparser = require('koa-bodyparser')
const passport = require('koa-passport')
const cors = require('koa2-cors')
const path = require('path')
const staticFiles = require('koa-static')

// 实例化Koa对象
const app = new Koa()
const router = new Router()

// 使用koa2-cors跨域
app.use(
    cors({
        origin: function(ctx) {
            if (ctx.url == '/test') {
                return false
            }
            return '*'
        },
        exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
        maxAge: 5,
        credentials: true,
        allowMethods: ['OPTIONS', 'GET', 'POST', 'DELETE', 'PUT'],
        allowHeaders: ['Content-Type', 'Authorization', 'Accept']
    })
)

// 使用bodyparser
app.use(bodyparser())

// 引入users.js
const users = require('./routers/api/users')
// 引入spots.js
const spots = require('./routers/api/spots')

// 默认路由
router.get('/', async ctx => {
    ctx.body = 'Hello Koa'
})

// 连接数据库测试
const sequelize = db.sequelize
sequelize
    .authenticate()
    .then(() => {
        console.log('数据库连接成功！')
    })
    .catch(err => {
        console.log('无法连接到数据库：', err)
    })

// 引入koa-passport，在本项目中主要用于验证token等
app.use(passport.initialize())
app.use(passport.session())

// 回调到config文件中的passport.js
require('./config/passport')(passport)

// 使用接口路由中间件
router.use('/api/users', users)
router.use('/api/spots', spots)

// 使用路由中间件
app.use(router.routes()).use(router.allowedMethods())

// 使用静态服务器
app.use(staticFiles(path.join(__dirname, './public')))

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`服务器已运行于 ${port} 端口`)
})
