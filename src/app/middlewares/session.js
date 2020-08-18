module.exports = {
    onlyUsers(req, res, next) {
        if(!req.session.userID)
            return res.redirect('/admin/users/login')
        
        return next()
    }
}