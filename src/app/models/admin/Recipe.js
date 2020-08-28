const db = require('../../../config/db')
const { date } = require('../../../lib/utils')

module.exports = {
    async all() {
        const query = `
            SELECT recipes.*, chefs.name AS chef_name
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            ORDER BY recipes.created_at DESC`

        const result = await db.query(query)
        return result.rows
    },
    async allFromUser(user_id) {
        const query = `
            SELECT recipes.*, chefs.name AS chef_name
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE recipes.user_id = $1
            ORDER BY recipes.created_at DESC`

        const result = await db.query(query, [user_id])
        return result.rows
    },
    async create(data) {
        const query = `
            INSERT INTO recipes (
                chef_id,
                user_id,
                title,
                ingredients,
                preparation,
                information,
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id`
        const values = [
            data.chef,
            data.user_id,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            date(Date.now()).isoDate
        ]

        const result = await db.query(query, values)
        return result.rows[0].id
    },
    async find(data) {
        let query = 'SELECT * FROM recipes'

        Object.keys(data).map(key => {
            query = `
                ${query}
                ${key}`
            
            Object.keys(data[key]).map(field => {
                query = `${query} ${field} = '${data[key][field]}'`
            })
        })

        const result = await db.query(query)

        return result.rows[0]
    },
    async update(id, data) {
        const query = `
            UPDATE recipes SET
                title = $1,
                chef_id = $2,
                ingredients = $3,
                preparation = $4,
                information = $5
            WHERE id = $6
            RETURNING id`
        const values = [
            data.title,
            data.chef_id,
            data.ingredients,
            data.preparation,
            data.information,
            id
        ]

        const result = await db.query(query, values)
        return result.rows[0].id
    },
    async delete(id) {
        await db.query('DELETE FROM recipes WHERE id = $1', [id])
        return
    },
    async getChefs() {
        const result = await db.query('SELECT id, name FROM chefs ORDER BY id ASC')

        return result.rows
    },
    async setFile(recipe_id, file_id) {
        const query = `
            INSERT INTO recipe_files (
                recipe_id,
                file_id
            ) VALUES ($1, $2)`
        const values = [
            recipe_id,
            file_id
        ]

        await db.query(query, values)
        return
    },
    async getFiles(recipe_id) {
        const query = `
            SELECT files.*
            FROM files
            INNER JOIN recipe_files ON (files.id = recipe_files.file_id)
            WHERE recipe_files.recipe_id = $1`

        const result = await db.query(query, [recipe_id])
        return result.rows
    },
    async removeFile(recipe_id, file_id) {
        const result = await db.query('DELETE FROM recipe_files WHERE recipe_id = $1 AND file_id = $2 RETURNING file_id', [recipe_id, file_id])
        return result.rows[0].file_id
    }
}