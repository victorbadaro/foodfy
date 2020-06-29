const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, callback) => callback(null, './public/img'),
    filename: (req, file, callback) => callback(null, `${Date.now().toString()}-${file.originalname}`)
})
const fileFilter = (req, file, callback) => {
    const acceptedTypes = ['image/png', 'image/jpg', 'image/jpeg']
    const isAccepted = acceptedTypes.find(acceptedType => acceptedType === file.mimetype)

    if(isAccepted)
        return callback(null, true)
    
    return callback(null, false)
}

module.exports = multer({ storage, fileFilter })