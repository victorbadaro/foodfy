const db = require('../../../config/db')

module.exports = {
    create(name, path) {
        const query = `
            INSERT INTO files (
                name,
                path
            ) VALUES ($1, $2)`
        const values = [
            name,
            path
        ]

        return db.query(query, values)
    },
    delete(id) {

    }
}