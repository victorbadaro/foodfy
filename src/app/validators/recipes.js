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
        const { id, title, chef, ingredients, preparation } = req.body
        const files = req.files
        const recipe = await Recipe.find({ where: {id} })

        if(!recipe)
            return res.render('admin/recipes/index', { error: 'Receita não encontrada!' })

        const recipe_files = await Recipe.getFiles(id)

        if(files.length + recipe_files.length == 0) {
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
    async delete(req, res, next) {
        const { userID } = req.session
        const loggedUser = User.find({ where: { id: userID }})
        const { id } = req.body
        const recipe = await Recipe.find({ where: {id} })

        if(!recipe)
            return res.render('admin/recipes/index', { error: 'Receita não encontrada!' })
        
        if(recipe.user_id != userID && !loggedUser.is_admin)
            return res.render('admin/recipe/edit', { error: 'Você não tem privilégios de administrador para poder deletar uma receita de outro usuário', recipe: req.body })
        
        return next()
    }
}