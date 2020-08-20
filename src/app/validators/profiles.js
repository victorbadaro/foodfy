const User = require('../models/admin/User')

module.exports = {
    async update(req, res, next) {
        const { id, name, email } = req.body
        let user = await User.find({ where: {email} })

        
        if(!name || !email)
            return res.render('admin/users/profile', { error: 'Preencha todos os campos obrigatórios!', user: req.body })
        
        if(user && user.id != req.session.userID)
            return res.render('admin/users/profile', { error: 'Este email já está sendo utilizado por outro usuário. Por favor, digite outro endereço de email!', user: req.body })
        
        user = await User.find({ where: {id} })
        
        if(!user)
            return res.render('admin/users/profile', { error: 'Usuário não encontrado! Tente novamente', user: req.body })
        
        if(id != req.session.userID)
            return res.render('admin/users/profile', { error: 'Para alterar os dados de outro usuário, acesse o perfil dele!', user: req.body })
        
        req.user = user
        return next()
    }
}