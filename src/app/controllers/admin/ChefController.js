const Chef = require('../../models/admin/Chef')
const File = require('../../models/admin/File')
const Recipe = require('../../models/admin/Recipe')
const User = require('../../models/admin/User')

module.exports = {
    async index(req, res) {
        const { userID } = req.session
        const result = await Chef.all()
        const chefs = result.rows
        const loggedUser = await User.find({ where: { id: userID } })

        return res.render('admin/chefs/index', { chefs, loggedUser })
    },
    async show(req, res) {
        const { id } = req.params
        const settedRecipes = []
        const chef = await Chef.find({ where: {id} })
        const recipes = await Chef.getRecipesFromChef(chef.id)
        
        const chef_avatar = await File.find({ where: { id: chef.file_id }})

        for(let recipe of recipes) {
            const files = await Recipe.getFiles(recipe.id)

            if(files.length > 0) {
                settedRecipes.push({
                    ...recipe,
                    image: `${req.protocol}://${req.headers.host}/${files[0].path.replace('public\\', '')}`
                })
            }
        }

        return res.render('admin/chefs/show', {
            chef: {
                ...chef,
                avatar_url: chef_avatar.path
            },
            recipes: settedRecipes
        })
    },
    async edit(req, res) {
        const { id } = req.params
        const chef = await Chef.find({ where: { id }})
        const chef_avatar = await File.find({ where: { id: chef.file_id }})

        return res.render('admin/chefs/edit', {
            chef: {
                ...chef,
                avatar_url: chef_avatar.path
            }
        })
    },
    create(req, res) {
        return res.render('admin/chefs/create')
    },
    async post(req, res) {
        const { name, avatar_url } = req.body
        let file_id
        
        if(avatar_url) {
            file_id = await File.create({
                name:`Avatar - ${name}`,
                path: avatar_url
            })
        }

        const chefID = await Chef.create({
            name,
            file_id
        })

        return res.redirect(`/admin/chefs/${chefID}`)
    },
    async update(req, res) {
        const { chef } = req
        const { id, name, avatar_url } = req.body
        
        const chefID = await Chef.update(id, { name })

        if(avatar_url) {
            await File.update(chef.file_id, {
                name: `Avatar - ${name}`,
                path: avatar_url
            })
        }

        return res.redirect(`/admin/chefs/${chefID}`)
    },
    async delete(req, res) {
        const { chef } = req
        
        await Chef.delete(chef.id)
        await File.delete(chef.file_id)
        return res.redirect('/admin/chefs')
    }
}