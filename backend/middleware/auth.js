const User = require('../models/User');
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {

    let token;
    
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[2];
    }

    // console.log(token);

    if(!token) {
        return res.status(401).json({ error: 'Not authorized to access this route' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
 
        const user = await User.findOne({ _id: decoded.id });

        if(!user) {
            return res.status(404).json({ error: 'No user found with this id' });
        }

        req.user = user;

        next();

    } catch (error) {
        return res.status(401).json({ error: 'Not authorized to access this route' });
    }
}

module.exports = { auth };