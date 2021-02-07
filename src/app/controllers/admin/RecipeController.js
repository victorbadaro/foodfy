// const Recipe = require('../../models/admin/Recipe')
const Recipe = require('../../models/Recipe');
const Chef = require('../../models/admin/Chef');
const File = require('../../models/admin/File');
const User = require('../../models/admin/User');

module.exports = {
    async index(req, res) {
        const { userID } = req.session;
        const loggedUser = await User.find({ where: { id: userID }});
        const recipes = loggedUser.is_admin ? await Recipe.findRecipes({}) : await Recipe.findRecipes({ where: { user_id: loggedUser.id } });
        const settedRecipes = [];

        for(let recipe of recipes) {
            const files = await Recipe.getFiles(recipe.id);

            if(files.length > 0) {
                settedRecipes.push({
                    ...recipe,
                    image: `${req.protocol}://${req.headers.host}/${files[0].path.replace('public\\', '').replace('\\','/')}`
                });
            } else {
                settedRecipes.push(recipe);
            }
        }

        return res.render('admin/recipes/index', {
            recipes: settedRecipes,
            loggedUser
        });
    },
    async create(req, res) {
        const { userID } = req.session
        const loggedUser = await User.find({ where: { id: userID }})
        const chefs = await Recipe.getChefs()

        return res.render('admin/recipes/create', { chefs, loggedUser })
    },
    async show(req, res) {
        const { userID } = req.session
        const loggedUser = await User.find({ where: { id: userID }})
        const { id } = req.params
        const recipe = await Recipe.find({ where: {id} })
        const chef = await Chef.find({ where: { id: recipe.chef_id }})
        let files = await Recipe.getFiles(recipe.id)

        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}/${file.path.replace('public\\', '').replace('\\', '/')}`
        }))
    
        return res.render('admin/recipes/show', {
            recipe: {
                ...recipe,
                chef_name: chef.name
            },
            files,
            loggedUser
        })
    },
    async edit(req, res) {
        const { userID } = req.session
        const loggedUser = await User.find({ where: { id: userID }})
        const { id } = req.params
        const recipe = await Recipe.find({ where: {id} })
        const chefs = await Recipe.getChefs()
        let files = await Recipe.getFiles(recipe.id)

        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}/${file.path.replace('public\\', '').replace('\\', '/')}`
        }))

        return res.render('admin/recipes/edit', { recipe, files, chefs, loggedUser })
    },
    async post(req, res) {
        const { userID } = req.session
        const { title, chef, ingredients, preparation, information } = req.body

        const files = req.files
        const recipeID = await Recipe.create({
            title,
            chef,
            user_id: userID,
            ingredients,
            preparation,
            information
        })

        for(let file of files) {
            const fileID = await File.create({
                name: file.filename,
                path: file.path
            })

            await Recipe.setFile(recipeID, fileID)
        }

        return res.redirect(`/admin/recipes/${recipeID}`)
    },
    async update(req, res) {
        const { id, title, chef, ingredients, preparation, information, removed_files } = req.body

        const files = req.files
        const recipeID = await Recipe.update(id, {
            title,
            chef_id: chef,
            ingredients,
            preparation,
            information
        })

        for(let file of files) {
            const fileID = await File.create({
                name: file.filename,
                path: file.path
            })

            await Recipe.setFile(recipeID, fileID)
        }

        if(removed_files) {
            const removedFiles = removed_files.split(',')
            const lastIndex = removedFiles.length - 1

            removedFiles.splice(lastIndex, 1)

            let removedFilesPromises = removedFiles.map(file_id => Recipe.removeFile(recipeID, file_id))
            await Promise.all(removedFilesPromises)

            removedFilesPromises = removedFiles.map(file_id => File.delete(file_id))
            await Promise.all(removedFilesPromises)
        }

        return res.redirect(`/admin/recipes/${recipeID}`)
    },
    async delete(req, res) {
        const { id } = req.body
        
        const filesToRemove = await Recipe.getFiles(id)

        let filesToRemovePromises = filesToRemove.map(file => Recipe.removeFile(id, file.id))
        await Promise.all(filesToRemovePromises)

        filesToRemovePromises = filesToRemove.map(file => File.delete(file.id))
        await Promise.all(filesToRemovePromises)

        await Recipe.delete(id)
    
        return res.redirect('/admin/recipes')
    }
}