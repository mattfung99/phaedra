import dotenv from 'dotenv';
dotenv.config();

module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE
    },
    migrations: {
      directory: __dirname + '/src/db/migrations',
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: __dirname + '/src/db/seeds'
    }
  }
};
