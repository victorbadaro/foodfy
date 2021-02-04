const User = require('../models/User');
const { compare } = require('bcryptjs');

module.exports = {
    async login(req, res, next) {
        const { email, password } = req.body;

        if(!email && !password)
            return res.render('session/login', {
                error: 'Informe o teu email e senha para realizar o login!',
                user: req.body,
                fields_error: { email: true, password: true }
            });

        if(!email)
            return res.render('session/login', {
                error: 'Informe o teu email para realizar o login!',
                user: req.body,
                fields_error: { email: true }
            });
        
        if(!password)
            return res.render('session/login', {
                error: 'Informe a tua senha para realizar o login!',
                user: req.body,
                fields_error: { password: true }
            });
        
        const user = await User.findOne({ where: {email} });

        if(!user)
            return res.render('session/login', {
                error: 'Não encontramos nenhum usuário com este email. Por favor, digite o teu email corretamente!',
                user: req.body,
                fields_error: { email }
            });
        
        const isPasswordMatched = await compare(password, user.password);

        if(!isPasswordMatched)
            return res.render('session/login', {
                error: 'Senha incorreta',
                user: req.body,
                fields_error: { password }
            });
        
        req.user = user;
        return next();
    },
    async forgot(req, res, next) {
        const { email } = req.body;
        
        if(!email)
            return res.render('session/forgot-password', {
                error: 'Informe o teu email!',
                fields_error: { email: true }
            });
        
        const user = await User.findOne({ where: {email} });

        if(!user)
            return res.render('session/forgot-password', {
                error: 'Não encontramos nenhum usuário com este email. Por favor, digite o teu email corretamente!',
                fields_error: { email: true }
            });
        
        req.user = user;
        return next();
    },
    async reset(req, res, next) {
        const { reset_token, email, password, passwordConfirmation } = req.body;

        if(!email || !password || !passwordConfirmation)
            return res.render('session/reset-password', {
                error: 'Por favor, preencha os campos de email, senha e confirmação de senha!',
                user: req.body,
                fields_error: { email: true, password: true, passwordConfirmation: true }
            });
        
        if(password !== passwordConfirmation)
            return res.render('session/reset-password', {
                error: 'Os campos de senha e confirmação de senha devem ser iguais',
                user: { reset_token, email, password },
                fields_error: { passwordConfirmation }
            });
        
        const user = await User.findOne({ where: {email} });

        if(!user)
            return res.render('session/reset-password', {
                error: 'Não encontramos nenhum usuário com este email. Por favor, digite o teu email corretamente!',
                user: { reset_token, password, passwordConfirmation },
                fields_error: { email }
            });
        
        if(!reset_token || reset_token != user.reset_token)
            return res.render('session/forgot-password', {
                error: 'Token inválido. Clique no link que enviamos pra o teu email ou solicite a recuperação de senha novamente!',
                user: { email }
            });
        
        let now = new Date();
        now = now.setHours(now.getHours());

        if(now > user.reset_token_expires)
            return res.render('session/forgot-password', {
                error: 'Token expirado. Solicite novamente a recuperação de senha!',
                user: { email }
            });
        
        req.user = user;
        return next();
    }
}