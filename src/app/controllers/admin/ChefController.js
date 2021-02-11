const Chef = require('../../models/Chef');
const File = require('../../models/File');
const Recipe = require('../../models/Recipe');
const User = require('../../models/User');

module.exports = {
    async index(req, res) {
        const { userID } = req.session;
        const loggedUser = await User.findOne({ where: { id: userID } });
        let chefs = await Chef.findAll({});
        const filesPromises = chefs.map(chef => File.findOne({ where: { id: chef.file_id } }));
        const files = await Promise.all(filesPromises);

        chefs = chefs.map(chef => {
            const file = files.find(file => file.id === chef.file_id);

            if(file)
                chef.avatar_url = file.path;
            
            return chef;
        });

        return res.render('admin/chefs/index', { chefs, loggedUser });
    },
    async show(req, res) {
        const { userID } = req.session;
        const { id } = req.params;
        const loggedUser = await User.findOne({ where: { id: userID } });
        const chef = await Chef.findOne({ where: {id} });

        console.log(chef);

        const chef_avatar = await File.findOne({ where: { id: chef.file_id }});
        
        let recipes = await Recipe.findAll({ where: { chef_id: chef.id } });
        const filesPromises = recipes.map(recipe => Recipe.getFiles({ recipe_id: recipe.id, limit: 1 }));
        const files = await Promise.all(filesPromises);

        recipes = recipes.map(recipe => {
            const image = files.find(file => file.recipe_id === recipe.id);

            if(image)
                recipe.image = image;

            return recipe;
        });

        return res.render('admin/chefs/show', {
            chef: {
                ...chef,
                avatar_url: chef_avatar.path
            },
            recipes,
            loggedUser
        });
    },
    async edit(req, res) {
        const { userID } = req.session
        const loggedUser = await User.find({ where: { id: userID } })
        const { id } = req.params
        const chef = await Chef.find({ where: { id }})
        const chef_avatar = await File.find({ where: { id: chef.file_id }})

        return res.render('admin/chefs/edit', {
            chef: {
                ...chef,
                avatar_url: chef_avatar.path
            },
            loggedUser
        })
    },
    async create(req, res) {
        const { userID } = req.session
        const loggedUser = await User.findOne({ where: { id: userID } })

        return res.render('admin/chefs/create', { loggedUser })
    },
    async post(req, res) {
        const { name, avatar_url } = req.body;
        let file_id;
        let chefID;
        
        if(avatar_url) {
            file_id = await File.create({
                name:`Avatar - ${name}`,
                path: avatar_url
            });

            chefID = await Chef.create({
                name,
                file_id
            });
        } else {
            chefID = await Chef.create({
                name,
                file_id: null
            });
        }

        return res.redirect(`/admin/chefs/${chefID}`);
    },
    async update(req, res) {
        const { chef } = req
        const { id, name, avatar_url } = req.body
        
        const chefID = await Chef.update(id, { name })

        await File.update(chef.file_id, {
            name: `Avatar - ${name}`,
            path: avatar_url ? avatar_url : ''
        })

        return res.redirect(`/admin/chefs/${chefID}`)
    },
    async delete(req, res) {
        const { chef } = req
        
        await Chef.delete(chef.id)
        await File.delete(chef.file_id)
        return res.redirect('/admin/chefs')
    }
}