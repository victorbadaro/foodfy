const User = require('../models/admin/User')

module.exports = {
    post(req, res, next) {
        return next()
    },
    async update(req, res, next) {
        const { id, name, email, password } = req.body
        const user = await User.find({ where: {id} })

        if(!name || !email)
            return res.render('admin/users/profile', { error: 'Preencha todos os campos obrigatórios!', user: req.body })

        if(!user)
            return res.render('admin/users/profile', { error: 'Usuário não encontrado! Tente novamente', user: req.body })

        if(id != req.session.userID && user.is_admin == false)
            return res.render('admin/users/profile', { error: 'Você não pode alterar os dados de outro usuário', user: req.body })

        req.user = user
        return next()
    }
}