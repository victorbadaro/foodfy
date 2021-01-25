const db = require('../../config/db');
const Base = require('./Base');

Base.init({ table: 'recipes' });

module.exports = {
    ...Base,
    async findRecipes(filters) {
        let query = `
            SELECT recipes.*, chefs.name AS chef_name
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)`

        let limit = null
        let offset = null

        if(filters)
            Object.keys(filters).forEach(key => {
                if(key != 'limit' && key != 'offset') {
                    query += ` ${key}`
                    
                    Object.keys(filters[key]).forEach(field => {
                        let values = filters[key][field]
                        
                        if(Array.isArray(values))
                            values = values.map(value => `'${value}'`)
                        else
                            values = `'${values}'`
                        
                        query += ` ${field} IN (${values})`
                    })
                }
            })
    
        if(filters.limit)
            limit = filters.limit
        
        if(filters.offset)
            offset = filters.offset
        
        query += ` LIMIT ${limit} OFFSET ${offset}`

        const result = await db.query(query)

        return result.rows
    },
    async getFiles(params) {
        let limit = null

        if(params.limit)
            limit = params.limit
        
        const query = `
            SELECT files.*
            FROM files
            INNER JOIN recipe_files ON (files.id = recipe_files.file_id)
            WHERE recipe_files.recipe_id = ${params.recipe_id}
            LIMIT ${limit}`

        const result = await db.query(query)

        return result.rows
    }
}