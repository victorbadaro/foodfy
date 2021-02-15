const User = require('../models/User');

module.exports = {
    onlyUsers(req, res, next) {
        if(!req.session.userID)
            return res.redirect('/login');
        
        return next();
    },
    async onlyAdmins(req, res, next) {
        const { userID } = req.session;
        const user = await User.findOne({ where: { id: userID } });

        if(!user.is_admin)
            return res.redirect('/admin/recipes');
            
        return next();
    }
};