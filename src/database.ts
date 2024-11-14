import {Knex, knex as setupnex} from "knex";

export const config: Knex.Config = {
    client: "sqlite3",
    connection: {
        filename: "./db/app.db" // Caminho para o banco de dados SQLite
    },
    useNullAsDefault: true,
    migrations: {
        extension: 'ts',
        directory: './db/migrations',
    },
};

export const knex = setupnex(config)
