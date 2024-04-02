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
            return res.status(409).send("User with this email already exists");
        }

        await service.register(user);
        res.send(200);
    } catch (err) {
        console.error(`Error while getting entity`, err.message);
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
            return res.status(404).send("User not found");
        }

        const passwordIsValid = bcrypt.compareSync(user.password, existingUser.password);
        if (!passwordIsValid) {
            return res.status(404).send("Wrong password");
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
        console.error(`Error while getting entities`, err.message);
        next(err);
    }
}

async function verifyToken(req, res, next) {
    try {
        const token = {
            token: req.body.token
        }

        jwt.verify(token.token, jwtConfig.SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).send({ message: "Unauthorized!" });
            }

            res.send({
                id: decoded.id,
                email: decoded.email
            });
        });
    } catch (err) {
        console.error(`Error while getting entities`, err.message);
        next(err);
    }
}

module.exports = {
    register,
    login,
    verifyToken,
};