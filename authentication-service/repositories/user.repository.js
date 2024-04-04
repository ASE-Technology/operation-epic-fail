const dbUtil = require('../utils/db.util');
const dbConfig = require('../configs/db.config');
const { ObjectId } = require('mongodb');

const getUserByEmail = async (email) => {
    return await dbUtil.dbInstance().collection(dbConfig.USERS_COLLECTION).findOne({email: email});
}

const getUserById = async (id) => {
    return await dbUtil.dbInstance().collection(dbConfig.USERS_COLLECTION).findOne({_id: new ObjectId(id)});
}

const updateUser = async (id, user) => {
    return await dbUtil.dbInstance().collection(dbConfig.USERS_COLLECTION).updateOne({_id: new ObjectId(id)}, { $set: user });
}

const register = async (user) => {
    return await dbUtil.dbInstance().collection(dbConfig.USERS_COLLECTION).insertOne(user);
}

module.exports = {
    getUserByEmail,
    getUserById,
    updateUser,
    register
}