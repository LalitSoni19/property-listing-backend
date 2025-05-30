const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req, res, next) {

    const token = req.header('Authorization');


    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const tokenValue = token.startsWith('Bearer ') ? token.split(' ')[1] : token;
        const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET_KEY);


        req.user = decoded.user;
        next(); // next middleware or route handler
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};