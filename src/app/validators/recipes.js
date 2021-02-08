const User = require('../models/User');
const File = require('../models/admin/File');
const Chef = require('../models/Chef');
const Recipe = require('../models/Recipe');

const fs = require('fs');

module.exports = {
    async post(req, res, next) {
        const { userID } = req.session;
        const files = req.files;
        const { title, chef, ingredients, preparation } = req.body;
        const loggedUser = await User.findOne({ where: { id: userID }});

        if(!files.length > 0) {
            const chefs = await Chef.findAll({});

            return res.render('admin/recipes/create', {
                error: 'A receita deve ter ao menos uma imagem',
                recipe: req.body,
                loggedUser,
                chefs
            });
        }

        if(!title || !chef || !ingredients || ingredients == '' || !preparation || preparation == '') {
            const chefs = await Chef.findAll({});

            files.map(file => fs.unlinkSync(file.path));
            return res.render('admin/recipes/create', {
                error: 'Os campos Nome da receita, Chef, Ingredientes e Modo de preparo são obrigatórios',
                recipe: req.body,
                loggedUser,
                fields_error: { title: true, chef: true, ingredients: true, preparation: true },
                chefs
            });
        }

        return next();
    },
    async edit(req, res, next) {
        const { userID } = req.session;
        const { id } = req.params;
        const user = await User.findOne({ where: { id: userID }});
        const recipe = await Recipe.findOne({ where: {id} });

        if(recipe.user_id != user.id && !user.is_admin)
            return res.redirect('/admin/recipes');

        return next();
    },
    async update(req, res, next) {
        const { files } = req;
        const { userID } = req.session;
        const { id, title, chef, ingredients, preparation } = req.body;
        const recipe = await Recipe.findOne({ where: {id} });
        const loggedUser = await User.findOne({ where: { id: userID }});
        
        if(!recipe) {
            let recipes = loggedUser.is_admin ? await Recipe.findRecipes({}) : await Recipe.findRecipes({ where: { user_id: loggedUser.id } });

            const filesPromises = recipes.map(recipe => Recipe.getFiles({ recipe_id: recipe.id, limit: 1 }));
            const files = await Promise.all(filesPromises);

            recipes = recipes.map(recipe => {
                const image = files.find(image => image.recipe_id === recipe.id);

                if(image)
                    recipe.image = `${req.protocol}://${req.headers.host}/${image.path.replace('public\\', '').replace('\\', '/')}`;
                
                return recipe;
            });

            return res.render('admin/recipes/index', {
                error: 'Receita não encontrada',
                recipes,
                loggedUser,
            });
        }
        
        let recipeFiles = await Recipe.getFiles({ recipe_id: recipe.id });

        recipeFiles = recipeFiles.map(recipeFile => ({
            ...recipeFile,
            src: `${req.protocol}://${req.headers.host}/${recipeFile.path.replace('public\\', '')}`
        }));

        if(files.length + recipeFiles.length == 0) {
            const chefs = await Chef.findAll({});

            return res.render('admin/recipes/edit', {
                error: 'A receita deve ter ao menos uma imagem',
                recipe,
                files: recipeFiles,
                chefs,
                loggedUser
            });
        }

        if(!title || !chef || !ingredients || ingredients == '' || !preparation || preparation == '') {
            const chefs = await Chef.findAll({});

            files.map(file => fs.unlinkSync(file.path));
            return res.render('admin/recipes/edit', {
                error: 'Os campos Nome da receita, Chef, Ingredientes e Modo de preparo são obrigatórios',
                recipe,
                files: recipeFiles,
                chefs,
                loggedUser,
                fields_error: { title: true, chef: true, ingredients: true, preparation: true }
            });
        }

        if(recipe.user_id != loggedUser.id && !loggedUser.is_admin) {
            const chefs = await Chef.findAll({});

            files.map(file => fs.unlinkSync(file.path));
            return res.render('admin/recipes/edit', {
                error: 'Você não pode editar a receita de outro usuário',
                recipe,
                files: recipeFiles,
                chefs,
                loggedUser
            });
        }

        return next();
    },
    async delete(req, res, next) {
        const { userID } = req.session;
        const { id } = req.body;
        const loggedUser = await User.findOne({ where: { id: userID } });
        const recipe = await Recipe.findOne({ where: {id} });
        let recipeFiles = await Recipe.getFiles({ recipe_id: recipe.id });

        recipeFiles = recipeFiles.map(recipeFile => ({
            ...recipeFile,
            src: `${req.protocol}://${req.headers.host}/${recipeFile.path.replace('public\\', '')}`
        }));

        if(!recipe)
            return res.render('admin/recipes/index', { error: 'Receita não encontrada!' });
        
        if(recipe.user_id != userID && !loggedUser.is_admin) {
            const chefs = await Chef.findAll({});
            return res.render('admin/recipes/edit', { error: 'Você não tem privilégios de administrador para poder deletar uma receita de outro usuário', recipe, files: recipeFiles, chefs });
        }
        
        return next();
    }
}