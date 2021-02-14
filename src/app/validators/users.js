const User = require('../models/User');

module.exports = {
    async post(req, res, next) {
        const { userID } = req.session;
        const { name, email } = req.body;
        const loggedUser = await User.findOne({ where: { id: userID } });

        if(!name && !email)
            return res.render('admin/users/create', {
                error: 'Por favor, preencha os campos de nome e email!',
                user: req.body,
                loggedUser,
                fields_error: { name: true, email: true }
            });
        
        if(!name)
            return res.render('admin/users/create', {
                error: 'Por favor, preencha o campo de nome!',
                user: req.body,
                loggedUser,
                fields_error: { name: true }
            });
        
        if(!email)
            return res.render('admin/users/create', {
                error: 'Por favor, preencha o campo de email!',
                user: req.body,
                loggedUser,
                fields_error: { email: true }
            });

        const user = await User.findOne({ where: {email} });

        if(user)
            return res.render('admin/users/create', {
                error: 'Este email já está sendo utilizado por outro usuário. Por favor, digite outro endereço de email!',
                user: req.body,
                loggedUser,
                fields_error: { email }
            });
        
        return next();
    },
    async update(req, res, next) {
        const { userID } = req.session;
        const { id, name, email } = req.body;
        const loggedUser = await User.findOne({ where: { id: userID } });
        let user = await User.findOne({ where: {id} });

        if(!name && !email)
            return res.render('admin/users/show', {
                error: 'Por favor, preencha os campos de nome e email!',
                user: req.body,
                loggedUser,
                fields_error: { name: true, email: true }
            });
        
        if(!name)
            return res.render('admin/users/show', {
                error: 'Por favor, preencha o campo de nome!',
                user: req.body,
                loggedUser,
                fields_error: { name: true }
            });
        
        if(!email)
            return res.render('admin/users/show', {
                error: 'Por favor, preencha o campo de email!',
                user: req.body,
                loggedUser,
                fields_error: { email: true }
            });

        if(!user) {
            const users = await User.findAll({});

            return res.render('admin/users/index', {
                error: 'Usuário não encontrado. Selecione o usuário novamente!',
                users,
                loggedUser
            });
        }

        if(!loggedUser.is_admin) {
            const users = await User.findAll({});

            return res.render('admin/users/index', {
                error: 'Você não tem privilégios de administrador para alterar a conta de outro usuário',
                users,
                loggedUser
            });
        }

        return next();
    },
    async show(req, res, next) {
        const { id } = req.params;
        const user = await User.findOne({ where: {id} });

        if(!user)
            return res.render('admin/users/index', { error: 'Este usuário não existe' });

        req.user = user;
        return next();
    },
    async delete(req, res, next) {
        const { userID } = req.session;
        const { id } = req.body;
        const users = await User.findAll({});
        const loggedUser = await User.findOne({ where: { id: userID } });
        const user = await User.findOne({ where: {id} });

        if(!user)
            return res.render('admin/users/index', { error: 'Usuário não encontrado. Tente novamente!', users, loggedUser });
        
        if(user.id == userID)
            return res.render('admin/users/index', { error: 'Você não pode deletar a própria conta', users, loggedUser });

        if(!loggedUser.is_admin)
            return res.render('admin/users/index', { error: 'Você não tem privilégios de administrador para deletar usuários', users, loggedUser });

        return next();
    }
}