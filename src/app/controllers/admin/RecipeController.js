// const Recipe = require('../../models/admin/Recipe')
const Recipe = require('../../models/Recipe');
// const Chef = require('../../models/admin/Chef');
const Chef = require('../../models/Chef');
const File = require('../../models/admin/File');
// const User = require('../../models/admin/User');
const User = require('../../models/User');

module.exports = {
    async index(req, res) {
        const { userID } = req.session;
        const loggedUser = await User.findOne({ where: { id: userID }});
        let recipes = loggedUser.is_admin ? await Recipe.findRecipes({}) : await Recipe.findRecipes({ where: { user_id: loggedUser.id } });

        const filesPromises = recipes.map(recipe => Recipe.getFiles({ recipe_id: recipe.id, limit: 1 }));
        const files = await Promise.all(filesPromises);

        recipes = recipes.map(recipe => {
            const image = files.find(image => image.recipe_id === recipe.id);

            if(image)
                recipe.image = `${req.protocol}://${req.headers.host}/${image.path.replace('public\\', '').replace('\\', '/')}`;
            
            return recipe;
        });

        return res.render('admin/recipes/index', { recipes, loggedUser });
    },
    async create(req, res) {
        const { userID } = req.session
        const loggedUser = await User.find({ where: { id: userID }})
        const chefs = await Recipe.getChefs()

        return res.render('admin/recipes/create', { chefs, loggedUser })
    },
    async show(req, res) {
        const { userID } = req.session;
        const { id } = req.params;
        const loggedUser = await User.findOne({ where: { id: userID }});
        const recipe = await Recipe.findOne({ where: {id} });
        const chef = await Chef.findOne({ where: { id: recipe.chef_id }});
        let files = await Recipe.getFiles({ recipe_id: recipe.id });

        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}/${file.path.replace('public\\', '').replace('\\', '/')}`
        }));
    
        return res.render('admin/recipes/show', {
            recipe: {
                ...recipe,
                chef_name: chef.name
            },
            files,
            loggedUser
        });
    },
    async edit(req, res) {
        const { userID } = req.session;
        const { id } = req.params;
        const loggedUser = await User.findOne({ where: { id: userID }});
        const recipe = await Recipe.findOne({ where: {id} });
        const chefs = await Chef.findAll({});
        let files = await Recipe.getFiles({ recipe_id: recipe.id });

        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}/${file.path.replace('public\\', '').replace('\\', '/')}`
        }));

        return res.render('admin/recipes/edit', { recipe, files, chefs, loggedUser });
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
        const { id, title, chef, ingredients, preparation, information, removed_files } = req.body;
        const files = req.files;
        const recipeID = await Recipe.update(id, {
            title,
            chef_id: chef,
            ingredients,
            preparation,
            information
        });

        for(let file of files) {
            const fileID = await File.create({
                name: file.filename,
                path: file.path
            });

            await Recipe.setFile(recipeID, fileID);
        }

        if(removed_files) {
            const removedFiles = removed_files.split(',');
            const lastIndex = removedFiles.length - 1;

            removedFiles.splice(lastIndex, 1);

            let removedFilesPromises = removedFiles.map(file_id => Recipe.removeFile(recipeID, file_id));
            await Promise.all(removedFilesPromises);

            removedFilesPromises = removedFiles.map(file_id => File.delete(file_id));
            await Promise.all(removedFilesPromises);
        }

        return res.redirect(`/admin/recipes/${recipeID}`);
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