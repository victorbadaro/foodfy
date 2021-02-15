const User = require('../models/User');

module.exports = {
    async index(req, res) {
        const { userID } = req.session;
        const user = await User.findOne({ where: { id: userID }});

        return res.render('admin/users/profile', { user, loggedUser: user });
    },
    async update(req, res) {
        const { user } = req;
        const { name, email } = req.body;

        await User.update(user.id, {
            name,
            email
        });

        return res.render('admin/users/profile', {
            success: 'Perfil alterado com sucesso! 😀',
            user: { name, email },
            loggedUser: user
        });
    }
};