const User = require('../models/admin/User')
const { compare } = require('bcryptjs')

module.exports = {
    async login(req, res, next) {
        const { email, password } = req.body

        if(!email || !password)
            return res.render('session/login', { error: 'Preencha todos os campos obrigatórios!', user: req.body })
        
        const user = await User.find({ where: {email} })

        if(!user)
            return res.render('session/login', { error: 'Não encontramos nenhum usuário com este email. Por favor, digite o teu email corretamente!', user: req.body })
        
        const isPasswordMatched = await compare(password, user.password)

        if(!isPasswordMatched)
            return res.render('session/login', { error: 'Senha incorreta', user: req.body })
        
        req.user = user
        return next()
    },
    async forgot(req, res, next) {
        const { email } = req.body
        
        if(!email)
            return res.render('session/forgot-password', { error: 'Preencha todos os campos obrigatórios!', user: req.body })
        
        const user = await User.find({ where: {email} })

        if(!user)
            return res.render('session/forgot-password', { error: 'Este email não está sendo utilizado por nenhum usuário. Por favor, digite o endereço de email correto da tua conta!', user: req.body })
        
        req.user = user
        return next()
    },
    async reset(req, res, next) {
        const { reset_token, email, password, passwordConfirmation } = req.body

        if(!email || !password || !passwordConfirmation)
            return res.render('session/reset-password', { error: 'Preencha todos os campos obrigatórios!', user: req.body })
        
        if(password !== passwordConfirmation)
            return res.render('session/reset-password', { error: 'Os campos de senha e confirmação de senha devem ser iguais', user: req.body })
        
        const user = await User.find({ where: {email} })

        if(!user)
            return res.render('session/reset-password', { error: 'Este email não está sendo utilizado por nenhum usuário. Por favor, digite o endereço de email correto da tua conta!', user: req.body })
        
        if(!reset_token || reset_token != user.reset_token)
            return res.render('session/reset-password', { error: 'Token inválido. Clique no link que enviamos pra o teu email ou solicite uma nova senha novamente!', user: req.body })
        
        let now = new Date()
        now = now.setHours(now.getHours())

        if(now > user.reset_token_expires)
            return res.render('session/reset-password', { error: 'Token expirado. Solicite novamente uma nova senha!', user: req.body })
        
        req.user = user
        return next()
    }
}