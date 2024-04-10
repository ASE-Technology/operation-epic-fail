const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const jwtConfig = require('../configs/jwt.config');
const repository = require('../repositories/user.repository');

async function register(req, res, next) {
    try {
        const user = {
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password),
            added: new Date()
        }

        const existingUser = await repository.getUserByEmail(user.email);
        if (existingUser) {
            return res.status(409).send({message: "User with this email already exists"});
        }

        await repository.register(user);
        res.status(200).send();
    } catch (err) {
        console.error(`Error while register`, err.message);
        next(err);
    }
}

async function login(req, res, next) {
    try {
        const user = {
            email: req.body.email,
            password: req.body.password
        }

        const existingUser = await repository.getUserByEmail(user.email);
        if (!existingUser) {
            return res.status(404).send({message: "User not found"});
        }

        const passwordIsValid = bcrypt.compareSync(user.password, existingUser.password);
        if (!passwordIsValid) {
            return res.status(404).send({message: "Wrong password"});
        }

        const token = jwt.sign({
            id: existingUser._id,
            email: existingUser.email,
            role: 'user'
        }, jwtConfig.SECRET, {
            expiresIn: 86400 // 24 hours
        });

        res.status(200).send({
            id: existingUser._id,
            email: existingUser.email,
            accessToken: token
        });
    } catch (err) {
        console.error(`Error while login`, err.message);
        next(err);
    }
}

async function updateProfile(req, res, next) {
    try {
        const updateProfile = {
            email: req.body.email,
            newPassword: req.body.newPassword,
            oldPassword: req.body.oldPassword,
        }

        const userToUpdate = await repository.getUserById(req.user.id);
        if (!userToUpdate) {
            return res.status(404).send({message: "User not found"});
        }

        const passwordIsValid = bcrypt.compareSync(updateProfile.oldPassword, userToUpdate.password);
        if (!passwordIsValid) {
            return res.status(404).send({message: "Wrong old password"});
        }

        userToUpdate.email = updateProfile.email;
        userToUpdate.password = bcrypt.hashSync(updateProfile.newPassword);

        await repository.updateUser(req.user.id, userToUpdate);
        res.status(201).send();

    } catch (err) {
        console.error(`Error while updating profile`, err.message);
        next(err);
    }
}

async function getProfile(req, res, next) {
    try {
        res.send(req.user);
    } catch (err) {
        console.error(`Error while getting profile`, err.message);
        next(err);
    }
}

module.exports = {
    register,
    login,
    updateProfile,
    getProfile
};