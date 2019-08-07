// 引入multer附件上传模块
const multer = require('koa-multer')

const storage = multer.diskStorage({
    // 设置上传后文件路径,upload文件夹会自动创建
    destination: 'public/uploads',

    // 给上传的文件重命名,获取添加后缀
    filename(ctx, file, cb) {
        const filenameArr = file.originalname.split('.')
        cb(null, Date.now() + '.' + filenameArr[filenameArr.length - 1])
    }
})

// 添加配置文件到multer对象
const upload = multer({
    storage: storage
})

module.exports = upload
