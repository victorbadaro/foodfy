const User = require('../models/admin/User')

module.exports = {
    post(req, res, next) {
        return next()
    },
    async update(req, res, next) {
        const { id, name, email, password } = req.body
        const user = await User.find({ where: {id} })

        if(!user)
            return res.render('admin/users/profile', { error: 'Usuário não encontrado! Tente novamente', user: req.body })

        console.log('validator')
        console.log({
            id,
            name,
            email,
            password
        })
        return next()
    }
}