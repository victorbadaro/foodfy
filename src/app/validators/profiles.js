const User = require('../models/admin/User')
const { compare } = require('bcryptjs')

module.exports = {
    async update(req, res, next) {
        const { userID } = req.session
        const { id, name, email, password } = req.body
        const loggedUser = await User.find({ where: { id: userID } })
        let user = await User.find({ where: {email} })
        
        if(!name || !email || !password)
            return res.render('admin/users/profile', { error: 'Preencha todos os campos obrigatórios!', user: req.body })
        
        if(user && user.id != userID)
            return res.render('admin/users/profile', { error: 'Este email já está sendo utilizado por outro usuário. Por favor, digite outro endereço de email!', user: req.body })
        
        const isPasswordMatched = await compare(password, user.password)

        if(!isPasswordMatched)
            return res.render('admin/users/profile', { error: 'Senha incorreta. Digite a tua senha corretamente para atualizar os dados do teu perfil!', user: req.body })
        
        user = await User.find({ where: {id} })
        
        if(!user) {
            const users = await User.all()
            return res.render('admin/users/index', { error: 'Usuário não encontrado', users, loggedUser })
        }
        
        if(user.id != userID && !loggedUser.is_admin)
            return res.render('admin/users/profile', { error: 'Você não pode alterar o perfil de outro usuário', user: req.body })
        
        if(user.id != userID)
            return res.render('admin/users/profile', { error: 'Para alterar os dados de outro usuário, acesse o perfil dele!', user: req.body })
        
        req.user = user
        return next()
    }
}