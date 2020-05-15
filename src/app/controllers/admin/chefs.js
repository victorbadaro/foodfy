const Chef = require('../../models/admin/Chef')

module.exports = {
    index(req, res) {
        Chef.all(function(chefs) {
            return res.render('admin/chefs/index', { chefs })
        })
    },
    show(req, res) {
        const { id } = req.params

        Chef.find(id, function(chef) {
            return res.render('admin/chefs/show', { chef })
        })
    },
    edit(req, res) {
        const { id } = req.params

        Chef.find(id, function(chef) {
            return res.render('admin/chefs/edit', { chef })
        })
    },
    create(req, res) {
        return res.render('admin/chefs/create')
    },
    post(req, res) {
        const { name, avatar_url } = req.body

        if(!name)
            res.send('Preencha o nome do Chef!')
        
        const chef = {
            name,
            avatar_url
        }

        Chef.create(chef, function(chef) {
            return res.redirect(`/admin/chefs/${chef.id}`)
        })
    },
    put(req, res) {
        const { id, name, avatar_url } = req.body

        if(!name)
            return res.send('Preencha o nome do Chef!')
        
        const chef = {
            id,
            name,
            avatar_url
        }

        Chef.update(chef, function(chef) {
            return res.redirect(`/admin/chefs/${chef.id}`)
        })
    },
    delete(req, res) {
        const { id } = req.body

        Chef.delete(id, function() {
            return res.redirect('/admin/chefs')
        })
    }
}