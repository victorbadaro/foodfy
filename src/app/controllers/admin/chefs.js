const Chef = require('../../models/admin/Chef')
const File = require('../../models/admin/File')
const Recipe = require('../../models/admin/Recipe')

module.exports = {
    async index(req, res) {
        const result = await Chef.all()
        const chefs = result.rows

        return res.render('admin/chefs/index', { chefs })
    },
    async show(req, res) {
        const { id } = req.params
        const settedRecipes = []

        let result = await Chef.find(id)
        const chef = result.rows[0]

        result = await Chef.getRecipesFromChef(chef.id)
        const recipes = result.rows

        for(let recipe of recipes) {
            result = await Recipe.getFiles(recipe.id)
            const files = result.rows

            if(files[0]) {
                settedRecipes.push({
                    ...recipe,
                    image: `${req.protocol}://${req.headers.host}/${files[0].path.replace('public\\', '')}`
                })
            }
        }

        return res.render('admin/chefs/show', { chef, recipes: settedRecipes })
    },
    async edit(req, res) {
        const { id } = req.params
        const result = await Chef.find(id)
        const chef = result.rows[0]

        return res.render('admin/chefs/edit', { chef })
    },
    create(req, res) {
        return res.render('admin/chefs/create')
    },
    async post(req, res) {
        const { name, avatar_url } = req.body
        let result = ''
        let file_id

        if(!name)
            res.send('Preencha o nome do Chef!')
        
        if(avatar_url) {
            result = await File.create(`Avatar - ${name}`, avatar_url)
            file_id = result.rows[0].id
        }
        
        const chef = {
            name,
            file_id
        }

        result = await Chef.create(chef)
        const chef_id = result.rows[0].id

        return res.redirect(`/admin/chefs/${chef_id}`)
    },
    async put(req, res) {
        const { id, name, avatar_url } = req.body
        let result = ''
        let file_id

        if(!name)
            return res.send('Preencha o nome do Chef!')
        
        if(avatar_url) {
            result = await File.create(`Avatar - ${name}`, avatar_url)
            file_id = result.rows[0].id
        }
        
        const chef = {
            id,
            name,
            file_id
        }

        result = await Chef.update(chef)
        const chef_id = result.rows[0].id

        return res.redirect(`/admin/chefs/${chef.id}`)
    },
    async delete(req, res) {
        const { id } = req.body
        let result = ''

        result = await Chef.getRecipesFromChef(id)
        const recipesFromChef = result.rows

        if(recipesFromChef.length > 0)
            return res.send('Chefs que possuem receitas não podem ser deletados')
        
        await Chef.delete(id)

        return res.redirect('/admin/chefs')
    }
}