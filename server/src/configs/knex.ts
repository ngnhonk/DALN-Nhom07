import knex, { Knex } from "knex";
import dotenv from "dotenv";
dotenv.config();

const config: Knex.Config = {
    client: "mysql2",
    connection: {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: {
            ca: process.env.DB_CA,
            rejectUnauthorized: false,
        },
    },
};

const db: Knex = knex(config);

export default db;
