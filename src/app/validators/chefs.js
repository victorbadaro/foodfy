const User = require('../models/admin/User')
const Chef = require('../models/admin/Chef')
const File = require('../models/admin/File')

module.exports = {
    async post(req, res, next) {
        const { userID } = req.session
        const { name } = req.body

        if(!name)
            return res.render('admin/chefs/create', { error: 'Preencha todos os campos obrigatórios!', chef: req.body })
        
        const user = await User.find({ where: { id: userID } })

        if(!user.is_admin)
            return res.render('admin/chefs/index', { error: 'Somente administradores podem criar chefs' })

        return next()
    },
    async update(req, res, next) {
        const { userID } = req.session
        const { id, name } = req.body

        const chef = await Chef.find({ where: {id} })

        if(!chef)
            return res.render('admin/chefs/index', { error: 'Este Chef já foi excluído do banco de dados' })

        if(!name)
            return res.render('admin/chefs/edit', { error: 'Preencha todos os campos obrigatórios!', chef: req.body } )
        
        const user = await User.find({ where: { id: userID }})

        if(!user.is_admin)
            return res.render('admin/chefs/index', { error: 'Somente administradores podem atualizar chefs' })
        
        req.chef = chef
        return next()
    },
    async delete(req, res, next) {
        const { userID } = req.session
        const { id } = req.body

        const chef = await Chef.find({ where: {id} })

        if(!chef)
            return res.render('admin/chefs/index', { error: 'Este Chef já foi excluído do banco de dados' })
        
        const recipesFromChef = await Chef.getRecipesFromChef(chef.id)

        if(recipesFromChef.length > 0) {
            const chef_avatar = await File.find({ where: { id: chef.file_id }})

            return res.render('admin/chefs/edit', {
                error: 'Chefs que possuem receitas não podem ser deletados',
                chef: {
                    ...chef,
                    avatar_url: chef_avatar.path
                }
            })
        }
        
        const user = await User.find({ where: { id: userID }})

        if(!user.is_admin)
            return res.render('admin/chefs/index', { error: 'Somente administradores podem deletar chefs' })
        
        req.chef = chef
        return next()
    }
}