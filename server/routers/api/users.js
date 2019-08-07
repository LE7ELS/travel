// 引入koa-router并实例化
const Router = require('koa-router')
const router = new Router()
const bcrypt = require('bcryptjs')
const bcryptTools = require('../../utils/bcryptTools')
const jwt = require('jsonwebtoken')
const keys = require('../../config/keys')
const passport = require('koa-passport')

// 引入User模型
const User = require('../../models/User')

/**
 * @route GET api/users/test
 * @description 测试接口地址
 * @access 接口是公开的
 */
router.get('/test', async ctx => {
    // ctx.status = 200
    ctx.body = { code: 200, msg: 'apis work...' }
})

/**
 * @route POST api/users/register
 * @description 注册接口地址
 * @access 接口是公开的
 */
router.post('/register', async ctx => {
    // 把前端传来的数据存储到数据库
    let { username, password } = ctx.request.body
    await User.findAll({
        raw: true, // 设置为 true，即可返回源数据
        where: {
            username
        }
    }).then(async result => {
        if (result != 0) {
            // ctx.status = 500
            ctx.body = { code: 202, msg: '用户已存在！' }
        } else {
            // 没查到
            const newUser = new User({
                username,
                password: bcryptTools.enbcrypt(password)
            })

            // 保存到数据库
            await newUser
                .save()
                .then(user => {
                    // 返回数据
                    // ctx.status = 200
                    ctx.body = { code: 200, msg: '注册成功！', data: user }
                })
                .catch(err => {
                    console.log(err)
                })
        }
    })
})

/**
 * @route POST api/users/login
 * @description 登录接口地址 返回token
 * @access 接口是公开的
 */
router.post('/login', async ctx => {
    // 查询用户是否存在
    await User.findOne({
        raw: true, // 设置为 true，即可返回源数据
        where: {
            username: ctx.request.body.username
        }
    }).then(async result => {
        console.log(result)

        if (result == null) {
            // 没查到
            // ctx.status = 200
            ctx.body = { code: 404, msg: '用户不存在！' }
        } else {
            // 查到用户，验证密码
            var hasUser = await bcrypt.compareSync(
                ctx.request.body.password,
                result.password
            )
            // 验证通过
            if (hasUser) {
                // 返回token
                const payload = { id: result.id, username: result.username }
                const token = jwt.sign(payload, keys.secretOrKey, {
                    expiresIn: 3600
                })

                // ctx.status = 200
                // 返回的token必须要有Bearer
                ctx.body = {
                    code: 200,
                    msg: '登陆成功！',
                    token: 'Bearer ' + token
                }
            } else {
                // ctx.status = 200
                ctx.body = { code: 400, msg: '密码错误！' }
            }
        }
    })
})

/**
 * @route GET api/users/current
 * @description 用户信息接口地址 返回用户信息
 * @access 接口是私有的，登录后才能看到
 */
router.get(
    '/current',
    // 下面的验证成功后跳转到passport进行处理
    passport.authenticate('jwt', { session: false }),
    async ctx => {
        // ctx.body = { msg: 'token验证成功' }
        ctx.body = {
            code: 200,
            msg: 'token验证成功',
            data: { id: ctx.state.user.id, username: ctx.state.user.username }
        }
    }
)

module.exports = router.routes()
