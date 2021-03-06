const User = require('../models/User');
const { hash } = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('../../lib/nodemailer');

module.exports = {
    async index(req, res) {
        const { userID } = req.session;
        const loggedUser = await User.findOne({ where: { id: userID }});
        const users = await User.findAll({});
        
        return res.render('admin/users/index', { users, loggedUser });
    },
    async create(req, res) {
        const { userID } = req.session;
        const loggedUser = await User.findOne({ where: { id: userID }});

        return res.render('admin/users/create', { loggedUser });
    },
    async post(req, res) {
        const loggedUser = await User.findOne({ where: { id: req.session.userID }});
        const { name, email, is_admin } = req.body;
        const password = crypto.randomBytes(5).toString('hex');
        const hashedPassword = await hash(password, 8);
        const reset_token = crypto.randomBytes(20).toString('hex');
        let reset_token_expires = new Date();

        reset_token_expires = reset_token_expires.setHours(reset_token_expires.getHours() + 24);

        const userID = await User.create({
            name,
            email,
            password: hashedPassword,
            is_admin: is_admin ? true : false,
            reset_token,
            reset_token_expires
        });

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
                <a href="http://localhost:3000/login" target="_blank">Login</a>`
        });

        return res.render('admin/users/show', { success: 'Usuário criado com sucesso 😉', user: { ...req.body, id: userID }, loggedUser });
    },
    async update(req, res) {
        const { userID } = req.session;
        const { id, name, email, is_admin } = req.body;
        const loggedUser = await User.findOne({ where: { id: userID }});
        await User.update(id, {
            name,
            email,
            is_admin: is_admin ? true : false
        });

        return res.render('admin/users/show', {
            success: 'Perfil alterado com sucesso! 😀',
            user: { id, name, email, is_admin },
            loggedUser
        });
    },
    async show(req, res) {
        const { user } = req;
        const { userID } = req.session;
        const loggedUser = await User.findOne({ where: { id: userID }});

        return res.render('admin/users/show', { user, loggedUser })
    },
    async delete(req, res) {
        const { id } = req.body;

        await User.delete(id);
        return res.redirect('/admin/users');
    }
};