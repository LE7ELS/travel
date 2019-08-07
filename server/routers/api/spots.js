// 引入koa-router并实例化
const Router = require('koa-router')
const router = new Router()

// 引入Spot模型
const Spot = require('../../models/Spot')

// 使用Sequelize的Op对象进行模糊查询
const Sequelize = require('sequelize')
const Op = Sequelize.Op

// 引入Multer文件上传工具
const upload = require('../../utils/multerUtil')

/**
 * @route GET api/spots/getLastest
 * @description 获取最新景点接口地址
 * @access 接口是公开的
 */
router.get('/getLastest', async ctx => {
    // 前端查询的关键词
    let name = ctx.query.name || ''
    await Spot.findAll({
        raw: true,
        order: [['created_at', 'DESC']], //ASC升序、递增；DESC降序递减
        where: {
            name: {
                [Op.like]: '%' + name + '%'
            }
        }
        // attributes: ['name', 'content'] // 控制查询字段
    }).then(async result => {
        console.log('查询结果：', result)
        if (result.length != 0) {
            ctx.body = { code: 200, msg: '请求景点成功', data: result }
        } else {
            ctx.body = {
                code: 404,
                msg: `没有查到名称含有"${name}"的景点`,
                data: result
            }
        }
    })
})

/**
 * @route GET api/spots/getSpot
 * @description 根据id获取景点接口地址
 * @access 接口是公开的
 */
router.get('/getSpot', async ctx => {
    // 前端查询的关键词
    let id = ctx.query.id
    await Spot.findAll({
        raw: true,
        order: [['created_at', 'DESC']], //ASC升序、递增；DESC降序递减
        // 根据id查询
        where: {
            id
        }
    }).then(async result => {
        console.log('查询结果：', result)
        ctx.body = { code: 200, msg: '获取编辑的景点请求成功', data: result }
    })
})

/**
 * @route GET api/spots/getFreeSpots
 * @description 获取推荐的免费景点接口地址
 * @access 接口是公开的
 */
router.get('/getFreeSpots', async ctx => {
    await Spot.findAll({
        raw: true,
        order: [['created_at', 'DESC']], //ASC升序、递增；DESC降序递减
        where: {
            ticket: 0
        }
    }).then(async result => {
        console.log('查询结果：', result)
        if (result.length != 0) {
            ctx.body = { code: 200, msg: '请求推荐景点成功', data: result }
        } else {
            ctx.body = {
                code: 404,
                msg: `没有查询到免费的推荐景点`,
                data: result
            }
        }
    })
})

/**
 * @route POST api/spots/addSpot
 * @description 添加新景点接口地址
 * @access 接口是公共的
 */
router.post('/addSpot', upload.single('album'), async ctx => {
    console.log('接收到的文件:', ctx.req.file)
    console.log('接收的表单内容：', ctx.req.body)
    let {
        spotName,
        publisher,
        seasons,
        ticket,
        position,
        spotDesc
    } = ctx.req.body
    let album = ctx.req.file.filename

    // 插入数据库
    await Spot.create({
        name: spotName,
        publisher,
        seasons,
        ticket,
        position,
        describe: spotDesc,
        album
    }).then(async () => {
        ctx.body = { code: 200, msg: '景点添加成功！' }
    })
})

/**
 * @route GET api/spots/getMySpots
 * @description 获取个人发布的景点接口地址
 * @access 接口是公共的
 */
router.get('/getMySpots', async ctx => {
    await Spot.findAll({
        raw: true,
        order: [['created_at', 'DESC']], //ASC升序、递增；DESC降序递减
        where: {
            publisher: ctx.query.publisher
        }
    }).then(async result => {
        console.log('查询结果：', result)
        if (result.length != 0) {
            ctx.body = { code: 200, msg: '请求推荐景点成功', data: result }
        } else {
            ctx.body = {
                code: 404,
                msg: `没有查询到免费的推荐景点`,
                data: result
            }
        }
    })
})

/**
 * @route POST api/spots/editSpot
 * @description 编辑景点信息接口地址
 * @access 接口是公共的
 */
router.post('/editSpot', upload.single('album'), async ctx => {
    console.log('接受到的文件：', ctx.req.file)
    console.log('获取的表单内容：', ctx.req.body)

    let updataItem = {
        ticket: ctx.req.body.ticket,
        describe: ctx.req.body.spotDesc
    }

    // 如果上传了新图片则更新
    if (ctx.req.file != undefined) {
        updataItem.album = ctx.req.file.filename
    }

    await Spot.update(updataItem, {
        where: {
            id: ctx.req.body.id
        }
    }).then(async result => {
        ctx.body = { code: 200, msg: '景点信息修改成功！', data: result }
    })
})

/**
 * @route POST api/spots/delSpot
 * @description 删除景点接口地址
 * @access 接口是公共的
 */
router.post('/delSpot', async ctx => {
    // 使用request接收post数据
    console.log('获取的数据：', ctx.request.body)

    // 删除数据
    await Spot.destroy({
        where: {
            id: ctx.request.body.id
        }
    }).then(() => {
        ctx.body = { code: 200, msg: '删除成功！' }
    })
})

module.exports = router.routes()
