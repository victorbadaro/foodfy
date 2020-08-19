const User = require('../models/admin/User')
const { hash } = require('bcryptjs')
const crypto = require('crypto')
const nodemailer = require('../../lib/nodemailer')

module.exports = {
    list(req, res) {
        return res.render('admin/users/index')
    },
    create(req, res) {
        return res.render('admin/users/create')
    },
    async post(req, res) {
        const { name, email, is_admin } = req.body
        const password = crypto.randomBytes(10).toString('hex')
        const reset_token = crypto.randomBytes(20).toString('hex')
        let reset_token_expires = new Date()

        reset_token_expires = reset_token_expires.setHours(reset_token_expires.getHours() + 1)

        const userID = await User.create({
            name,
            email,
            password,
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
    put(req, res) {},
    delete(req, res) {}
}