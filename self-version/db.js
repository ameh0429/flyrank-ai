import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

// Connect to your Postgres database
// const sequelize = new Sequelize('taskdb', 'postgres', 'amehmathias049', {
//   host: 'localhost',
//   dialect: 'postgres',
// });

const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number.parseInt(process.env.DB_PORT, 10) || 5432,
    database: process.env.DB_NAME || 'taskdb',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    logging: false,
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
  });

// Define the Task model
const Task = sequelize.define('Task', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  done: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

// Create the table if it doesn’t exist
await sequelize.sync();

// Seed three example tasks only if the table is empty
const count = await Task.count();
if (count === 0) {
  await Task.bulkCreate([
    { title: 'Buy groceries', done: false },
    { title: 'Clean the house', done: true },
    { title: 'Finish project', done: false },
  ]);
}

export { sequelize, Task };

