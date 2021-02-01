const Chef = require('../models/Chef');
const File = require('../models/File');

module.exports = {
    async index(req, res) {
        let chefs = await Chef.findAllChefs();
        const filesPromises = chefs.map(chef => File.findOne({ where: { id: chef.file_id } }));
        const files = await Promise.all(filesPromises);

        chefs = chefs.map(chef => {
            const file = files.find(file => file.id === chef.file_id);

            if(file)
                chef.avatar_url = file.path;
            
            return chef;
        });

        return res.render('public/chefs/index', { chefs })
    }
}