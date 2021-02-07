// const User = require('../models/admin/User')
const User = require('../models/User');
const File = require('../models/admin/File')
const Chef = require('../models/admin/Chef')
// const Recipe = require('../models/admin/Recipe')
const Recipe = require('../models/Recipe');

module.exports = {
    async post(req, res, next) {
        const { userID } = req.session
        const loggedUser = await User.find({ where: { id: userID }})
        const { title, chef, ingredients, preparation } = req.body
        const files = req.files

        if(!files.length > 0) {
            const chefs = await Chef.all()

            return res.render('admin/recipes/create', {
                error: 'A receita deve ter ao menos uma imagem',
                recipe: req.body,
                loggedUser,
                chefs
            })
        }

        if(!title || !chef || !ingredients || ingredients == '' || !preparation || preparation == '') {
            const chefs = await Chef.all()

            files.map(file => File.deletePhysicalFile(file.path))
            return res.render('admin/recipes/create', {
                error: 'Os campos Nome da receita, Chef, Ingredientes e Modo de preparo são obrigatórios',
                recipe: req.body,
                loggedUser,
                fields_error: { title: true, chef: true, ingredients: true, preparation: true },
                chefs
            })
        }

        return next()
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
        const { userID } = req.session
        const { id, title, chef, ingredients, preparation } = req.body
        const { files } = req
        const recipe = await Recipe.find({ where: {id} })
        const loggedUser = await User.find({ where: { id: userID }})
        
        if(!recipe) {
            const recipes = loggedUser.is_admin ? await Recipe.all() : await Recipe.allFromUser(loggedUser.id)
            const settedRecipes = []

            for(let recipe of recipes) {
                const recipes_files = await Recipe.getFiles(recipe.id)

                if(recipes_files.length > 0) {
                    settedRecipes.push({
                        ...recipe,
                        image: `${req.protocol}://${req.headers.host}/${recipes_files[0].path.replace('public\\', '').replace('\\','/')}`
                    })
                } else {
                    settedRecipes.push(recipe)
                }
            }

            return res.render('admin/recipes/index', {
                error: 'Receita não encontrada',
                recipes: settedRecipes,
                loggedUser,
            })
        }
        
        let recipeFiles = await Recipe.getFiles(recipe.id)

        recipeFiles = recipeFiles.map(recipeFile => ({
            ...recipeFile,
            src: `${req.protocol}://${req.headers.host}/${recipeFile.path.replace('public\\', '')}`
        }))
        
        const recipe_files = await Recipe.getFiles(id)

        if(files.length + recipe_files.length == 0) {
            const chefs = await Chef.all()

            return res.render('admin/recipes/edit', {
                error: 'A receita deve ter ao menos uma imagem',
                recipe,
                files: recipeFiles,
                chefs,
                loggedUser
            })
        }

        if(!title || !chef || !ingredients || ingredients == '' || !preparation || preparation == '') {
            const chefs = await Chef.all()

            files.map(file => File.deletePhysicalFile(file.path))
            return res.render('admin/recipes/edit', {
                error: 'Os campos Nome da receita, Chef, Ingredientes e Modo de preparo são obrigatórios',
                recipe,
                files: recipeFiles,
                chefs,
                loggedUser,
                fields_error: { title: true, chef: true, ingredients: true, preparation: true }
            })
        }

        if(recipe.user_id != loggedUser.id && !loggedUser.is_admin) {
            const chefs = await Chef.all()

            files.map(file => File.deletePhysicalFile(file.path))
            return res.render('admin/recipes/edit', {
                error: 'Você não pode editar a receita de outro usuário',
                recipe,
                files: recipeFiles,
                chefs,
                loggedUser
            })
        }

        return next()
    },
    async delete(req, res, next) {
        const { userID } = req.session
        const { id } = req.body
        const loggedUser = await User.find({ where: { id: userID }})
        const recipe = await Recipe.find({ where: {id} })
        let recipeFiles = await Recipe.getFiles(recipe.id)

        recipeFiles = recipeFiles.map(recipeFile => ({
            ...recipeFile,
            src: `${req.protocol}://${req.headers.host}/${recipeFile.path.replace('public\\', '')}`
        }))

        if(!recipe)
            return res.render('admin/recipes/index', { error: 'Receita não encontrada!' })
        
        if(recipe.user_id != userID && !loggedUser.is_admin) {
            const chefs = await Chef.all()
            return res.render('admin/recipes/edit', { error: 'Você não tem privilégios de administrador para poder deletar uma receita de outro usuário', recipe, files: recipeFiles, chefs })
        }
        
        return next()
    }
}