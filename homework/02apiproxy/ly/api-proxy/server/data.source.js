require("reflect-metadata");
const { DataSource } = require("typeorm");
const { Post } = require("./entity/Post.js");
require('dotenv').config()

const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [Post],
    migrations: [],
    subscribers: [],
})
module.exports = { AppDataSource };