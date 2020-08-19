module.exports = {
    loginForm(req, res) {
        return res.render('session/login')
    },
    login(req, res) {
        const { user } = req

        req.session.userID = user.id
        return res.redirect('/admin/profile')
    },
    logout(req, res) {
        req.session.destroy()
        return res.redirect('/home')
    }
}