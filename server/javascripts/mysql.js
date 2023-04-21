import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const db_host = process.env.DB_HOST;
const db_user = process.env.DB_USER;
const db_password = process.env.DB_PASSWORD;
const db_database = process.env.DB_DATABASE;

export const connection = await mysql.createConnection({
	host: db_host,
	user: db_user,
	password: db_password,
	database: db_database,
});
