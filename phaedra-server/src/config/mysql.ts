import mysql from 'mysql2';
import config from './config';

export const db = mysql.createPool(config.database);
export const Knex = require('knex')(require('../../knexfile')['development']);
