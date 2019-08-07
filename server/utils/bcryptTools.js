// bcrypt密码加密工具
const bcrypt = require('bcryptjs')

const bcryptTools = {
    enbcrypt(password) {
        var salt = bcrypt.genSaltSync(10)
        var hash = bcrypt.hashSync(password, salt)
        return hash
    }
}

module.exports = bcryptTools
