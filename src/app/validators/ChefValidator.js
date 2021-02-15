const User = require('../models/User');
const Chef = require('../models/Chef');
const Recipe = require('../models/Recipe');
const File = require('../models/File');

module.exports = {
    async post(req, res, next) {
        const { userID } = req.session;
        const { name } = req.body;
        const user = await User.findOne({ where: { id: userID } });

        if(!name)
            return res.render('admin/chefs/create', {
                error: 'Por favor, preencha o campo de nome!',
                chef: req.body,
                loggedUser: user,
                fields_error: { name: true }
            });

        if(!user.is_admin)
            return res.render('admin/chefs/index', {
                error: 'Somente administradores podem criar chefs',
                loggedUser: user
            });

        return next();
    },
    async update(req, res, next) {
        const { userID } = req.session;
        const { id, name } = req.body;
        const loggedUser = await User.findOne({ where: { id: userID } });

        const chef = await Chef.findOne({ where: {id} });

        if(!chef)
            return res.render('admin/chefs/index', {
                error: 'Este Chef já foi excluído do banco de dados',
                loggedUser
            });

        if(!name)
            return res.render('admin/chefs/edit', {
                error: 'Por favor, preencha o campo de nome!',
                chef: req.body,
                loggedUser,
                fields_error: { name: true }
            });

        if(!loggedUser.is_admin)
            return res.render('admin/chefs/index', {
                error: 'Somente administradores podem atualizar chefs',
                loggedUser
            });
        
        req.chef = chef;
        return next();
    },
    async delete(req, res, next) {
        const { userID } = req.session;
        const { id } = req.body;

        const chef = await Chef.findOne({ where: {id} });

        if(!chef)
            return res.render('admin/chefs/index', { error: 'Este Chef já foi excluído do banco de dados' });
        
        const recipesFromChef = await Recipe.findAll({ where: { chef_id: chef.id } });

        if(recipesFromChef.length > 0) {
            const chef_avatar = await File.findOne({ where: { id: chef.file_id }});

            return res.render('admin/chefs/edit', {
                error: 'Chefs que possuem receitas não podem ser deletados',
                chef: {
                    ...chef,
                    avatar_url: chef_avatar ? chef_avatar.path : null
                }
            });
        }
        
        const user = await User.findOne({ where: { id: userID }});

        if(!user.is_admin)
            return res.render('admin/chefs/index', { error: 'Somente administradores podem deletar chefs' });
        
        req.chef = chef;
        return next();
    }
}