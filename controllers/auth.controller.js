const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');


const registerUser = async (req) => {
    try {
        const { name, mobile_number, location } = req.body;

        const user = new User({
            name,
            mobile_number,
            location,
            role: 'user'
        });

        await user.save();
        return { status: 200, data: user, message: 'User registered successfully!' };
    } catch (error) {
        return { status: 500, message: error.message };
    }
};

const loginUser = async (req) => {
    try {
        const { mobile_number } = req.body;
        const user = await User.findOne({ mobile_number });

        if (!user) {
            return { status: 404, message: 'User not found.' };
        }

        const token = jwt.sign({ id: user.id, role: user.role }, config.secret, {
            expiresIn: config.jwtExpiration
        });

        return {
            status: 200,
            data: {
                id: user._id,
                name: user.name,
                mobile_number: user.mobile_number,
                role: user.role,
                accessToken: token
            }
        };
    } catch (error) {
        return { status: 500, message: error.message };
    }
};



const registerAdmin = async (req, res) => {
    try {
        const { name, mobile_number, location, adminaccesskey } = req.body;

        if (adminaccesskey !== config.adminAccessKey) {
            return res.status(401).send({ message: 'Invalid admin access key!' });
        }

        const user = new User({
            name,
            mobile_number,
            location,
            role: 'admin'
        });

        await user.save();
        res.send({ message: 'Admin registered successfully!' });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};



const loginAdmin = async (req, res) => {
    try {
        const { mobile_number, adminaccesskey } = req.body;
        const user = await User.findOne({ mobile_number });

        if (!user) {
            return res.status(404).send({ message: 'User not found.' });
        }

        if (adminaccesskey !== config.adminAccessKey) {
            return res.status(401).send({ message: 'Invalid admin access key!' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, config.secret, {
            expiresIn: config.jwtExpiration
        });

        res.status(200).send({
            id: user._id,
            name: user.name,
            mobile_number: user.mobile_number,
            role: user.role,
            accessToken: token
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

module.exports = {
    registerUser,
    registerAdmin,
    loginUser,
    loginAdmin
};
