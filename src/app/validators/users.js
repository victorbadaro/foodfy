const User = require('../models/admin/User')

module.exports = {
    async post(req, res, next) {
        const { name, email } = req.body

        if(!name || !email)
            return res.render('admin/users/create', { error: 'Preencha todos os campos obrigatórios!', user: req.body })

        const user = await User.find({ where: {email} })

        if(user)
            return res.render('admin/users/create', { error: 'Este email já está sendo utilizado por outro usuário. Por favor, digite outro endereço de email!', user: req.body })
        
        return next()
    },
    async update(req, res, next) {
        const { userID } = req.session
        const { id, name, email } = req.body
        let user = await User.find({ where: {id} })

        if(!name || !email)
            return res.render('admin/users/show', { error: 'Preencha todos os campos obrigatórios!', user: req.body })

        if(!user)
            return res.render('admin/users/show', { error: 'Usuário não encontrado! Tente novamente', user: req.body })
        
        user = await User.find({ where: { id: userID } })

        if(!user.is_admin)
            return res.render('admin/users/show', { error: 'Você não tem privilégios de administrador para alterar a conta de outro usuário', user: req.body })

        return next()
    },
    async show(req, res, next) {
        const { id } = req.params
        const user = await User.find({ where: {id} })

        if(!user)
            return res.render('admin/users/index', { error: 'Este usuário não existe' })

        req.user = user
        return next()
    },
    async delete(req, res, next) {
        const { userID } = req.session
        const { id } = req.body
        const users = await User.all()
        const loggedUser = await User.find({ where: { id: userID } })
        const user = await User.find({ where: {id} })

        if(!user)
            return res.render('admin/users/index', { error: 'Usuário não encontrado. Tente novamente!', users, loggedUser })
        
        if(user.id == userID)
            return res.render('admin/users/index', { error: 'Você não pode deletar a própria conta', users, loggedUser })

        if(!loggedUser.is_admin)
            return res.render('admin/users/index', { error: 'Você não tem privilégios de administrador para deletar usuários', users, loggedUser })

        return next()
    }
}