const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const User = require('../models/user.model');

const verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!"
            });
        }
        req.userId = decoded.id;
        next();
    });
};

const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId).exec();
        if (user.role === "admin") {
            next();
            return;
        }
        res.status(403).send({
            message: "Require Admin Role!"
        });
    } catch (err) {
        res.status(500).send({
            message: err.message
        });
    }
};

const isUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId).exec();
        if (user.role === "user") {
            next();
            return;
        }
        res.status(403).send({
            message: "Require User Role!"
        });
    } catch (err) {
        res.status(500).send({
            message: err.message
        });
    }
};

const authJwt = {
    verifyToken,
    isAdmin,
    isUser
};

module.exports = authJwt;
