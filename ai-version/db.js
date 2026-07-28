// src/db.js
import { Sequelize } from "sequelize";
import "dotenv/config";

const {
  DB_NAME = "task_api",
  DB_USER = "postgres",
  DB_PASSWORD = "password",
  DB_HOST = "localhost",
  DB_PORT = "5432",
  DB_LOGGING = "false",
} = process.env;

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: Number(DB_PORT),
  dialect: "postgres",
  logging: DB_LOGGING === "true" ? console.log : false,
});