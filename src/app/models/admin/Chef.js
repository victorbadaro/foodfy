const db = require('../../../config/db')
const { date } = require('../../../lib/utils')

module.exports = {
    all() {
        const query = `
            SELECT chefs.*, files.path AS avatar_url
            FROM chefs
            LEFT JOIN files ON (chefs.file_id = files.id)
            ORDER BY id ASC`

        return db.query(query)
    },
    create(data) {
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

        return db.query(query, values)
    },
    find(id) {
        const query = `
            SELECT chefs.*, (SELECT COUNT(*) FROM recipes WHERE chef_id = ${id}) AS total_recipes, files.path AS avatar_url
            FROM chefs
            LEFT JOIN files ON (chefs.file_id = files.id)
            WHERE chefs.id = ${id}`
        
        return db.query(query)
    },
    update(data) {
        const query = `
            UPDATE chefs SET
                name = $1,
                file_id = $2
            WHERE id = $3
            RETURNING id`
        const values = [
            data.name,
            data.file_id,
            data.id
        ]

        return db.query(query, values)
    },
    delete(id) {
        return db.query('DELETE FROM chefs WHERE id = $1', [id])
    },
    getRecipesFromChef(id) {        
        return db.query('SELECT * FROM recipes WHERE chef_id = $1', [id])
    }
}