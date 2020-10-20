const db = require('../../../config/db')
const { date } = require('../../../lib/utils')

module.exports = {
    async all() {
        const query = `
            SELECT chefs.*, files.path AS avatar_url
            FROM chefs
            LEFT JOIN files ON (chefs.file_id = files.id)
            ORDER BY id ASC`

        const result = await db.query(query)
        return result.rows
    },
    async create(data) {
        const query = `
            INSERT INTO chefs(
                name,
                file_id,
                created_at
            ) VALUES($1, $2, $3)
            RETURNING id`
        const values = [
            data.name,
            data.file_id,
            date(Date.now()).isoDate
        ]

        const result = await db.query(query, values)
        return result.rows[0].id
    },
    async find(data) {
        let query = 'SELECT * FROM chefs'

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
        let query = 'UPDATE chefs SET'

        Object.keys(data).map((key, index, array) => {
            if((index + 1) < array.length)
                query = `${query} ${key} = '${data[key]}',`
            else
                query = `${query} ${key} = '${data[key]}'`
        })

        query = `
            ${query}
            WHERE id = $1
            RETURNING id`

        const result = await db.query(query, [id])
        return result.rows[0].id
    },
    async delete(id) {
        await db.query('DELETE FROM chefs WHERE id = $1', [id])
        return
    },
    async getRecipesFromChef(id) {
        const result = await db.query('SELECT * FROM recipes WHERE chef_id = $1 ORDER BY recipes.created_at DESC', [id])
        return result.rows
    }
}