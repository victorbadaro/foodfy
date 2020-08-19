const User = require('../models/admin/User')
const { hash } = require('bcryptjs')
const crypto = require('crypto')
const nodemailer = require('../../lib/nodemailer')

module.exports = {
    async list(req, res) {
        const users = await User.all()
        return res.render('admin/users/index', { users })
    },
    create(req, res) {
        return res.render('admin/users/create')
    },
    async post(req, res) {
        const { name, email, is_admin } = req.body
        const password = crypto.randomBytes(5).toString('hex')
        const hashedPassword = await hash(password, 8)
        const reset_token = crypto.randomBytes(20).toString('hex')
        let reset_token_expires = new Date()

        reset_token_expires = reset_token_expires.setHours(reset_token_expires.getHours() + 1)

        const userID = await User.create({
            name,
            email,
            password: hashedPassword,
            is_admin: is_admin ? true : false,
            reset_token,
            reset_token_expires
        })

        await nodemailer.sendMail({
            from: 'no-reply@foodfy.com.br',
            to: email,
            subject: 'Foodfy - Senha',
            html: `
                <h2>Parabéns! Agora você é um usuário Foodfy! 😀</h2>
                <p>Esta é a tua senha de acesso:</p>
                <p>${password}</p>
                <br>
                <br>
                <br>
                <p>Por favor, pedimos que você altere essa senha assim que fizer o primeiro acesso à tua conta.</p>
                <a href="http://localhost:3000/admin/users/login" target="_blank">Login</a>`
        })

        return
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
    },
    delete(req, res) {}
}