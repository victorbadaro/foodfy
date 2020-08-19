const db = require('../../../config/db')

module.exports = {
    async all() {
        const result = await db.query('SELECT * FROM users')

        return result.rows
    },
    async create(data) {
        const query = `
            INSERT INTO users (
                name,
                email,
                password,
                is_admin,
                reset_token,
                reset_token_expires
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id`
        const values = [
            data.name,
            data.email,
            data.password,
            data.is_admin,
            data.reset_token,
            data.reset_token_expires
        ]

        const result = await db.query(query, values)

        return result.rows[0].id
    },
    async find(data) {
        let query = 'SELECT * FROM users'

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
    }
}