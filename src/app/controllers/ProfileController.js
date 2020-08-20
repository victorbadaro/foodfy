const User = require('../models/admin/User')
const { hash } = require('bcryptjs')

module.exports = {
    async index(req, res) {
        const { userID } = req.session
        const user = await User.find({ where: { id: userID }})

        return res.render('admin/users/profile', { user })
    },
    async update(req, res) {
        const { user } = req
        const { name, email, password } = req.body
        
        if(password) {
            const hashedPassword = await hash(password, 8)

            await User.update(user.id, {
                name,
                email,
                password: hashedPassword
            })
        } else {
            await User.update(user.id, {
                name,
                email
            })
        }

        return res.redirect('/admin/profile')
    }
}