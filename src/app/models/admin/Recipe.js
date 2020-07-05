const db = require('../../../config/db')
const { date } = require('../../../lib/utils')

module.exports = {
    all() {
        const query = `
            SELECT recipes.*, chefs.name AS chef_name
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            ORDER BY recipes.created_at DESC`

        return db.query(query)
    },
    create(data) {
        const query = `
            INSERT INTO recipes (
                chef_id,
                title,
                ingredients,
                preparation,
                information,
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id`
        const values = [
            data.chef,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            date(Date.now()).isoDate
        ]

        return db.query(query, values)
    },
    find(id) {
        const query = `
            SELECT recipes.*, chefs.name AS chef_name
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE recipes.id = ${id}`

        return db.query(query)
    },
    update(data) {
        const query = `
            UPDATE recipes SET
                chef_id = $1,
                title = $2,
                ingredients = $3,
                preparation = $4,
                information = $5
            WHERE id = $6
            RETURNING id`
        const values = [
            data.chef,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            data.id
        ]

        return db.query(query, values)
    },
    delete(id) {
        return db.query('DELETE FROM recipes WHERE id = $1', [id])
    },
    getChefs() {
        const query = `SELECT id, name FROM chefs ORDER BY id ASC`

        return db.query(query)
    },
    setFile(recipe_id, file_id) {
        const query = `
            INSERT INTO recipe_files (
                recipe_id,
                file_id
            ) VALUES ($1, $2)`
        const values = [
            recipe_id,
            file_id
        ]

        return db.query(query, values)
    },
    getFiles(recipe_id) {
        const query = `
            SELECT files.*
            FROM files
            INNER JOIN recipe_files ON (files.id = recipe_files.file_id)
            WHERE recipe_files.recipe_id = ${recipe_id}`

        return db.query(query)
    },
    removeFile(recipe_id, file_id) {
        return db.query('DELETE FROM recipe_files WHERE recipe_id = $1 AND file_id = $2 RETURNING file_id', [recipe_id, file_id])
    }
}