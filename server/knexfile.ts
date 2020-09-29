import path from 'path';
import knex from 'knex';

//seeds serve para popular dados na tabela gerlamente utilizado para popular dados padrões

module.exports = {
    client: 'sqlite3',
    connection: {
        filename: path.resolve(__dirname,'src', 'database', 'database.sqlite'),
    },
    migrations: {
        directory: path.resolve(__dirname, 'src', 'database', 'migrations'),
    },
    seeds: {
        directory: path.resolve(__dirname, 'src', 'database', 'seeds'),
    },
    useNullAsDefault: true,
};