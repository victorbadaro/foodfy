const Recipe = require('../models/Recipe');
const Chef = require('../models/Chef');
const File = require('../models/File');
const User = require('../models/User');

const fs = require('fs');

module.exports = {
    async index(req, res) {
        const { filter } = req.query;
        let { page, limit } = req.query;

        page = page || 1;
        limit = limit || 6;

        const offset = limit * (page - 1);

        let recipes = await Recipe.findRecipes({ search: filter, limit, offset });
        const filesPromises = recipes.map(recipe => Recipe.getFiles({ recipe_id: recipe.id, limit: 1 }));
        const files = await Promise.all(filesPromises);

        recipes = recipes.map(recipe => {
            const image = files.find(image => image.recipe_id === recipe.id);

            if(image)
                recipe.image = `${req.protocol}://${req.headers.host}/${image.path.replace('public\\', '').replace('\\', '/')}`;
            
            return recipe;
        });

        const pagination = {
            page,
            total: recipes.length > 0 ? Math.ceil(recipes[0].total / limit) : 0
        };

        if(!filter)
            return res.render('public/recipes/recipes', { recipes, pagination });
        else
            return res.render('public/recipes/filteredRecipes', { recipes, pagination, filter });
    },
    async show(req, res) {
        const { id } = req.params;
        const recipe = await Recipe.findOne({ where: {id} });
        const chef = await Chef.findOne({ where: { id: recipe.chef_id } });

        recipe.chef_name = chef.name;

        let files = await Recipe.getFiles({ recipe_id: recipe.id });

        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}/${file.path.replace('public\\', '').replace('\\', '/')}`
        }));

        return res.render('public/recipes/show', { recipe, files });
    },
    async adminIndex(req, res) {
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
        const { userID } = req.session;
        const loggedUser = await User.findOne({ where: { id: userID }});
        const chefs = await Chef.findAll({});

        return res.render('admin/recipes/create', { chefs, loggedUser });
    },
    async adminShow(req, res) {
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
        const { userID } = req.session;
        const files = req.files;
        const { title, chef, ingredients, preparation, information } = req.body;
        const recipeID = await Recipe.create({
            title,
            chef_id: chef,
            user_id: userID,
            ingredients,
            preparation,
            information
        });

        const newFilesPromises = files.map(file => File.create({ name: file.filename, path: file.path }));
        const newFiles = await Promise.all(newFilesPromises);

        const recipeFilesPromises = newFiles.map(file_id => Recipe.setFile({ recipe_id: recipeID, file_id }));
        await Promise.all(recipeFilesPromises);

        return res.redirect(`/admin/recipes/${recipeID}`);
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

        const newFilesPromises = files.map(file => File.create({ name: file.filename, path: file.path }));
        const newFiles = await Promise.all(newFilesPromises);

        const newRecipeFilesPromises = newFiles.map(file_id => Recipe.setFile({ recipe_id: recipeID, file_id }));
        await Promise.all(newRecipeFilesPromises);

        if(removed_files) {
            const removedIDFiles = removed_files.split(',');
            const lastIndex = removedIDFiles.length - 1;

            removedIDFiles.splice(lastIndex, 1);

            const removedFiles = await File.findAll({ where: { id: removedIDFiles } });

            removedFiles.forEach(file => fs.unlinkSync(file.path));

            const removedFilesPromises = removedFiles.map(file => File.delete(file.id));
            await Promise.all(removedFilesPromises);
        }

        return res.redirect(`/admin/recipes/${recipeID}`);
    },
    async delete(req, res) {
        const { id } = req.body;
        const filesToRemove = await Recipe.getFiles({ recipe_id: id });

        filesToRemove.forEach(file => {
            try {
                fs.unlinkSync(file.path);
            } catch (error) {
                console.log('Erro ao deletar o arquivo físico do projeto!');
            }
        });

        const filesToRemovePromises = filesToRemove.map(file => File.delete(file.id));

        await Promise.all(filesToRemovePromises);
        await Recipe.delete(id);
        return res.redirect('/admin/recipes');
    }
};