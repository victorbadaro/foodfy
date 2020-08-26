const User = require('../models/admin/User')
const File = require('../models/admin/File')
const Chef = require('../models/admin/Chef')
const Recipe = require('../models/admin/Recipe')

module.exports = {
    async post(req, res, next) {
        const { title, chef, ingredients, preparation } = req.body
        const files = req.files

        if(!files.length > 0) {
            const chefs = await Chef.all()

            return res.render('admin/recipes/create', { error: 'A receita deve ter ao menos uma imagem', recipe: req.body, chefs })
        }

        if(!title || !chef || !ingredients || ingredients == '' || !preparation || preparation == '') {
            const chefs = await Chef.all()

            files.map(file => File.deletePhysicalFile(file.path))
            return res.render('admin/recipes/create', { error: 'Os campos Nome da receita, Chef, Ingredientes e Modo de preparo são obrigatórios', recipe: req.body, chefs })
        }

        return next()
    },
    async update(req, res, next) {
        const { userID } = req.session
        const { id, title, chef, ingredients, preparation } = req.body
        const files = req.files
        const recipe = await Recipe.find({ where: {id} })
        const loggedUser = await User.find({ where: { id: userID }})
        let recipeFiles = await Recipe.getFiles(recipe.id)

        recipeFiles = recipeFiles.map(recipeFile => ({
            ...recipeFile,
            src: `${req.protocol}://${req.headers.host}/${recipeFile.path.replace('public\\', '')}`
        }))

        if(!recipe)
            return res.render('admin/recipes/index', { error: 'Receita não encontrada!' })

        const recipe_files = await Recipe.getFiles(id)

        if(files.length + recipe_files.length == 0) {
            const chefs = await Chef.all()

            return res.render('admin/recipes/edit', { error: 'A receita deve ter ao menos uma imagem', recipe, files: recipeFiles, chefs })
        }

        if(!title || !chef || !ingredients || ingredients == '' || !preparation || preparation == '') {
            const chefs = await Chef.all()

            files.map(file => File.deletePhysicalFile(file.path))
            return res.render('admin/recipes/edit', { error: 'Os campos Nome da receita, Chef, Ingredientes e Modo de preparo são obrigatórios', recipe, files: recipeFiles, chefs })
        }

        if(recipe.user_id != loggedUser.id && !loggedUser.is_admin) {
            const chefs = await Chef.all()

            files.map(file => File.deletePhysicalFile(file.path))
            return res.render('admin/recipes/edit', { error: 'Você não pode editar a receita de outro usuário', recipe, files: recipeFiles, chefs })
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