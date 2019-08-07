const Sequelize = require('sequelize')
const db = require('../config/db')

const User = db.sequelize.define(
    'users',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            defualtValue: 1,
            autoIncrement: true
        },
        username: { type: Sequelize.STRING },
        password: { type: Sequelize.STRING }
    },
    {
        timestamps: false
    }
)

module.exports = User
