const Recipe = require('../../models/admin/Recipe')
const File = require('../../models/admin/File')

module.exports = {
    async index(req, res) {
        let result = await Recipe.all()
        const recipes = result.rows
        const settedRecipes = []

        for(let recipe of recipes) {
            result = await Recipe.getFiles(recipe.id)
            const files = result.rows

            if(files[0]) {
                settedRecipes.push({
                    ...recipe,
                    image: `${req.protocol}://${req.headers.host}/${files[0].path.replace('public\\', '')}`
                })
            } else {
                settedRecipes.push(recipe)
            }
        }

        return res.render('admin/recipes/index', { recipes: settedRecipes })
    },
    async create(req, res) {
        const result = await Recipe.getChefs()
        const chefs = result.rows

        return res.render('admin/recipes/create', { chefs })
    },
    async show(req, res) {
        const { id } = req.params
        
        let result = await Recipe.find(id)
        const recipe = result.rows[0]

        result = await Recipe.getFiles(recipe.id)
        let files = result.rows

        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}/${file.path.replace('public\\', '')}`
        }))
    
        return res.render('admin/recipes/show', { recipe, files })
    },
    async edit(req, res) {
        const { id } = req.params
        
        let result = await Recipe.find(id)
        const recipe = result.rows[0]

        result = await Recipe.getChefs()
        const chefs = result.rows

        result = await Recipe.getFiles(recipe.id)
        let files = result.rows

        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}/${file.path.replace('public\\', '')}`
        }))

        return res.render('admin/recipes/edit', { recipe, files, chefs })
    },
    async post(req, res) {
        const { title, chef, ingredients, preparation, information } = req.body
        const files = req.files

        if(!files[0] || !title || !chef || !ingredients || !preparation)
            return res.send('A receita deve ter ao menos uma imagem e os campos Nome da receita, Chef, Ingredientes e Modo de preparo são obrigatórios')
        
        const recipe = {
            title,
            chef,
            ingredients,
            preparation,
            information
        }

        let result = await Recipe.create(recipe)
        const recipe_id = result.rows[0].id

        for(let file of files) {
            result = await File.create(file.filename, file.path)
            await Recipe.setFile(recipe_id, result.rows[0].id)
        }

        return res.redirect(`/admin/recipes/${recipe_id}`)
    },
    async put(req, res) {
        const { id, title, chef, ingredients, preparation, information } = req.body
        const files = req.files

        if(!files[0] || !title || !chef || !ingredients || !preparation)
            return res.send('A receita deve ter ao menos uma imagem e os campos Nome da receita, Chef, Ingredientes e Modo de preparo são obrigatórios')
        
        const recipe = {
            id,
            title,
            chef,
            ingredients,
            preparation,
            information
        }

        let result = await Recipe.update(recipe)
        const recipe_id = result.rows[0].id

        for(let file of files) {
            result = await File.create(file.filename, file.path)
            await Recipe.setFile(recipe_id,result.rows[0].id)
        }

        if(req.body.removed_files) {
            const removedFiles = req.body.removed_files.split(',')
            const lastIndex = removedFiles.length - 1

            removedFiles.splice(lastIndex, 1)

            let removedFilesPromises = removedFiles.map(file_id => Recipe.removeFile(recipe_id, file_id))
            await Promise.all(removedFilesPromises)

            removedFilesPromises = removedFiles.map(file_id => File.delete(file_id))
            await Promise.all(removedFilesPromises)
        }

        return res.redirect(`/admin/recipes/${recipe_id}`)
    },
    async delete(req, res) {
        const { id } = req.body
        let result = await Recipe.getFiles(id)
        const filesToRemove = result.rows

        console.log(filesToRemove)
        // await Recipe.delete(id)
    
        return res.redirect('/admin/recipes')
    }
}