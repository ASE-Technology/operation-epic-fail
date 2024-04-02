const dbUtil = require('../utils/db.util');
const dbConfig = require('../configs/db.config');

const getUserByEmail = async (email) => {
    return await dbUtil.dbInstance().collection(dbConfig.USERS_COLLECTION).findOne({email: email});
}

const register = async (user) => {
    return await dbUtil.dbInstance().collection(dbConfig.USERS_COLLECTION).insertOne(user);
}

module.exports = {
    getUserByEmail,
    register
}