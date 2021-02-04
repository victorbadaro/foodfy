const User = require('../models/User');
const nodemailer = require('../../lib/nodemailer');
const crypto = require('crypto');
const { hash } = require('bcryptjs');

module.exports = {
    loginForm(req, res) {
        return res.render('session/login')
    },
    async login(req, res) {
        const { user } = req;

        req.session.userID = user.id;
        await User.update(user.id, {
            reset_token: '',
            reset_token_expires: ''
        });
        return res.redirect('/admin/profile');
    },
    logout(req, res) {
        req.session.destroy()
        return res.redirect('/home')
    },
    forgotForm(req, res) {
        return res.render('session/forgot-password')
    },
    async forgot(req, res) {
        const { user } = req;
        const reset_token = crypto.randomBytes(20).toString('hex');
        let reset_token_expires = new Date();

        reset_token_expires = reset_token_expires.setHours(reset_token_expires.getHours() + 1);

        await User.update(user.id, {
            reset_token,
            reset_token_expires
        });

        await nodemailer.sendMail({
            from: 'no-reply@foodfy.com.br',
            to: user.email,
            subject: 'Recuperação de senha',
            html: `
                <h2>Esqueceu a tua senha? Nós podemos te ajudar... 😎</h2>
                <p>Clique no link abaixo para poder cadastrar uma nova senha para a tua conta do Foodfy 👨‍🍳</p>
                <p><a href="http://localhost:3000/reset-password?email=${user.email}&reset_token=${reset_token}" target="_blank">cadastrar nova senha</a></p>`
        });

        return res.render('session/forgot-password', { success: 'Enviamos um email pra você. Verifique a tua caixa de entrada! 😉' });
    },
    resetForm(req, res) {
        const { email, reset_token } = req.query
        return res.render('session/reset-password', { user: { email, reset_token } })
    },
    async reset(req, res) {
        const { user } = req;
        const { password } = req.body;
        const hashedPassword = await hash(password, 8);

        await User.update(user.id, {
            password: hashedPassword,
            reset_token: '',
            reset_token_expires: ''
        });
        return res.render('session/login', { success: 'Senha atualizada com sucesso! 😀', user: { email: user.email } });
    }
}