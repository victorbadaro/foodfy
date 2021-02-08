const db = require('../../../config/db');
const fs = require('fs');

module.exports = {
    async create(data) {
        const query = `
            INSERT INTO files (
                name,
                path
            ) VALUES ($1, $2)
            RETURNING id`;
        const values = [
            data.name,
            data.path
        ];

        const result = await db.query(query, values);
        return result.rows[0].id;
    },
    async find(data) {
        let query = 'SELECT * FROM files';

        Object.keys(data).map(key => {
            query = `
                ${query}
                ${key}`;
            
            Object.keys(data[key]).map(field => {
                query = `${query} ${field} = '${data[key][field]}'`
            });
        });

        const result = await db.query(query);

        return result.rows[0];
    },
    async update(id, data) {
        let query = 'UPDATE files SET';

        Object.keys(data).map((key, index, array) => {
            if((index + 1) < array.length)
                query = `${query} ${key} = '${data[key]}',`;
            else
                query = `${query} ${key} = '${data[key]}'`;
        });

        query = `
            ${query}
            WHERE id = $1
            RETURNING id`;

        const result = await db.query(query, [id]);
        return result.rows[0].id;
    },
    async delete(id) {
        try {
            const file = await this.find({ where: {id} });
            const hasFile = fs.existsSync(file.path);

            if(hasFile)
                this.deletePhysicalFile(file.path);
            
            await db.query('DELETE FROM files WHERE id = $1', [id]);
            return;
        } catch (error) {
            console.log(error);
        }
    },
    deletePhysicalFile(path) {
        fs.unlinkSync(path);
    }
}