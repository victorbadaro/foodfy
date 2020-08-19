const User = require('../models/admin/User')

module.exports = {
    async index(req, res) {
        const { userID } = req.session
        const user = await User.find({ where: { id: userID }})

        return res.render('admin/users/profile', { user })
    },
    put(req, res) {}
}