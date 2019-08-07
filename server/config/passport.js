const keys = require('../config/keys')

// 引入并使用passport-jwt
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = keys.secretOrKey

// 实例化User
const User = require('../models/User')

module.exports = passport => {
    // 使用passport验证token
    passport.use(
        new JwtStrategy(opts, async (jwt_payload, done) => {
            console.log('获取的jwt_payload为：', jwt_payload)
            // Sequelize v5以上版本使用findByPk代替findById
            User.findByPk(jwt_payload.id).then(result => {
                var user = result.dataValues
                // 返回到对应接口
                if (user) {
                    return done(null, user)
                } else {
                    return done(null, false)
                }
            })
        })
    )
}
