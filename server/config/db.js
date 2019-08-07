// 数据库连接配置
const Sequelize = require('sequelize')

const sequelize = new Sequelize('travel', 'root', 'mysql123', {
    host: 'localhost',
    dialect: 'mysql',
    operatorsAliases: false,
    define: {
        underscored: true // 字段以下划线（_）来分割（默认是驼峰命名风格）
    },
    dialectOptions: {
        //字符集
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
        supportBigNumbers: true,
        bigNumberStrings: true
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    timezone: '+08:00' //东八时区
})

module.exports = {
    sequelize
}
