const Sequelize = require('sequelize')
const db = require('../config/db')
// 引入时间格式化模块
const moment = require('moment')

const Spot = db.sequelize.define(
    'spots',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            defualtValue: 1,
            autoIncrement: true
        },
        name: { type: Sequelize.STRING },
        describe: { type: Sequelize.STRING },
        publisher: { type: Sequelize.STRING },
        album: { type: Sequelize.STRING },
        position: { type: Sequelize.STRING },
        seasons: { type: Sequelize.INTEGER },
        ticket: { type: Sequelize.INTEGER },
        createdAt: {
            type: Sequelize.DATE,
            get() {
                return moment(this.getDataValue('createdAt')).format(
                    'YYYY-MM-DD HH:mm:ss'
                )
            }
        },
        updatedAt: {
            type: Sequelize.DATE,
            get() {
                return moment(this.getDataValue('updatedAt')).format(
                    'YYYY-MM-DD HH:mm:ss'
                )
            }
        }
    },
    {
        freezeTableName: true,
        timestamps: false
    }
)

module.exports = Spot
