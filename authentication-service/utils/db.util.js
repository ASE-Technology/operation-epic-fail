const { MongoClient } = require("mongodb");
const dbConfig = require('../configs/db.config');
const uri = `mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}?maxPoolSize=2-&w=majority`;
const client = new MongoClient(uri);

const connect = async () => {
  try {
    await client.connect();
    console.log("Connected to DB");
  } catch (error) {
    console.log(error);
  }
};

const close = async () => {
  try {
    await client.close();
    console.log("Disconnected from DB");
  } catch (error) {
    console.log(error);
  }
};


const dbInstance = () => {
  return client.db();
};

module.exports = {
    connect,
    close,
    dbInstance
}