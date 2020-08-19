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
    }
}