const db = require('../../../config/db')
const fs = require('fs')

module.exports = {
    create(name, path) {
        const query = `
            INSERT INTO files (
                name,
                path
            ) VALUES ($1, $2)
            RETURNING id`
        const values = [
            name,
            path
        ]

        return db.query(query, values)
    },
    find(id) {
        return db.query('SELECT * FROM files WHERE id = $1', [id])
    },
    async delete(id) {
        try {
            const result = await this.find(id)
            const file = result.rows[0]

            fs.unlinkSync(file.path)
            
            return db.query('DELETE FROM files WHERE id = $1', [id])
        } catch (error) {
            console.log(error)
        }
    }
}